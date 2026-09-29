'use client';

import { useState } from 'react';
import { calculateDismissalCompensation, type DismissalKind } from '@kershell/calculators';

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
const decimal = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

export function DismissalCalculator() {
  const [kind, setKind] = useState<DismissalKind>('objective');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState('30000');
  let result: ReturnType<typeof calculateDismissalCompensation> | null = null;
  if (startDate && endDate && salary.trim()) {
    try {
      result = calculateDismissalCompensation({ kind, startDate, endDate, annualGrossSalary: Number(salary) });
    } catch { /* Show the validation hint below. */ }
  }

  return <section className="calculator" aria-label="Calculadora de indemnización por despido">
    <div className="form-panel">
      <div className="panel-heading"><span className="eyebrow">01 / TUS DATOS</span><h2>Tu relación laboral</h2><p>Régimen general del Estatuto de los Trabajadores de España. Indica el escenario que quieres estimar: la calculadora no determina si un despido es procedente o improcedente.</p></div>
      <fieldset className="kind-picker"><legend>Escenario de despido</legend>
        <label><input type="radio" name="dismissal-kind" value="objective" checked={kind === 'objective'} onChange={() => setKind('objective')} /> Objetivo (20 días/año)</label>
        <label><input type="radio" name="dismissal-kind" value="unfair" checked={kind === 'unfair'} onChange={() => setKind('unfair')} /> Improcedente (33 días/año, con régimen anterior a 2012)</label>
      </fieldset>
      <div className="fields">
        <div className="field"><label htmlFor="dismissal-start">Fecha de inicio</label><div className="input-wrap"><input id="dismissal-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div></div>
        <div className="field"><label htmlFor="dismissal-end">Fecha de cese efectivo</label><div className="input-wrap"><input id="dismissal-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div></div>
        <div className="field"><label htmlFor="dismissal-salary">Salario bruto anual</label><div className="input-wrap"><input id="dismissal-salary" type="number" inputMode="decimal" min="0.01" step="any" value={salary} onChange={(event) => setSalary(event.target.value)} aria-describedby="dismissal-salary-hint" /><span>€</span></div><p className="field-hint" id="dismissal-salary-hint">Incluye pagas extra y retribuciones salariales habituales. Si tu salario varía, consulta el salario regulador aplicable.</p></div>
      </div>
    </div>
    <div className="result-panel" aria-live="polite" aria-atomic="true">
      <span className="eyebrow">02 / RESULTADO ORIENTATIVO</span>
      {result ? <>
        <p className="result-label">Indemnización estimada</p><div className="hero-number money-hero">{money.format(result.compensation)}</div>
        <p className="result-caption">Supone que corresponde la indemnización del escenario elegido. No incluye finiquito, preaviso, salarios de tramitación ni importes adicionales.</p>
        <div className="result-divider" />
        <dl className="result-list">
          <div><dt>Salario diario estimado</dt><dd>{money.format(result.salaryPerDay)}</dd></div>
          <div><dt>Antigüedad (meses iniciados)</dt><dd>{result.monthsOfService}</dd></div>
          {kind === 'unfair' && result.before2012Months > 0 && <>
            <div><dt>Meses anteriores al 12/02/2012 (45 días/año)</dt><dd>{result.before2012Months}</dd></div>
            <div><dt>Meses desde el 12/02/2012 (33 días/año)</dt><dd>{result.after2012Months}</dd></div>
          </>}
          <div><dt>Días calculados antes del tope</dt><dd>{decimal.format(result.uncappedDays)}</dd></div>
          <div><dt>Tope legal aplicado (días de salario)</dt><dd>{decimal.format(result.capDays)}</dd></div>
          <div className="total"><dt>Días indemnizados</dt><dd>{decimal.format(result.compensatedDays)}</dd></div>
        </dl>
      </> : <p className="result-caption result-prompt">Introduce ambas fechas y un salario anual positivo para ver la estimación. La fecha de cese no puede ser anterior al inicio.</p>}
    </div>
  </section>;
}
