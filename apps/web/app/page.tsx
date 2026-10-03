import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">KERSHELL · DECISIONES CON NÚMEROS</p>
        <h1>Las cuentas claras antes de decidir.</h1>
        <p className="hero-copy">Herramientas sencillas para entender decisiones de vivienda y trabajo. Introduce tus cifras y ve cómo se calcula cada resultado.</p>
      </section>
      <section className="tool-list" aria-labelledby="tools-heading">
        <div className="section-heading"><h2 id="tools-heading">Vivienda</h2><span>01 / Vivienda</span></div>
        <Link href="/rentabilidad-alquiler" className="tool-card">
          <div><span className="tool-number">01 — INVERSIÓN</span><h3>Rentabilidad de alquiler</h3><p>Calcula la rentabilidad bruta y neta estimada con los gastos de compra, los meses sin inquilino y los costes anuales.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
        <Link href="/gastos-compra-vivienda-cataluna" className="tool-card">
          <div><span className="tool-number">02 — COMPRA</span><h3>Gastos de compra en Cataluña</h3><p>Estima los impuestos de vivienda usada o nueva, añade tus presupuestos y calcula el dinero propio necesario.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
        <div className="section-heading vertical-heading"><h2>Trabajo</h2><span>02 / Trabajo</span></div>
        <Link href="/indemnizacion-despido" className="tool-card">
          <div><span className="tool-number">03 — EMPLEO</span><h3>Indemnización por despido</h3><p>Estima los escenarios de despido objetivo e improcedente en España, con límites y régimen anterior a 2012.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="tool-list" aria-labelledby="live-heading">
        <div className="section-heading vertical-heading"><h2 id="live-heading">Live</h2><span>03 / En desarrollo</span></div>
        <Link href="/live" className="tool-card">
          <div><span className="tool-number">04 — DESTINOS</span><h3>Parking Live</h3><p>Conecta tu webcam de parking, marca las plazas y sigue su ocupación. Guarda la cámara y el mapa en tu navegador.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
