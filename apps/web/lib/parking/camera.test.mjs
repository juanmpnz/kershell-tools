import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cameraUrl, parseCamera, validSlot, occupancy } from './camera.ts';
const slot = { id:'p1', points:[[0.1,0.1],[0.4,0.1],[0.4,0.5],[0.1,0.5]] };
test('only accepts direct HTTPS addresses without credentials',()=>{
 assert.equal(cameraUrl(' https://example.org/live.m3u8 '),'https://example.org/live.m3u8');
 for(const url of ['javascript:alert(1)','http://example.org/a','https://user:pass@example.org/a','data:image/png;base64,a','https://localhost/a','https://127.0.0.1/a']) assert.throws(()=>cameraUrl(url));
});
test('restores only a valid versioned camera and never stored detections',()=>{
 const value = parseCamera(JSON.stringify({version:1,url:'https://example.org/a.jpg',kind:'image',name:'Mi parking',slots:[slot],detections:[1]}));
 assert.equal(value.slots.length,1); assert.equal('detections' in value,false);
 for(const input of ['{','null',JSON.stringify({version:2}),JSON.stringify({...value,slots:[{...slot,points:[[2,0]]}]})]) assert.equal(parseCamera(input),null);
});
test('rejects crossed, duplicate and tiny polygons',()=>{
 assert.equal(validSlot(slot),true);
 for(const points of [[[0,0],[1,1],[0,1],[1,0]],[[0,0],[0,0],[1,1],[0,1]],[[0,0],[0.0001,0],[0.0001,0.0001],[0,0.0001]]]) assert.equal(validSlot({...slot,points}),false);
});
test('classifies vehicles inside marked spaces and leaves low-score detections uncertain',()=>{
 const vehicle = {bbox:[15,10,10,30],class:'car',score:0.9};
 assert.deepEqual(occupancy([slot],[vehicle],100,100),['occupied']);
 assert.deepEqual(occupancy([slot],[{...vehicle,score:0.35}],100,100),['unknown']);
 assert.deepEqual(occupancy([slot],[{...vehicle,class:'person'}],100,100),['free']);
 assert.deepEqual(occupancy([slot],[],0,100),['unknown']);
});
