'use client';
import { useState } from 'react';
import { validSlot, MAX_SLOTS, type Point, type Slot, type SlotState } from '@/lib/parking/camera';
export function SlotMap({ slots, states, editing, onChange }: {slots:Slot[];states:SlotState[];editing:boolean;onChange:(slots:Slot[])=>void}) {
  const [points,setPoints]=useState<Point[]>([]);
  const [cursor,setCursor]=useState<Point>([0.5,0.5]);
  const [error,setError]=useState('');
  function add(point:Point) {
    if(!editing || slots.length>=MAX_SLOTS) return;
    const next=[...points,point];setError('');
    if(next.length===4) {
      const slot={id:crypto.randomUUID(),points:next};
      if(!validSlot(slot)) {setError('Marca cuatro esquinas en orden, sin cruzar los lados.');setPoints([]);return;}
      onChange([...slots,slot]);setPoints([]);
    } else setPoints(next);
  }
  return <>
    <svg className={`slot-overlay ${editing?'editing':''}`} viewBox="0 0 1000 1000" preserveAspectRatio="none"
      role={editing?'application':'img'} aria-label={editing?'Mapa de plazas. Usa las flechas para mover el punto y Enter para marcar cada esquina.':'Mapa de plazas y ocupación estimada'} tabIndex={editing?0:undefined}
      onPointerDown={event=>{if(!editing)return;const rect=event.currentTarget.getBoundingClientRect();add([(event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height]);}}
      onKeyDown={event=>{
        if(!editing)return;
        if(event.key==='Enter'||event.key===' ') {event.preventDefault();add(cursor);return;}
        if(event.key==='Escape'){setPoints([]);return;}
        const steps:Record<string,Point>={ArrowLeft:[-0.01,0],ArrowRight:[0.01,0],ArrowUp:[0,-0.01],ArrowDown:[0,0.01]};
        const step=steps[event.key];if(step){event.preventDefault();setCursor(([x,y])=>[Math.min(1,Math.max(0,x+step[0])),Math.min(1,Math.max(0,y+step[1]))]);}
      }}>
      {slots.map((slot,i)=><g key={slot.id}><polygon points={slot.points.map(([x,y])=>`${x*1000},${y*1000}`).join(' ')} className={`slot-${states[i]??'unknown'}`} vectorEffect="non-scaling-stroke" /><text x={slot.points[0][0]*1000+5} y={slot.points[0][1]*1000+25}>{i+1}</text></g>)}
      {editing && <><polyline points={points.map(([x,y])=>`${x*1000},${y*1000}`).join(' ')} fill="none" stroke="white" vectorEffect="non-scaling-stroke"/>{points.map(([x,y],i)=><circle key={i} cx={x*1000} cy={y*1000} r="7" fill="white"/>)}<path className="map-cursor" d={`M${cursor[0]*1000-12},${cursor[1]*1000}h24 M${cursor[0]*1000},${cursor[1]*1000-12}v24`} stroke="white" vectorEffect="non-scaling-stroke"/></>}
    </svg>
    {editing && <div className="map-instructions"><span role="status">{error||`${points.length}/4 esquinas · marca cada plaza en orden`}</span><button type="button" onClick={()=>setPoints([])}>Cancelar puntos</button></div>}
  </>;
}
