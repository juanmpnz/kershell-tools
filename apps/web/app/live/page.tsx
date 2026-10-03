import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Live',
  description: 'Explora las próximas herramientas de Kershell para consultar información en tiempo real. Parking Live está en fase de demostración.',
  alternates: { canonical: '/live' },
};

export default function LivePage() {
  return (
    <div className="page-shell">
      <nav className="breadcrumbs" aria-label="Ruta de navegación"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><span aria-current="page">Live</span></nav>
      <section className="intro">
        <p className="eyebrow">KERSHELL TOOLS / LIVE</p>
        <h1>Antes de llegar, mira.</h1>
        <p>Un nuevo espacio para consultar lo que ocurre en tu destino. Empezamos por el parking en estaciones de esquí.</p>
      </section>
      <section className="tool-list" aria-labelledby="live-heading">
        <div className="section-heading"><h2 id="live-heading">Live</h2><span>En desarrollo</span></div>
        <Link href="/live/parking" className="tool-card">
          <div><span className="tool-number">PARKING / DEMOSTRACIÓN</span><h3>Parking Live</h3><p>Plazas disponibles y una webcam para comprobar el estado del parking. Explora la primera vista con datos de ejemplo.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
