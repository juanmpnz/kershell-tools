import type { DemoAvailability } from './availability';

export const parkingDemo = {
  destination: 'Les Angles',
  name: 'Parking de ejemplo',
  officialWebcamUrl: 'https://lesangles.com/es/webcam/',
  availability: {
    status: 'demo',
    snapshot: { capacity: 310, available: 127, occupied: 183, unknown: 0, confidence: null, capturedAt: null },
  } satisfies DemoAvailability,
};
