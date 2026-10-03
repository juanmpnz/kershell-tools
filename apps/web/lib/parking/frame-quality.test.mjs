import {test} from 'node:test';
import assert from 'node:assert/strict';
import { frameIsUsable } from './frame-quality.ts';
const frame = values => new Uint8ClampedArray(values.flatMap(value=>[value,value,value,255]));
test('black, near-black, white and uniform images cannot imply free spaces',()=>{
 for(const values of [Array(100).fill(0),Array.from({length:100},(_,i)=>i%10),Array(100).fill(255),Array(100).fill(120)]) assert.equal(frameIsUsable(frame(values)),false);
});
test('rejects missing pixels and transparent images',()=>{
 assert.equal(frameIsUsable(new Uint8ClampedArray()),false);
 assert.equal(frameIsUsable(new Uint8ClampedArray(400)),false);
 assert.equal(frameIsUsable(new Uint8ClampedArray([1,2,3])),false);
});
test('permits a frame with usable exposure and contrast without claiming detection accuracy',()=>{
 assert.equal(frameIsUsable(frame(Array.from({length:100},(_,i)=>50+i))),true);
});
