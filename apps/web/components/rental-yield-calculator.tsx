'use client';

import { useState } from 'react';
import { DecimalInput } from './decimal-input';
import { calculateRentalYield, type RentalYieldInput } from '@kershell/calculators';

const initial: RentalYieldInput = {
  purchasePrice: 200000, purchaseCosts: 20000, monthlyRent: 1000,
  vacantMonths: 1, annualIbi: 500, annualCommunity: 600,
  annualInsurance: 300, annualMaintenance: 600, annualManagement: 0,
};

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

type Field = { key: keyof RentalYieldInput; label: string; suffix: string; max?: number; hint?: string };
const purchaseFields: Field[] = [
  { key: 'purchasePrice', label: 'Precio de compra', suffix: '€' },
  { key: 'purchaseCosts', label: 'Gastos de compra', suffix: '€', hint: 'Impuestos, notaría, registro y otros costes de adquisición.' },
  { key: 'monthlyRent', label: 'Alquiler mensual', suffix: '€' },
  { key: 'vacantMonths', label: 'Meses vacíos al año', suffix: 'meses', max: 12 },
];
const expenseFields: Field[] = [
  { key: 'annualIbi', label: 'IBI anual', suffix: '€' },
  { key: 'annualCommunity', label: 'Comunidad anual', suffix: '€' },
  { key: 'annualInsurance', label: 'Seguro anual', suffix: '€' },
  { key: 'annualMaintenance', label: 'Mantenimiento anual', suffix: '€' },
  { key: 'annualManagement', label: 'Gestión anual', suffix: '€' },
];

export function RentalYieldCalculator() {
  const [values, setValues] = useState<Record<keyof RentalYieldInput, string>>(() =>
    Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, key === 'vacantMonths' ? String(value) : value.toFixed(2)])) as Record<keyof RentalYieldInput, string>
  );
  let result: ReturnType<typeof calculateRentalYield> | null = null;
  try {
    if (Object.values(values).every((value) => value.trim() !== '')) {
      const numericValues = { ...initial };
      for (const key of Object.keys(initial) as (keyof RentalYieldInput)[]) {
        numericValues[key] = Number(values[key]);
      }
      result = calculateRentalYield(numericValues);
    }
  } catch { /* Input errors are shown below. */ }

  function update(key: keyof RentalYieldInput, raw: string) {
    setValues((current) => ({ ...current, [key]: raw }));
  }

  function renderFields(fields: Field[]) {
    return fields.map(({ key, label, suffix, max, hint }) => (
      <div className="field" key={key}>
        <label htmlFor={key}>{label}</label>
        <div className="input-wrap">{key === 'vacantMonths' ? <input id={key} type="number" inputMode="decimal" min={0} max={max} step={0.5} value={values[key]} onChange={(event) => update(key, event.target.value)} /> : <DecimalInput id={key} min={key === 'purchasePrice' ? 0.01 : 0} max={max} value={values[key]} onValueChange={(value) => update(key, value)} aria-describedby={hint ? `${key}-hint` : undefined} />}<span>{suffix}</span></div>
        {hint && <p className="field-hint" id={`${key}-hint`}>{hint}</p>}
      </div>
    ));
  }

  return (
    <section className="calculator" aria-label="Calculadora de rentabilidad">
      <div className="form-panel">
        <div className="panel-heading"><span className="eyebrow">01 / TUS DATOS</span><h2>La vivienda</h2><p>Modifica los importes para comparar escenarios al instante.</p></div>
        <div className="fields">{renderFields(purchaseFields)}</div>
        <div className="form-divider" />
        <h3 className="field-group-title">Gastos recurrentes <span>al año</span></h3>
        <div className="fields">{renderFields(expenseFields)}</div>
      </div>
      <div className="result-panel" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">02 / RESULTADO ESTIMADO</span>
        {result ? <>
          <p className="result-label">Rentabilidad neta anual</p>
          <div className="hero-number">{percent.format(result.netYieldPercent)}<span>%</span></div>
          <p className="result-caption">Después de los gastos anuales que has indicado, antes de impuestos y financiación.</p>
          <div className="result-divider" />
          <dl className="result-list">
            <div><dt>Capital invertido</dt><dd>{money.format(result.investedCapital)}</dd></div>
            <div><dt>Alquiler anual potencial</dt><dd>{money.format(result.potentialAnnualRent)}</dd></div>
            <div><dt>Ingreso tras meses vacíos</dt><dd>{money.format(result.effectiveAnnualRent)}</dd></div>
            <div><dt>Gastos anuales</dt><dd>− {money.format(result.annualExpenses)}</dd></div>
            <div className="total"><dt>Ingreso neto anual estimado</dt><dd>{money.format(result.annualNetIncome)}</dd></div>
          </dl>
          <div className="gross-result"><span>Rentabilidad bruta</span><strong>{percent.format(result.grossYieldPercent)} %</strong></div>
        </> : <p className="input-error" role="status">Revisa los valores: el precio debe ser mayor que cero, los importes no pueden ser negativos y los meses vacíos deben estar entre 0 y 12.</p>}
      </div>
    </section>
  );
}
