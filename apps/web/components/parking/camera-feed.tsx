'use client';
import { useEffect, useRef, useState } from 'react';
import type { Camera } from '@/lib/parking/camera';
export type Media = HTMLImageElement | HTMLVideoElement;
export interface FeedState { phase: 'loading' | 'ready' | 'view-only' | 'error'; message: string }

export function CameraFeed({ camera, onMedia, onStatus }: {
  camera: Camera; onMedia: (media: Media | null) => void; onStatus: (state: FeedState) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    let disposed = false;
    let refresh: ReturnType<typeof setTimeout>;
    let deadline: ReturnType<typeof setTimeout>;
    let destroy = () => {};
    let objectUrl = '';
    let fallbackDeadline: ReturnType<typeof setTimeout>;
    let pending: AbortController | undefined;
    const status = (state: FeedState) => { if (!disposed) onStatus(state); };
    const failure = () => {
      if (disposed) return;
      onMedia(null);
      status({ phase: 'error', message: 'La cámara no responde o el enlace no es compatible. Comprueba la URL y vuelve a intentarlo.' });
    };
    onMedia(null);
    status({ phase: 'loading', message: 'Conectando con tu cámara…' });
    if (camera.kind === 'image') {
      const load = async () => {
        pending = new AbortController();
        deadline = setTimeout(() => pending?.abort(), 15000);
        try {
          const response = await fetch(camera.url, { signal: pending.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
          if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Invalid image');
          const blob = await response.blob();
          if (blob.size > 15 * 1024 * 1024) throw new Error('Image too large');
          if (disposed) return;
          const nextUrl = URL.createObjectURL(blob);
          const image = new Image(); image.src = nextUrl;
          try { await image.decode(); } catch { URL.revokeObjectURL(nextUrl); throw new Error('Invalid image'); }
          if (disposed) { URL.revokeObjectURL(nextUrl); return; }
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          objectUrl = nextUrl;
          setImageSrc(nextUrl); onMedia(image);
          status({ phase: 'ready', message: 'Imagen conectada · se consulta cada 60 segundos' });
        } catch {
          if (disposed) return;
          // Native image rendering may work even when the provider disallows pixel access.
          onMedia(null);
          const fallback = new Image(); fallback.referrerPolicy = 'no-referrer';
          fallbackDeadline = setTimeout(failure,15000);
          fallback.onload = () => {
            clearTimeout(fallbackDeadline);
            if (disposed) return;
            setImageSrc(camera.url);
            status({ phase: 'view-only', message: 'Puedes ver esta cámara, pero su proveedor impide analizar la imagen desde otra web (CORS). Usa otra fuente compatible.' });
          };
          fallback.onerror = () => {clearTimeout(fallbackDeadline);failure();};
          fallback.src = camera.url;
        } finally {
          clearTimeout(deadline);
          if (!disposed) refresh = setTimeout(load, 60000);
        }
      };
      void load();
    } else {
      const video = videoRef.current!;
      const ready = () => {
        clearTimeout(deadline);
        if (disposed) return;
        onMedia(video); status({ phase: 'ready', message: 'Vídeo conectado' });
        void video.play().catch(() => status({phase:'ready',message:'Pulsa reproducir en el vídeo para iniciar la imagen.'}));
      };
      video.addEventListener('loadeddata', ready); video.addEventListener('error', failure);
      deadline = setTimeout(failure,15000);
      const connect = async () => {
        if (camera.kind === 'hls') {
          const { default: Hls } = await import('hls.js');
          if (disposed) return;
          if (!Hls.isSupported()) {
            if(video.canPlayType('application/vnd.apple.mpegurl')) {video.src=camera.url;video.load();}
            else failure();
            return;
          }
          const hls = new Hls({ maxBufferLength: 15 });
          destroy = () => hls.destroy();
          hls.on(Hls.Events.ERROR, (_,data) => { if(data.fatal) failure(); });
          hls.loadSource(camera.url); hls.attachMedia(video);
        } else { video.src = camera.url; video.load(); }
      };
      void connect().catch(failure);
      return () => {
        disposed = true; clearTimeout(deadline); destroy();
        video.removeEventListener('loadeddata',ready); video.removeEventListener('error',failure);
        video.pause(); video.removeAttribute('src'); video.load(); onMedia(null);
      };
    }
    return () => { disposed=true; clearTimeout(fallbackDeadline); pending?.abort(); clearTimeout(deadline); clearTimeout(refresh); if(objectUrl) URL.revokeObjectURL(objectUrl); onMedia(null); };
  }, [camera.url, camera.kind, onMedia, onStatus]);
  return camera.kind === 'image'
    ? imageSrc ? <img className="camera-image" src={imageSrc} alt={`Webcam: ${camera.name}`} referrerPolicy="no-referrer" /> : <div className="camera-empty">Esperando imagen…</div>
    : <video className="camera-image" ref={videoRef} muted playsInline controls crossOrigin="anonymous" />;
}
