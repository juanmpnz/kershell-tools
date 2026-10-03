export type Point = [number, number];
export interface Slot { id: string; points: Point[] }
export interface Camera { version: 1; name: string; url: string; kind: 'image' | 'video' | 'hls'; slots: Slot[] }
export type SlotState = 'occupied' | 'free' | 'unknown';
export interface Detection { bbox: [number, number, number, number]; class: string; score: number }
export const CAMERA_KEY = 'kershell.parking.camera.v1';
export const MAX_SLOTS = 100;

export function cameraUrl(input: string): string {
  const url = new URL(input.trim());
  const host = url.hostname.replace(/\.$/, '');
  if (url.protocol !== 'https:' || url.username || url.password || input.length > 2048 ||
      host === 'localhost' || host.endsWith('.local') || host.endsWith('.localhost') ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host.startsWith('[')) {
    throw new Error('Usa una URL pública HTTPS, sin usuario ni contraseña.');
  }
  url.hash = '';
  return url.href;
}

export function validSlot(input: unknown): input is Slot {
  if (!input || typeof input !== 'object') return false;
  const {id, points} = input as Slot;
  if (typeof id !== 'string' || !id || id.length > 80 || !Array.isArray(points) || points.length !== 4) return false;
  if (!points.every(p => Array.isArray(p) && p.length === 2 && p.every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1))) return false;
  // A convex quad with consistent winding excludes crossed or repeated corners.
  const crosses = points.map((p,i) => {
    const q=points[(i+1)%4], r=points[(i+2)%4];
    return (q[0]-p[0])*(r[1]-q[1])-(q[1]-p[1])*(r[0]-q[0]);
  });
  const area = Math.abs(points.reduce((sum,p,i) => sum+p[0]*points[(i+1)%4][1]-points[(i+1)%4][0]*p[1],0))/2;
  return area >= 0.0001 && (crosses.every(n=>n>0) || crosses.every(n=>n<0));
}

export function parseCamera(raw: string | null): Camera | null {
  try {
    if (!raw || raw.length > 100000) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || typeof data.name !== 'string' || !data.name.trim() || data.name.length > 80 ||
        typeof data.url !== 'string' || !['image','video','hls'].includes(data.kind) ||
        !Array.isArray(data.slots) || data.slots.length > MAX_SLOTS || !data.slots.every(validSlot) ||
        new Set(data.slots.map((s: Slot)=>s.id)).size !== data.slots.length) return null;
    return {version:1,name:data.name,url:cameraUrl(data.url),kind:data.kind,slots:data.slots};
  } catch { return null; }
}

function inside(point: Point, polygon: Point[]) {
  const cross = polygon.map((p,i) => {
    const q=polygon[(i+1)%polygon.length];
    return (q[0]-p[0])*(point[1]-p[1])-(q[1]-p[1])*(point[0]-p[0]);
  });
  return cross.every(n=>n>=0) || cross.every(n=>n<=0);
}

/** Experimental: absence of a detected vehicle is only an estimate of a free space. */
export function occupancy(slots: Slot[], detections: Detection[], width: number, height: number): SlotState[] {
  if (!(width > 0 && height > 0)) return slots.map(()=>'unknown');
  const vehicles = detections.filter(d => ['car','truck','bus','motorcycle'].includes(d.class) && d.score >= 0.3);
  return slots.map(slot => {
    const matches = vehicles.filter(({bbox:[x,y,w,h]}) => inside([(x+w/2)/width,(y+h*0.8)/height],slot.points));
    return matches.some(d=>d.score>=0.6) ? 'occupied' : matches.length ? 'unknown' : 'free';
  });
}
