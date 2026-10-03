import type { Metadata } from 'next';
import Link from 'next/link';
import './parking.css';

export const metadata: Metadata = {
  title: 'Parking Live · Demostración',
  description: 'Primera vista de Parking Live: disponibilidad de ejemplo y espacio para una futura webcam. Sin datos en tiempo real todavía.',
  alternates: { canonical: '/live/parking' },
  robots: { index: false, follow: true },
};

// Fictional snapshot for presentation only; not the actual capacity of Les Angles.
const demo = { destination: 'Les Angles', name: 'Parking de ejemplo', available: 127, occupied: 183 };

export default function ParkingPage() {
  const total = demo.available + demo.occupied;
  const occupancy = Math.round(demo.occupied / total * 100);

  return (
    <div className="page-shell parking-page">
      <nav className="breadcrumbs" aria-label="Ruta de navegación"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><Link href="/live">Live</Link><span aria-hidden="true">/</span><span aria-current="page">Parking</span></nav>
      <section className="intro">
        <p className="eyebrow">LIVE / PARKING</p>
        <h1>Tu próxima parada, más clara.</h1>
        <p>Consulta las plazas y comprueba el parking con su cámara. Así será Parking Live, empezando por destinos de montaña.</p>
      </section>
      <p className="deadline-note"><strong>Vista de demostración.</strong> Las cifras son ficticias y no representan la disponibilidad ni la capacidad real de Les Angles. No hay ninguna cámara conectada.</p>
      <section aria-labelledby="parking-heading">
        <div className="section-heading parking-heading"><div><p className="eyebrow">DESTINO PILOTO PROPUESTO</p><h2 id="parking-heading">{demo.destination}</h2></div><span>Integración pendiente</span></div>
        <div className="parking-grid">
          <article className="result-panel parking-summary" aria-labelledby="availability-heading">
            <p className="eyebrow">DATOS SIMULADOS</p>
            <h3 id="availability-heading">{demo.name}</h3>
            <p className="result-label">Plazas disponibles · ejemplo</p>
            <div className="hero-number">{demo.available}<span>/{total}</span></div>
            <p className="result-caption">{occupancy}% de ocupación en este escenario ilustrativo.</p>
            <meter className="parking-meter" min={0} max={total} value={demo.occupied} aria-label={`${demo.occupied} de ${total} plazas ocupadas, datos simulados`}>{occupancy}%</meter>
            <div className="result-divider" />
            <dl className="result-list">
              <div><dt>Ocupadas · ejemplo</dt><dd>{demo.occupied}</dd></div>
              <div><dt>Disponibles · ejemplo</dt><dd>{demo.available}</dd></div>
              <div><dt>Estado de conexión</dt><dd>Sin conectar</dd></div>
              <div><dt>Confianza de detección</dt><dd>Sin medir</dd></div>
              <div><dt>Última actualización</dt><dd>Sin datos reales</dd></div>
            </dl>
          </article>
          <section className="form-panel parking-camera" aria-labelledby="camera-heading">
            <div className="panel-heading"><p className="eyebrow">EVIDENCIA VISUAL</p><h3 id="camera-heading">Webcam del parking</h3><p>El espacio para comprobar lo que muestran los números.</p></div>
            <div className="parking-camera-placeholder">
              <span className="parking-camera-symbol" aria-hidden="true">↗</span>
              <strong>Cámara pendiente de conexión</strong>
              <p>Aquí podrás ver el parking cuando incorporemos una fuente autorizada.</p>
            </div>
            <p className="fine-print">La webcam original y la vista con plazas señaladas estarán disponibles en una próxima fase. Esta demostración no reproduce vídeo ni realiza detecciones.</p>
          </section>
        </div>
      </section>
      <section className="explanation" aria-labelledby="destinations-heading">
        <p className="eyebrow">PRÓXIMOS DESTINOS</p>
        <h2 id="destinations-heading">Una primera parada. Espacio para más.</h2>
        <div className="explanation-grid">
          <div><h3>Les Angles</h3><p>Primer destino propuesto. Falta confirmar la cámara, la zona visible y las plazas que se podrán medir.</p></div>
          <div><h3>Más parkings de montaña</h3><p>Este espacio crecerá con nuevas ubicaciones cuando tengamos fuentes verificadas y una detección fiable.</p></div>
        </div>
        <p className="fine-print">La disponibilidad futura será una estimación: nieve, visibilidad o vehículos fuera del encuadre pueden afectar a la lectura. Mostraremos la antigüedad del dato y su confianza para ayudarte a interpretarlo.</p>
      </section>
    </div>
  );
}
