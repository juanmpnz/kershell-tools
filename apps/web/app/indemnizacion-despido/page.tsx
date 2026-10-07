import type { Metadata } from 'next';
import { CalculatorHeader } from '@/components/calculator-header';
import { DismissalCalculator } from '@/components/dismissal-calculator';

export const metadata: Metadata = {
  title: 'Calculadora de indemnización por despido en España',
  description: 'Estima la indemnización por despido objetivo o improcedente en España con salario bruto y fechas. Incluye límites legales, régimen anterior a 2012 y fuentes oficiales.',
  alternates: { canonical: '/indemnizacion-despido' },
};

export default function DismissalPage() {
  return <div className="page-shell calculator-page">
    <CalculatorHeader title="Calculadora de indemnización por despido" description="Estima los escenarios de despido objetivo e improcedente en España con tu salario y fechas de contrato." />
    <DismissalCalculator />
    <section className="explanation" aria-labelledby="method-heading">
      <p className="eyebrow">EL MÉTODO</p><h2 id="method-heading">¿Cómo se calcula?</h2>
      <div className="explanation-grid">
        <div><h3>Despido objetivo</h3><p>20 días de salario por año de servicio, prorrateando por meses los periodos inferiores a un año, con un máximo de 12 mensualidades (360 días de salario).</p></div>
        <div><h3>Despido improcedente</h3><p>33 días por año con un máximo de 24 mensualidades (720 días). Si el contrato empezó antes del 12 de febrero de 2012, se calcula el tiempo anterior a 45 días por año y el posterior a 33, con el tope transitorio aplicable.</p></div>
        <div><h3>Salario y antigüedad</h3><p>Usamos el bruto anual que indicas, incluidas pagas extra, dividido por 365 días (366 si el año de cese es bisiesto). Las fechas de inicio y cese se incluyen; cada fracción de mes de servicio se computa como un mes.</p></div>
        <div><h3>Topes y exclusiones</h3><p>El importe es salario diario × días indemnizados, limitado a 360, 720 o, en contratos previos a 2012 cuyo tramo anterior supere 720 días, al importe de ese tramo con máximo de 1.260 días. No calcula impuestos, finiquito ni otros conceptos.</p></div>
      </div>
      <p className="fine-print">Ámbito: relación laboral ordinaria en España, normas comprobadas el 29 de septiembre de 2026. No determina la calificación del despido ni si la empresa optará por readmitir. Excluye despido nulo o disciplinario procedente, relaciones laborales especiales (como empleo del hogar), contratos de fomento anteriores a 2012, fijos discontinuos, jornadas o salarios cambiantes, periodos no computables, convenios con mejoras, representantes legales, despido colectivo con particularidades y posibles diferencias judiciales en el salario regulador. En casos anteriores a 2012 o complejos, contrasta el resultado con la herramienta del CGPJ y asesoramiento profesional. Los datos se calculan en tu navegador y no se envían al sitio.</p>
      <p className="deadline-note"><strong>Si acabas de recibir una carta de despido:</strong> la acción para impugnarlo caduca, como regla general, a los 20 días hábiles. No esperes al resultado de una calculadora para consultar tu caso.</p>
      <h3>Fuentes oficiales y revisión</h3>
      <ul className="source-list">
        <li><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430">BOE: Estatuto de los Trabajadores, arts. 53, 56, 59 y disposición transitoria 11</a></li>
        <li><a href="https://www.poderjudicial.es/cgpj/es/Servicios/Utilidades/Calculo-de-indemnizaciones-por-extincion-de-contrato-de-trabajo/">CGPJ: calculadora oficial de indemnizaciones</a></li>
        <li><a href="https://www.poderjudicial.es/stfls/CGPJ/UTILIDADES/guiaCalculadoraIndemnizaciones.pdf">CGPJ: guía legal y jurisprudencial del cálculo</a></li>
      </ul>
      <p className="fine-print">Revisaremos el texto consolidado del BOE y la guía del CGPJ al menos cada trimestre y antes de cambiar la fórmula. Esta página es información general, no asesoramiento jurídico.</p>
    </section>
  </div>;
}
