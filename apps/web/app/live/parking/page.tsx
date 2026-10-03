import type { Metadata } from 'next';
import Link from 'next/link';
import { ParkingWorkspace } from '@/components/parking/parking-workspace';
import './parking.css';

export const metadata: Metadata = {
  title: 'Parking Live · Tu webcam, tus plazas',
  description: 'Conecta una webcam compatible, marca las plazas y estima su ocupación en tu navegador. Guarda la cámara y el mapa en este dispositivo.',
  alternates: { canonical: '/live/parking' },
  robots: { index: false, follow: true },
};
export default function ParkingPage() {
  return <div className="page-shell parking-page">
    <nav className="breadcrumbs" aria-label="Ruta de navegación"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><Link href="/live">Live</Link><span aria-hidden="true">/</span><span aria-current="page">Parking</span></nav>
    <section className="intro"><p className="eyebrow">LIVE / PARKING</p><h1>Tu webcam.<br/>Tus plazas.</h1><p>Elige un parking, marca sus plazas una vez y sigue su ocupación desde tu navegador. Tu cámara y tu mapa te esperan cuando vuelvas.</p></section>
    <ParkingWorkspace />
    <section className="explanation" aria-labelledby="how-heading"><p className="eyebrow">CÓMO FUNCIONA</p><h2 id="how-heading">Un lugar guardado. Una vista más clara.</h2>
      <div className="explanation-grid"><div><h3>Conecta y marca</h3><p>Usa una URL directa HTTPS de una imagen, vídeo o emisión HLS. Marca las cuatro esquinas de cada plaza sobre una cámara fija. Si cambia el encuadre, tendrás que ajustar el mapa.</p></div><div><h3>Analiza en tu navegador</h3><p>El detector se descarga al iniciar el seguimiento y analiza los vehículos en tu dispositivo. No se envían las imágenes a Kershell. Funciona mientras mantengas esta pestaña visible.</p></div><div><h3>Vuelve a tu cámara</h3><p>La URL y las plazas se guardan en este navegador. No se sincronizan con otros dispositivos. Puedes eliminarlas con «Olvidar cámara».</p></div><div><h3>Si la fuente falla</h3><p>Mostramos un error o dejamos las plazas sin determinar. Algunas cámaras se pueden ver, pero su proveedor no permite analizar las imágenes desde otra web.</p></div></div>
      <p className="fine-print">¿Buscas una cámara pública? <a href="https://dnr.alaska.gov/parks/units/chugach/glenalpswebcam.htm" target="_blank" rel="noopener noreferrer">Glen Alps, Alaska ↗</a> publica imágenes de su parking cada cinco minutos. En la comprobación inicial permite visualizar, pero no leer los píxeles desde otra web: es un ejemplo de fuente solo de consulta, no una integración de detección verificada.</p>
      <p className="fine-print">Usa fuentes que tengas derecho a utilizar. La detección es experimental: no garantiza una plaza libre ni reconoce automáticamente los límites del parking. La hora del análisis no certifica que la imagen de origen sea reciente.</p>
    </section>
  </div>;
}
