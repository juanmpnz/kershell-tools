import type { Metadata } from 'next';
import { CalculatorHeader } from '@/components/calculator-header';
import Link from 'next/link';
import { RentalYieldCalculator } from '@/components/rental-yield-calculator';

export const metadata: Metadata = {
  title: 'Calculadora de rentabilidad de alquiler: bruta y neta',
  description: 'Calcula gratis la rentabilidad bruta y neta de un piso en alquiler. Incluye gastos de compra, IBI, comunidad y meses vacíos. Sin registro, con ejemplo y fórmula.',
  alternates: { canonical: '/rentabilidad-alquiler' },
};

export default function RentalYieldPage() {
  return (
    <div className="page-shell calculator-page">
      <CalculatorHeader title="Calculadora de rentabilidad de alquiler" description="Calcula la rentabilidad bruta y neta de un piso con gastos y meses sin inquilino. Gratis, sin registro y antes de impuestos." />
      <RentalYieldCalculator />
      <section className="related-tool" aria-label="Calcula con financiación">
        <Link href="/alquiler-con-hipoteca" className="tool-card"><div><span className="tool-number">¿COMPRARÍAS CON HIPOTECA?</span><h3>Calcula cuánto te quedaría al mes</h3><p>Añade la financiación y descubre el efectivo disponible, el alquiler mínimo y el capital que amortizas.</p></div><span className="card-arrow" aria-hidden="true">↗</span></Link>
      </section>
      <section className="explanation" aria-labelledby="method-heading">
        <p className="eyebrow">EL MÉTODO</p>
        <h2 id="method-heading">¿Cómo calcular la rentabilidad de un alquiler?</h2>
        <p className="method-summary">Divide los ingresos anuales entre el precio de compra más los gastos iniciales y multiplica por 100. Para la rentabilidad neta, descuenta primero los meses sin inquilino y los gastos recurrentes. Aquí «neta» significa después de esos gastos, antes de impuestos y financiación.</p>
        <div className="explanation-grid">
          <div><h3>Rentabilidad bruta</h3><p>Alquiler mensual × 12 ÷ (precio de compra + gastos de compra) × 100.</p></div>
          <div><h3>Rentabilidad neta estimada</h3><p>[Alquiler mensual × (12 − meses vacíos) − gastos anuales] ÷ (precio de compra + gastos de compra) × 100.</p></div>
        </div>
        <p className="fine-print">El resultado es anual y antes de impuestos y financiación. No incluye revalorización, derramas extraordinarias ni costes de venta. Introduce los gastos de compra y los gastos anuales según tu caso. Es una estimación para comparar escenarios, no asesoramiento financiero.</p>
      </section>
      <section className="explanation" aria-labelledby="rental-example">
        <p className="eyebrow">UN EJEMPLO COMPLETO</p>
        <h2 id="rental-example">Un piso de 200.000 € alquilado por 1.000 €</h2>
        <p className="method-summary">Con 20.000 € de gastos de compra, un mes vacío y 2.000 € de gastos anuales, la inversión inicial es 220.000 €. Son los valores de ejemplo que aparecen en la calculadora.</p>
        <div className="example-table-wrap"><table className="example-table"><caption>Rentabilidad del ejemplo, antes de impuestos y financiación</caption><thead><tr><th scope="col">Concepto</th><th scope="col">Cálculo y resultado</th></tr></thead><tbody>
          <tr><th scope="row">Inversión inicial</th><td>200.000 + 20.000 = 220.000 €</td></tr>
          <tr><th scope="row">Alquiler anual potencial</th><td>1.000 × 12 = 12.000 €</td></tr>
          <tr><th scope="row">Ingreso con un mes vacío</th><td>1.000 × 11 = 11.000 €</td></tr>
          <tr><th scope="row">Ingreso después de gastos</th><td>11.000 − 2.000 = 9.000 €</td></tr>
          <tr><th scope="row">Rentabilidad bruta</th><td>12.000 ÷ 220.000 × 100 = 5,45 %</td></tr>
          <tr><th scope="row">Rentabilidad neta estimada</th><td>9.000 ÷ 220.000 × 100 = 4,09 %</td></tr>
        </tbody></table></div>
        <p className="fine-print">Sin meses vacíos, manteniendo los mismos gastos, la rentabilidad neta sería del 4,55 %. El ejemplo muestra cómo la ocupación cambia el resultado; no representa una rentabilidad de mercado ni una recomendación de inversión.</p>
      </section>
      <section className="explanation rental-faq" aria-labelledby="rental-questions">
        <h2 id="rental-questions">Preguntas sobre rentabilidad de alquiler</h2>
        <div><h3>¿Qué diferencia hay entre rentabilidad bruta y neta?</h3><p>La bruta usa el alquiler potencial de 12 meses. La neta de esta calculadora descuenta los meses vacíos y los gastos anuales que introduces. Ambas dividen entre el precio más los gastos de compra; ninguna incluye impuestos sobre tus ingresos.</p></div>
        <div><h3>¿Qué gastos debo incluir al calcular la rentabilidad de un piso?</h3><p>En los gastos iniciales incluye los costes de adquisición y las reformas iniciales que quieras incorporar a la inversión. En los recurrentes introduce IBI, comunidad, seguros, mantenimiento y gestión. Añade otros costes recurrentes a gestión y evita contar el mismo gasto dos veces.</p></div>
        <div><h3>¿La calculadora incluye la hipoteca?</h3><p>Esta herramienta mide el rendimiento del inmueble antes de financiación. Para descontar la cuota y conocer el dinero que te queda, usa la <Link href="/alquiler-con-hipoteca">calculadora de alquiler con hipoteca</Link>. Devolver capital reduce tu deuda y no equivale a dinero disponible.</p></div>
        <div><h3>¿Cómo afectan los meses sin inquilino?</h3><p>Cada mes vacío resta un alquiler mensual a los ingresos. Los gastos anuales indicados se mantienen. Puedes introducir fracciones de mes para representar periodos más cortos sin ocupación.</p></div>
        <div><h3>¿Qué rentabilidad de alquiler es buena?</h3><p>No hay un porcentaje universal. Compara operaciones con los mismos criterios y considera ubicación, mantenimiento, ocupación, financiación, impuestos y riesgo. La cifra calculada no garantiza cobros ni rentabilidad futura.</p></div>
        <div><h3>¿Cómo estimo los gastos de compra?</h3><p>Utiliza presupuestos y los impuestos aplicables a tu operación. Si compras en Cataluña, nuestra <Link href="/gastos-compra-vivienda-cataluna">calculadora de gastos de compra</Link> estima las tarifas generales de vivienda usada o nueva y permite añadir tus gastos.</p></div>
        <p className="fine-print">Herramienta desarrollada por Kershell. Ejemplo y explicación revisados el 07-10-2026. Las fórmulas se verifican con tests de cálculo; revisaremos el método cada trimestre y antes de modificarlo. Los importes se calculan en tu navegador, sin registro ni almacenamiento de tus datos.</p>
      </section>
    </div>
  );
}
