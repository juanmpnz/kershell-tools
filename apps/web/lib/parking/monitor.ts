import { readAvailability, type Availability } from './availability.ts';

interface MonitorOptions {
  parkingId: string;
  maxAgeMs: number;
  refreshMs: number;
  timeoutMs: number;
  load: (signal: AbortSignal) => Promise<unknown>;
  onChange: (availability: Availability) => void;
}

/** One request at a time. Expiration runs independently of the next response. */
export function watchParking(options: MonitorOptions): () => void {
  for (const value of [options.maxAgeMs, options.refreshMs, options.timeoutMs]) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > 2147483647) throw new Error('Invalid parking timing configuration');
  }
  let stopped = false;
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;

  function publish(value: Availability) {
    if (stopped) return;
    clearTimeout(expiryTimer);
    options.onChange(value);
    if (value.status === 'fresh') {
      const remaining = Date.parse(value.snapshot.capturedAt) + options.maxAgeMs - Date.now();
      expiryTimer = setTimeout(() => {
        if (!stopped) options.onChange({ status: 'stale', snapshot: value.snapshot });
      }, Math.max(0, remaining));
    }
  }

  async function refresh() {
    if (stopped) return;
    controller = new AbortController();
    const requestController = controller;
    try {
      const deadline = new Promise<never>((_, reject) => {
        timeoutTimer = setTimeout(() => {
          reject(new Error('Parking request timed out'));
          requestController.abort();
        }, options.timeoutMs);
      });
      const payload = await Promise.race([options.load(requestController.signal), deadline]);
      publish(readAvailability(payload, { parkingId: options.parkingId, now: Date.now(), maxAgeMs: options.maxAgeMs }));
    } catch {
      publish({ status: 'error', snapshot: null });
    } finally {
      clearTimeout(timeoutTimer);
      if (!stopped) refreshTimer = setTimeout(refresh, options.refreshMs);
    }
  }

  options.onChange({ status: 'unavailable', snapshot: null });
  void refresh();
  return () => {
    stopped = true;
    clearTimeout(refreshTimer);
    clearTimeout(expiryTimer);
    clearTimeout(timeoutTimer);
    controller?.abort();
  };
}
