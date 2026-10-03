'use client';
import { useEffect, useState } from 'react';
import { occupancy, type Slot, type SlotState } from '@/lib/parking/camera';
import { frameIsUsable } from '@/lib/parking/frame-quality';
import type { Media } from './camera-feed';
import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
let detector: Promise<ObjectDetection> | undefined;
function getDetector() {
  return detector ??= (async () => {
    const tf = await import('@tensorflow/tfjs-core');
    await import('@tensorflow/tfjs-backend-webgl');
    await import('@tensorflow/tfjs-backend-cpu');
    try { if (!await tf.setBackend('webgl')) await tf.setBackend('cpu'); }
    catch { await tf.setBackend('cpu'); }
    await tf.ready();
    return (await import('@tensorflow-models/coco-ssd')).load({ base: 'lite_mobilenet_v2' });
  })().catch(error => { detector=undefined; throw error; });
}
interface Result { states: SlotState[]; checkedAt: number; message: string }
export function useVehicleTracking(media: Media | null, slots: Slot[], running: boolean) {
  const [result,setResult] = useState<{ media: Media; slots: Slot[]; value: Result } | null>(null);
  useEffect(() => {
    if (!running || !media || !slots.length) return;
    let cancelled=false;
    let timer: ReturnType<typeof setTimeout>;
    let watchdog: ReturnType<typeof setTimeout>;
    let previousTime=-1;
    let lastFrame=Date.now();
    const publish = (value: Result) => { if(!cancelled) setResult({media,slots,value}); };
    const unknown = (message: string) => publish({ states: slots.map(()=>'unknown'), checkedAt:0,message });
    const canvas=document.createElement('canvas');
    const sample=document.createElement('canvas');
    sample.width=64;sample.height=64;
    unknown('Cargando el detector en tu navegador…');
    watchdog=setTimeout(()=>unknown('El detector está tardando demasiado. Detén y vuelve a iniciar el seguimiento.'),45000);
    const run = async (model: ObjectDetection) => {
      if(cancelled) return;
      if(document.visibilityState !== 'visible') { unknown('Seguimiento pausado mientras la pestaña está oculta.'); timer=setTimeout(()=>void run(model),2000); return; }
      const video=media instanceof HTMLVideoElement;
      if(video && (media.paused || media.ended || media.readyState<2)) {
        unknown('Sin vídeo en reproducción. Las plazas quedan sin determinar.'); timer=setTimeout(()=>void run(model),2000); return;
      }
      if(video) {
        if(media.currentTime!==previousTime) {previousTime=media.currentTime;lastFrame=Date.now();}
        if(Date.now()-lastFrame>10000) {unknown('El vídeo parece detenido. Las plazas quedan sin determinar.');timer=setTimeout(()=>void run(model),2000);return;}
      }
      const width=video ? media.videoWidth : media.naturalWidth;
      const height=video ? media.videoHeight : media.naturalHeight;
      if(!width || !height) { unknown('No hay una imagen válida para analizar.'); return; }
      canvas.width=Math.min(width,960);canvas.height=Math.round(height*canvas.width/width);
      let expired=false;
      watchdog=setTimeout(()=>{expired=true;unknown('El análisis ha caducado. Esperando una nueva lectura.');},15000);
      try {
        const context=canvas.getContext('2d',{willReadFrequently:true})!;
        context.drawImage(media,0,0,canvas.width,canvas.height);
        const sampleContext=sample.getContext('2d',{willReadFrequently:true})!;
        sampleContext.drawImage(canvas,0,0,64,64);
        // Pixel access also fails explicitly when the provider blocks cross-origin reads.
        if(!frameIsUsable(sampleContext.getImageData(0,0,64,64).data)) {
          unknown('La imagen está demasiado oscura, clara o sin detalle. Las plazas quedan sin determinar.');
        } else {
          const predictions=await model.detect(canvas,100,0.3);
          if(!expired && document.visibilityState==='visible') publish({states:occupancy(slots,predictions,canvas.width,canvas.height),checkedAt:Date.now(),message:'Seguimiento experimental activo'});
        }
      } catch {
        unknown('No se puede analizar esta imagen. El proveedor puede bloquear el acceso, o el detector no es compatible con este dispositivo.');
        return;
      } finally { clearTimeout(watchdog); }
      if(!cancelled) timer=setTimeout(()=>void run(model),3000);
    };
    void getDetector().then(model=>{clearTimeout(watchdog);if(!cancelled) void run(model);}).catch(()=>{clearTimeout(watchdog);unknown('No se pudo cargar el detector. Comprueba la conexión y vuelve a intentarlo.');});
    const hidden=()=>{if(document.visibilityState!=='visible')unknown('Seguimiento pausado mientras la pestaña está oculta.');};
    document.addEventListener('visibilitychange',hidden);
    return ()=>{cancelled=true;clearTimeout(timer);clearTimeout(watchdog);document.removeEventListener('visibilitychange',hidden);};
  },[media,slots,running]);
  return running && result?.media===media && result.slots===slots ? result.value : null;
}
