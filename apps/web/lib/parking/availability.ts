/** Counts cover the calibrated visible area, never an inferred whole parking. */
export interface ParkingSnapshot {
  version: 1;
  parkingId: string;
  sourceId: string;
  /** UTC ISO-8601 with milliseconds: timestamp of the source image, not the request. */
  capturedAt: string;
  capacity: number;
  available: number;
  occupied: number;
  unknown: number;
  /** Calibrated estimate in [0,1], or null when not measured. */
  confidence: number | null;
}

export type Availability =
  | { status: 'fresh' | 'stale'; snapshot: ParkingSnapshot }
  | { status: 'unavailable' | 'error'; snapshot: null };

export interface DemoAvailability {
  status: 'demo';
  snapshot: Pick<ParkingSnapshot, 'capacity' | 'available' | 'occupied' | 'unknown' | 'confidence'> & { capturedAt: null };
}

/** Boundary for a future provider. null means no observation; invalid data is an error. */
export function readAvailability(
  input: unknown,
  options: { parkingId: string; now: number; maxAgeMs: number },
): Availability {
  const error = { status: 'error', snapshot: null } as const;
  if (!Number.isFinite(options.now) || !Number.isFinite(options.maxAgeMs) || options.maxAgeMs <= 0) return error;
  if (input === null) return { status: 'unavailable', snapshot: null };
  if (typeof input !== 'object' || Array.isArray(input)) return error;
  const data = input as Record<string, unknown>;
  if (data.version !== 1 || data.parkingId !== options.parkingId ||
      typeof data.sourceId !== 'string' || !data.sourceId.trim()) return error;
  const { capacity, available, occupied, unknown, confidence, capturedAt } = data;
  const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
  if (!isCount(capacity) || capacity === 0 || !isCount(available) || !isCount(occupied) || !isCount(unknown) ||
      available + occupied + unknown !== capacity) return error;
  if (confidence !== null && (typeof confidence !== 'number' || !Number.isFinite(confidence) || confidence < 0 || confidence > 1)) return error;
  if (typeof capturedAt !== 'string') return error;
  const capturedMs = Date.parse(capturedAt);
  if (!Number.isFinite(capturedMs) || new Date(capturedMs).toISOString() !== capturedAt || capturedMs > options.now) return error;
  const snapshot: ParkingSnapshot = {
    version: 1, parkingId: options.parkingId, sourceId: data.sourceId,
    capturedAt, capacity, available, occupied, unknown, confidence,
  };
  return { status: options.now - capturedMs >= options.maxAgeMs ? 'stale' : 'fresh', snapshot };
}
