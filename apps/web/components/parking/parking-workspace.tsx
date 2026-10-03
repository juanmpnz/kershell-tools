'use client';
import { useCallback, useEffect, useState } from 'react';
import { CAMERA_KEY, MAX_SLOTS, cameraUrl, parseCamera, type Camera, type Slot } from '@/lib/parking/camera';
import { CameraFeed, type FeedState, type Media } from './camera-feed';
import { SlotMap } from './slot-map';
import { useVehicleTracking } from './use-vehicle-tracking';

export function ParkingWorkspace() {
  const [camera,setCamera]=useState<Camera|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [name,setName]=useState('Mi parking');
  const [url,setUrl]=useState('');
  const [kind,setKind]=useState<Camera['kind']>('image');
  const [message,setMessage]=useState('');
  const [media,setMedia]=useState<Media|null>(null);
  const [feed,setFeed]=useState<FeedState>({phase:'loading',message:''});
  const [editing,setEditing]=useState(false);
  const [running,setRunning]=useState(false);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    try {
      const raw=localStorage.getItem(CAMERA_KEY), saved=parseCamera(raw);
      if(saved){setCamera(saved);setName(saved.name);setUrl(saved.url);setKind(saved.kind);}
      else if(raw)setMessage('La cámara guardada no es válida. Puedes configurar una nueva.');
    } catch {setMessage('Este navegador no permite guardar datos. Puedes usar la herramienta durante esta visita.');}
    setLoaded(true);
  },[]);
  const onMedia=useCallback((value:Media|null)=>setMedia(value),[]);
  const onStatus=useCallback((value:FeedState)=>{setFeed(value);if(value.phase==='error'||value.phase==='view-only')setRunning(false);},[]);
  const tracking=useVehicleTracking(media,camera?.slots??EMPTY_SLOTS,running);
  const states=tracking?.states??camera?.slots.map(()=>'unknown' as const)??[];
  function save(value:Camera) {
    setCamera(value);
    try {localStorage.setItem(CAMERA_KEY,JSON.stringify(value));setMessage('Cámara y mapa guardados solo en este navegador.');}
    catch {setMessage('No se pudo guardar en este navegador. Los cambios se conservan solo durante esta visita.');}
  }
  function connect(event:React.FormEvent) {
    event.preventDefault();
    try {
      const normalized=cameraUrl(url);
      const slots=camera?.url===normalized && camera.kind===kind?camera.slots:[];
      const next={version:1 as const,name:name.trim()||'Mi parking',url:normalized,kind,slots};
      setRunning(false);setEditing(false);setMedia(null);setRetry(n=>n+1);save(next);
    } catch {setMessage('Introduce una URL pública HTTPS válida, sin usuario ni contraseña. Debe apuntar a una imagen o vídeo, no a una página web.');}
  }
  function updateSlots(slots:Slot[]) {if(camera){setRunning(false);save({...camera,slots});}}
  function forget() {
    try {localStorage.removeItem(CAMERA_KEY);} catch {setMessage('No se pudo eliminar el guardado. Comprueba los permisos de almacenamiento del navegador.');return;}
    setCamera(null);setMedia(null);setRunning(false);setEditing(false);setUrl('');setMessage('Cámara eliminada de este navegador.');
  }
  return <div className="parking-workspace">
    <section className="form-panel" aria-labelledby="connect-heading">
      <div className="panel-heading"><p className="eyebrow">01 / TU CÁMARA</p><h2 id="connect-heading">Pega el enlace. Guarda tu lugar.</h2><p>Una cámara fija, una URL directa y las plazas que quieres seguir. Sin cuenta.</p></div>
      <form className="camera-form" onSubmit={connect}>
        <div className="field"><label htmlFor="camera-name">Nombre</label><input id="camera-name" value={name} maxLength={80} onChange={e=>setName(e.target.value)} placeholder="Mi parking"/></div>
        <div className="field"><label htmlFor="camera-kind">Tipo de fuente</label><select id="camera-kind" value={kind} onChange={e=>setKind(e.target.value as Camera['kind'])}><option value="image">Imagen que se actualiza (JPEG / PNG)</option><option value="hls">Vídeo en directo (HLS / .m3u8)</option><option value="video">Vídeo directo (MP4 / WebM)</option></select></div>
        <div className="field camera-url"><label htmlFor="camera-url">URL pública HTTPS</label><input id="camera-url" type="url" required value={url} maxLength={2048} onChange={e=>setUrl(e.target.value)} placeholder="https://…/webcam.jpg" aria-describedby="camera-url-hint"/><p id="camera-url-hint" className="field-hint">Las páginas de YouTube, los iframes y RTSP no son fuentes directas compatibles. El proveedor debe permitir leer las imágenes desde otra web.</p></div>
        <div className="camera-actions"><button className="parking-button" disabled={!loaded} type="submit">Guardar y conectar</button>{camera&&<button className="parking-button secondary" type="button" onClick={forget}>Olvidar cámara</button>}</div>
      </form>
      <p className="camera-notice" role="status">{message||'La URL y el mapa se guardan en este dispositivo. No guardamos imágenes ni resultados.'}</p>
    </section>
    {camera ? <section aria-labelledby="camera-heading">
      <div className="section-heading parking-heading"><div><p className="eyebrow">02 / MAPA Y SEGUIMIENTO</p><h2 id="camera-heading">{camera.name}</h2></div><span>{camera.slots.length} plazas marcadas</span></div>
      <div className="camera-layout">
        <div className="form-panel camera-panel">
          <p className={`camera-notice ${feed.phase==='error'?'camera-error':''}`} role="status">{feed.message}</p>
          <div className={`camera-stage ${editing?'is-editing':''}`}>
            <CameraFeed key={`${camera.url}:${camera.kind}:${retry}`} camera={camera} onMedia={onMedia} onStatus={onStatus}/>
            {(feed.phase==='ready'||feed.phase==='view-only')&&<SlotMap key={`${camera.url}:${camera.kind}:${editing}`} slots={camera.slots} states={states} editing={editing} onChange={updateSlots}/>}
          </div>
          <div className="camera-actions">
            <button className="parking-button secondary" disabled={!['ready','view-only'].includes(feed.phase)} onClick={()=>{setRunning(false);setEditing(!editing);}}>{editing?'Terminar mapa':'Marcar plazas'}</button>
            <button className="parking-button" disabled={!media||!camera.slots.length||editing||feed.phase!=='ready'} onClick={()=>setRunning(!running)}>{running?'Detener seguimiento':'Iniciar seguimiento'}</button>
            <button className="parking-button secondary" onClick={()=>{setRunning(false);setMedia(null);setRetry(n=>n+1);}}>Reconectar</button>
          </div>
          {editing&&<p className="field-hint">Marca las cuatro esquinas de cada plaza en orden. Con teclado: enfoca la imagen, usa las flechas y pulsa Enter en cada esquina. Máximo {MAX_SLOTS} plazas.</p>}
          <p className="camera-notice">Verde: libre estimada · Rojo: ocupada · Gris: sin determinar</p>
          {camera.slots.length>0&&<details><summary>Editar plazas guardadas</summary><ol className="saved-slots">{camera.slots.map((slot,i)=><li key={slot.id}>Plaza {i+1}<button type="button" onClick={()=>updateSlots(camera.slots.filter(s=>s.id!==slot.id))} aria-label={`Eliminar plaza ${i+1}`}>Eliminar</button></li>)}</ol></details>}
        </div>
        <aside className="result-panel parking-summary" aria-labelledby="tracking-heading">
          <p className="eyebrow">ESTIMACIÓN LOCAL · EXPERIMENTAL</p><h3 id="tracking-heading">Tus plazas</h3>
          <p className="result-label">Libres estimadas</p><div className="hero-number">{tracking?.checkedAt?states.filter(s=>s==='free').length:'—'}<span>/{camera.slots.length}</span></div>
          <p className="result-caption" role="status">{tracking?.message||(camera.slots.length?'Inicia el seguimiento para analizar tus plazas.':'Marca las plazas visibles antes de iniciar el seguimiento.')}</p>
          <dl className="result-list"><div><dt>Ocupadas</dt><dd>{tracking?.checkedAt?states.filter(s=>s==='occupied').length:'—'}</dd></div><div><dt>Sin determinar</dt><dd>{states.filter(s=>s==='unknown').length}</dd></div><div><dt>Último análisis local</dt><dd>{tracking?.checkedAt?new Date(tracking.checkedAt).toLocaleTimeString('es-ES'):'Pendiente'}</dd></div><div><dt>Antigüedad de la imagen</dt><dd>No facilitada</dd></div></dl>
          <p className="result-caption">El análisis puede fallar con nieve, oscuridad, vehículos pequeños u ocultos. Un coche no detectado puede parecer una plaza libre. Comprueba siempre la imagen.</p>
        </aside>
      </div>
    </section> : <div className="camera-empty-state"><p className="eyebrow">TU PARKING, A TU MANERA</p><h2>{loaded?'Añade tu primera cámara':'Recuperando tu cámara…'}</h2><p>Guarda una fuente, marca sus plazas y vuelve cuando quieras. Si la cámara se cae, te lo indicaremos.</p></div>}
  </div>;
}
const EMPTY_SLOTS:Slot[]=[];
