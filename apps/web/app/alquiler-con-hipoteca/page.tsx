import type { Metadata } from 'next';
import { CalculatorHeader } from '@/components/calculator-header';
import Link from 'next/link';
import { RentalMortgageCalculator } from '@/components/rental-mortgage-calculator';

export const metadata: Metadata = {
  title: 'Calculadora de alquiler con hipoteca',
  description: 'Calcula cuánto dinero te queda de un alquiler después de gastos e hipoteca: cuota mensual, efectivo anual, alquiler mínimo y capital amortizado.',
  alternates: { canonical: '/alquiler-con-hipoteca' },
};

export default function RentalMortgagePage() {
  return (
    <div className="page-shell calculator-page">
      <CalculatorHeader title="Calculadora de alquiler con hipoteca" description="Calcula cuánto dinero te queda después de gastos y cuotas: efectivo mensual, alquiler mínimo y capital amortizado." />
      <RentalMortgageCalculator />
      <section className="explanation" aria-labelledby="mortgage-method">
        <p className="eyebrow">EL MÉTODO</p><h2 id="mortgage-method">Las cuentas del primer año</h2>
        <div className="explanation-grid">
          <div><h3>Cuota de hipoteca</h3><p>Sistema francés: cuota = P × i ÷ [1 − (1 + i)⁻ⁿ]. P es el precio menos la entrada, i es el TIN anual ÷ 1.200 y n es el plazo en años × 12. Si el interés es cero, cuota = P ÷ n.</p></div>
          <div><h3>Dinero disponible</h3><p>Efectivo anual = alquiler mensual × (12 − meses vacíos) − gastos anuales − 12 cuotas. La media mensual divide ese resultado entre 12; no representa el calendario real de cobros y pagos.</p></div>
          <div><h3>Alquiler mínimo</h3><p>(Gastos anuales + 12 cuotas) ÷ (12 − meses vacíos). Es la renta mensual de los meses alquilados necesaria para que el efectivo anual sea cero.</p></div>
          <div><h3>Aportación y amortización</h3><p>Dinero propio inicial = entrada + gastos iniciales. La rentabilidad del efectivo divide el efectivo anual entre esa aportación. Cada cuota incluye intereses y devolución de capital; mostramos ambas partes por separado.</p></div>
        </div>
        <p className="fine-print">Escenario de compra para alquilar en España, en euros y antes de impuestos. Simula los primeros 12 pagos mensuales de una hipoteca nueva, con TIN constante, sin carencia ni amortizaciones extraordinarias. Los gastos recurrentes se mantienen incluso en meses vacíos. No calcula IRPF, TAE, revalorización, costes de venta ni rentabilidad total. Añade reformas y gastos iniciales a su campo; incluye comisiones y seguros periódicos en los gastos anuales. No incorpora futuros cambios de interés, impagos ni derramas no indicadas. No evalúa si un banco aprobaría la financiación. Las cuotas reales pueden variar por redondeos y condiciones contractuales. Es una estimación para comparar escenarios.</p>
        <h3>Fuentes y revisión</h3>
        <p className="fine-print">Método consultado el 07-10-2026. El interés lo introduces tú; el ejemplo no representa tipos de mercado. Revisamos las fuentes cada trimestre y cuando cambien las hipótesis del método. El cálculo se realiza en tu navegador y los datos no se guardan ni se envían.</p>
        <ul className="source-list">
          <li><a href="https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/simuladores/simulador_prestamo_hipotecario_personal.html" target="_blank" rel="noopener noreferrer">Banco de España: simulador de préstamo e hipótesis del sistema francés.</a></li>
          <li><a href="https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/simuladores/calculo-de-la-tae-de-un-prestamo-hipotecario.html" target="_blank" rel="noopener noreferrer">Banco de España: interés mensual sobre el capital pendiente y periodicidad de pagos.</a></li>
        </ul>
      </section>
      <section className="related-tool" aria-label="Herramientas relacionadas">
        <Link href="/rentabilidad-alquiler" className="tool-card"><div><span className="tool-number">SIGUE COMPARANDO</span><h3>Rentabilidad del inmueble</h3><p>Consulta la rentabilidad bruta y neta antes de financiación.</p></div><span className="card-arrow" aria-hidden="true">↗</span></Link>
        <Link href="/gastos-compra-vivienda-cataluna" className="related-link">Estimar gastos de compra en Cataluña →</Link>
      </section>
    </div>
  );
}
