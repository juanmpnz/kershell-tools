'use client';

import { useEffect, useState } from 'react';
import type { Availability, DemoAvailability } from '@/lib/parking/availability';
import { watchParking } from '@/lib/parking/monitor';
import { ParkingAvailability } from './parking-availability';

type Source =
  | { mode: 'demo'; availability: DemoAvailability }
  | { mode: 'live'; parkingId: string; maxAgeMs: number; refreshMs: number; timeoutMs: number };

export function ParkingLiveAvailability({ name, source }: { name: string; source: Source }) {
  // Retain the source identity so a prop change cannot briefly display another parking's data.
  const [reading, setReading] = useState<{ source: Source; value: Availability } | null>(null);

  useEffect(() => {
    if (source.mode === 'demo') return;
    let stop: (() => void) | undefined;
    const updateVisibility = () => {
      stop?.();
      setReading(null);
      if (document.visibilityState !== 'visible') return;
      stop = watchParking({
        ...source,
        load: async (signal) => {
          const response = await fetch(`/api/live/parking/${encodeURIComponent(source.parkingId)}`, {
            signal, cache: 'no-store', credentials: 'omit',
          });
          if (!response.ok) throw new Error('Parking source unavailable');
          return response.json();
        },
        onChange: (value) => setReading({ source, value }),
      });
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      stop?.();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, [source]);

  const availability = source.mode === 'demo' ? source.availability
    : reading?.source === source ? reading.value : { status: 'unavailable', snapshot: null } as const;
  return <ParkingAvailability name={name} availability={availability} />;
}
