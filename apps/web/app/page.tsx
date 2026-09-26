import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">KERSHELL · VIVIENDA</p>
        <h1>Las cuentas claras antes de decidir.</h1>
        <p className="hero-copy">Herramientas sencillas para entender el dinero detrás de una vivienda. Introduce tus cifras y ve cómo se calcula cada resultado.</p>
      </section>
      <section className="tool-list" aria-labelledby="tools-heading">
        <div className="section-heading"><h2 id="tools-heading">Herramientas disponibles</h2><span>01 / Vivienda</span></div>
        <Link href="/rentabilidad-alquiler" className="tool-card">
          <div><span className="tool-number">01 — INVERSIÓN</span><h3>Rentabilidad de alquiler</h3><p>Calcula la rentabilidad bruta y neta estimada con los gastos de compra, los meses sin inquilino y los costes anuales.</p></div>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
