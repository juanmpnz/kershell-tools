import type { Metadata } from 'next';
import Link from 'next/link';
import { PurchaseCostsCalculator } from '@/components/purchase-costs-calculator';

export const metadata: Metadata = {
  title: 'Gastos de compra de vivienda en Cataluña',
  description: 'Estima ITP de vivienda usada o IVA y AJD de vivienda nueva en Cataluña, otros gastos y dinero propio necesario. Reglas, fuentes y límites explicados.',
  alternates: { canonical: '/gastos-compra-vivienda-cataluna' },
};

export default function PurchaseCostsPage() {
  return <div className="page-shell">
    <div className="breadcrumbs"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><span>Gastos de compra en Cataluña</span></div>
    <section className="intro"><p className="eyebrow">VIVIENDA / COMPRA</p><h1>Gastos de compra en Cataluña</h1><p>Calcula los impuestos y suma tus presupuestos de notaría, registro, gestoría y tasación. Si tienes préstamo, estima cuánto dinero propio necesitas.</p></section>
    <PurchaseCostsCalculator />
    <section className="explanation" aria-labelledby="method-heading">
      <p className="eyebrow">EL MÉTODO</p><h2 id="method-heading">¿Cómo se calcula?</h2>
      <div className="explanation-grid">
        <div><h3>Vivienda usada</h3><p>ITP general sobre la base fiscal estimada: 10 % hasta 600.000 €; 11 % sobre el tramo de 600.000 a 900.000 €; 12 % de 900.000 a 1.500.000 €; 13 % del exceso. Los tramos se suman progresivamente.</p></div>
        <div><h3>Vivienda nueva</h3><p>IVA general del 10 % sobre el precio de venta y AJD (tarifa AJ4) del 1,5 % sobre la base fiscal estimada, si la transmisión está sujeta y no exenta de IVA y se formaliza en escritura pública.</p></div>
        <div><h3>Base y total</h3><p>La base fiscal estimada es el mayor entre precio y el otro valor fiscal que indiques. Puede ser superior por valor de referencia catastral, declarado o de mercado. Gastos de compra = impuestos + gastos adicionales introducidos.</p></div>
        <div><h3>Dinero propio</h3><p>Precio + gastos de compra − importe del préstamo. Es una estimación inicial, no una oferta hipotecaria. Los importes de notaría, registro, gestoría y tasación parten de cero para que uses tus presupuestos reales.</p></div>
      </div>
      <p className="fine-print">Ámbito: compra del 100 % de una vivienda ordinaria en Cataluña bajo las tarifas generales, con reglas consultadas el 28 de septiembre de 2026. No calcula tipos reducidos, bonificaciones, vivienda protegida, grandes tenedores, edificios enteros, transmisiones con renuncia a la exención de IVA, adquisiciones parciales, impuestos de la hipoteca, honorarios inmobiliarios ni otros gastos particulares. Confirma la clasificación de tu operación, la base imponible y las tarifas antes de firmar. La fecha del devengo puede cambiar el tipo aplicable. Los datos que escribes se calculan en tu navegador y no se envían al sitio.</p>
      <h3>Fuentes oficiales y actualización</h3>
      <ul className="source-list">
        <li><a href="https://atc.gencat.cat/es/tributs/itpajd/tpo/tarifes-tipus/">ATC: tipos y tramos de ITP</a></li>
        <li><a href="https://atc.gencat.cat/es/tributs/itpajd/tpo/base-imposable/">ATC: base imponible de ITP</a></li>
        <li><a href="https://atc.gencat.cat/es/tributs/itpajd/ajd/documents-notarials/">ATC: base imponible de AJD</a></li>
        <li><a href="https://atc.gencat.cat/es/tributs/itpajd/operacions/immobles/compravenda-immobles/">ATC: compraventa y tarifa AJ4</a></li>
        <li><a href="https://sede.agenciatributaria.gob.es/Sede/iva/iva-operaciones-inmobiliarias/compro-vivienda-tengo-que-pagar-itp.html">AEAT: IVA en vivienda nueva</a></li>
      </ul>
      <p className="fine-print">Revisaremos estas fuentes antes de cambiar tarifas y periódicamente al menos cada trimestre; si alguna deja de reflejar el régimen general, actualizaremos el cálculo y su fecha de revisión.</p>
    </section>
  </div>;
}
