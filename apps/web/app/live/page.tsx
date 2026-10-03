import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Live',
  description: 'Explora las próximas herramientas de Kershell para consultar información en tiempo real. Conecta tu webcam y marca las plazas con Parking Live.',
  alternates: { canonical: '/live' },
};

export default function LivePage() {
  return (
    <div className="page-shell">
      <nav className="breadcrumbs" aria-label="Ruta de navegación"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><span aria-current="page">Live</span></nav>
      <section className="intro">
        <p className="eyebrow">KERSHELL TOOLS / LIVE</p>
        <h1>Antes de llegar, mira.</h1>
        <p>Un espacio para seguir lo que ocurre en tus lugares. Empieza conectando tu propia webcam de parking.</p>
      </section>
      <section className="tool-list" aria-labelledby="live-heading">
        <div className="section-heading"><h2 id="live-heading">Live</h2><span>En desarrollo</span></div>
        <Link href="/live/parking" className="tool-card">
          <div><span className="tool-number">PARKING / EXPERIMENTAL</span><h3>Parking Live</h3><p>Conecta una webcam compatible, marca sus plazas y estima la ocupación en tu navegador. Tu cámara y tu mapa quedan guardados en este dispositivo.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
