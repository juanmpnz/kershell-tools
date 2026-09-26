import type { Metadata } from 'next';
import Link from 'next/link';
import { RentalYieldCalculator } from '@/components/rental-yield-calculator';

export const metadata: Metadata = {
  title: 'Calculadora de rentabilidad de alquiler',
  description: 'Calcula la rentabilidad bruta y neta estimada de un alquiler con gastos de compra, meses vacíos y costes anuales. Fórmula y límites explicados.',
  alternates: { canonical: '/rentabilidad-alquiler' },
};

export default function RentalYieldPage() {
  return (
    <div className="page-shell">
      <div className="breadcrumbs"><Link href="/">Herramientas</Link><span aria-hidden="true">/</span><span>Rentabilidad de alquiler</span></div>
      <section className="intro">
        <p className="eyebrow">VIVIENDA / INVERSIÓN</p>
        <h1>Rentabilidad de alquiler</h1>
        <p>Descubre cuánto puede rendir una vivienda con tus números. La estimación separa ingresos potenciales, meses vacíos y gastos anuales.</p>
      </section>
      <RentalYieldCalculator />
      <section className="explanation" aria-labelledby="method-heading">
        <p className="eyebrow">EL MÉTODO</p>
        <h2 id="method-heading">¿Cómo se calcula?</h2>
        <div className="explanation-grid">
          <div><h3>Rentabilidad bruta</h3><p>Alquiler mensual × 12 ÷ (precio de compra + gastos de compra) × 100.</p></div>
          <div><h3>Rentabilidad neta estimada</h3><p>[Alquiler mensual × (12 − meses vacíos) − gastos anuales] ÷ (precio de compra + gastos de compra) × 100.</p></div>
        </div>
        <p className="fine-print">El resultado es anual y antes de impuestos y financiación. No incluye revalorización, derramas extraordinarias ni costes de venta. Introduce los gastos de compra y los gastos anuales según tu caso. Es una estimación para comparar escenarios, no asesoramiento financiero.</p>
      </section>
    </div>
  );
}
