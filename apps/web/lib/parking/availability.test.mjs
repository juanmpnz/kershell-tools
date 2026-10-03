import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAvailability } from './availability.ts';
const now = Date.parse('2026-10-03T12:00:00.000Z');
const snapshot = { version: 1, parkingId: 'les-angles-pilot', sourceId: 'camera-1', capturedAt: '2026-10-03T11:59:00.000Z', capacity: 100, available: 20, occupied: 70, unknown: 10, confidence: 0.9 };
const read = (value, time = now) => readAvailability(value, { parkingId: 'les-angles-pilot', now: time, maxAgeMs: 120000 });
test('accepts a recent snapshot and preserves unknown spaces', () => {
  const result = read(snapshot);
  assert.equal(result.status, 'fresh');
  assert.equal(result.snapshot.unknown, 10);
});
test('keeps a full parking distinct from unavailable data', () => {
  assert.equal(read({ ...snapshot, available: 0, occupied: 90 }).snapshot.available, 0);
  assert.deepEqual(read(null), { status: 'unavailable', snapshot: null });
});
test('expires at the exact freshness boundary, preserving capture time', () => {
  assert.equal(read(snapshot, now + 59999).status, 'fresh');
  const stale = read(snapshot, now + 60000);
  assert.equal(stale.status, 'stale');
  assert.equal(stale.snapshot.capturedAt, snapshot.capturedAt);
});
for (const [name, patch] of Object.entries({
  inconsistent: { available: 21 }, negative: { available: -1 }, fractional: { capacity: 100.5 },
  infinite: { confidence: Infinity }, excessiveConfidence: { confidence: 1.1 },
  invalidDate: { capturedAt: 'yesterday' }, future: { capturedAt: '2026-10-04T12:00:00.000Z' },
  wrongParking: { parkingId: 'other' }, emptySource: { sourceId: '' }, wrongVersion: { version: 2 },
  zeroCapacity: { capacity: 0 }, missingUnknown: { unknown: undefined },
})) test(`rejects ${name} without inventing availability`, () => {
  assert.deepEqual(read({ ...snapshot, ...patch }), { status: 'error', snapshot: null });
});
test('rejects malformed payloads', () => {
  for (const input of [undefined, [], '20', {}, 0]) assert.equal(read(input).status, 'error');
});
test('allows unmeasured confidence without inventing a percentage', () => {
  assert.equal(read({ ...snapshot, confidence: null }).snapshot.confidence, null);
});
