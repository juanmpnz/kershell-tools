import { test } from 'node:test';
import assert from 'node:assert/strict';
import { watchParking } from './monitor.ts';
const now = Date.parse('2026-10-03T12:00:00.000Z');
const observation = { version: 1, parkingId: 'pilot', sourceId: 'camera', capturedAt: new Date(now).toISOString(), capacity: 10, available: 3, occupied: 5, unknown: 2, confidence: null };
const settle = async () => { for(let i=0;i<12;i++) await Promise.resolve(); };
function setup(t, load, extra = {}) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now });
  const states = [];
  const stop = watchParking({ parkingId: 'pilot', maxAgeMs: 2000, refreshMs: 3000, timeoutMs: 500, load, onChange: value => states.push(value), ...extra });
  t.after(stop);
  return { states, stop };
}
test('expires a reading while the page stays open, then recovers on refresh', async t => {
  const { states } = setup(t, async () => ({ ...observation, capturedAt: new Date().toISOString() }));
  await settle(); assert.equal(states.at(-1).status, 'fresh');
  t.mock.timers.tick(2000); assert.equal(states.at(-1).status, 'stale');
  t.mock.timers.tick(1000); await settle(); assert.equal(states.at(-1).status, 'fresh');
});
test('network failure hides counts and retries successfully', async t => {
  let attempts=0;
  const { states }=setup(t, async () => { if(++attempts===1) throw Error('offline'); return observation; }, { maxAgeMs: 10000 });
  await settle(); assert.deepEqual(states.at(-1), { status:'error', snapshot:null });
  t.mock.timers.tick(3000); await settle(); assert.equal(states.at(-1).status, 'fresh');
});
test('timeouts abort a request and ignore its late response', async t => {
  let finish; let signal;
  const { states }=setup(t, s=>{signal=s;return new Promise(resolve=>{finish=resolve});});
  t.mock.timers.tick(500); await settle();
  assert.equal(signal.aborted,true); assert.equal(states.at(-1).status,'error');
  finish(observation); await settle(); assert.equal(states.at(-1).status,'error');
});
test('unmount aborts and prevents further updates or requests', async t => {
  let finish; let signal; let requests=0;
  const { states,stop }=setup(t,s=>{ requests++;signal=s;return new Promise(resolve=>{finish=resolve}); });
  stop(); const count=states.length;
  finish(observation); await settle(); t.mock.timers.tick(10000); await settle();
  assert.equal(signal.aborted,true); assert.equal(states.length,count); assert.equal(requests,1);
});
test('invalid or absent observations never become demo values', async t => {
  const { states }=setup(t,async()=>null);
  await settle(); assert.deepEqual(states.at(-1),{status:'unavailable',snapshot:null});
});
test('rejects invalid timing configuration', () => {
  assert.throws(()=>watchParking({parkingId:'pilot',maxAgeMs:0,refreshMs:1000,timeoutMs:500,load:async()=>null,onChange:()=>{}}));
});
test('does not overlap requests while the source is still pending', async t => {
  let requests=0; let finish;
  setup(t,()=>{requests++;return new Promise(resolve=>{finish=resolve});},{refreshMs:100,timeoutMs:1000});
  t.mock.timers.tick(500); await settle(); assert.equal(requests,1);
  finish(observation); await settle();
  t.mock.timers.tick(100); await settle(); assert.equal(requests,2);
});
test('a failed refresh cannot resurrect the previous snapshot on expiry', async t => {
  let requests=0;
  const { states }=setup(t,async()=>{if(++requests===1)return observation;throw Error('offline');},{refreshMs:500});
  await settle(); assert.equal(states.at(-1).status,'fresh');
  t.mock.timers.tick(500); await settle(); assert.equal(states.at(-1).status,'error');
  t.mock.timers.tick(1500); await settle(); assert.equal(states.at(-1).status,'error');
  assert.ok(!states.some(s=>s.status==='stale'));
});
