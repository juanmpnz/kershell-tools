'use client';

import { useState } from 'react';
import { DecimalInput } from './decimal-input';
import { calculateRentalMortgage, type RentalMortgageInput } from '@kershell/calculators';

const initial: RentalMortgageInput = {
  purchasePrice: 200000, purchaseCosts: 20000, downPayment: 40000,
  annualInterestPercent: 3, termYears: 25, monthlyRent: 1000, vacantMonths: 1,
  annualIbi: 500, annualCommunity: 600, annualInsurance: 300,
  annualMaintenance: 600, annualManagement: 0,
};
const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });
type Field = { key: keyof RentalMortgageInput; label: string; suffix: string; min?: number; max?: number; step?: number | 'any'; hint?: string };
const propertyFields: Field[] = [
  { key: 'purchasePrice', label: 'Precio de compra', suffix: '€', min: 0.01 },
  { key: 'purchaseCosts', label: 'Gastos iniciales', suffix: '€', hint: 'Impuestos, notaría, registro, reforma inicial y costes de financiación. Se pagan con dinero propio.' },
  { key: 'monthlyRent', label: 'Alquiler mensual', suffix: '€' },
  { key: 'vacantMonths', label: 'Meses sin inquilino al año', suffix: 'meses', max: 12, step: 0.5 },
];
const loanFields: Field[] = [
  { key: 'downPayment', label: 'Entrada para la vivienda', suffix: '€', hint: 'Parte del precio que pagas con dinero propio, sin los gastos iniciales.' },
  { key: 'annualInterestPercent', label: 'Interés nominal anual (TIN)', suffix: '%', max: 100, hint: 'Introduce el TIN de tu oferta, no la TAE. Se mantiene constante en este escenario.' },
  { key: 'termYears', label: 'Plazo de la hipoteca', suffix: 'años', min: 1, max: 50, step: 1 },
];
const expenseFields: Field[] = [
  { key: 'annualIbi', label: 'IBI anual', suffix: '€' },
  { key: 'annualCommunity', label: 'Comunidad anual', suffix: '€' },
  { key: 'annualInsurance', label: 'Seguros anuales', suffix: '€', hint: 'Incluye aquí los seguros de vivienda, impago o vinculados a la hipoteca que pagues.' },
  { key: 'annualMaintenance', label: 'Mantenimiento anual', suffix: '€' },
  { key: 'annualManagement', label: 'Gestión y otros gastos anuales', suffix: '€', hint: 'Añade comisiones periódicas y suministros a tu cargo. Evita contar un gasto dos veces.' },
];

export function RentalMortgageCalculator() {
  const [values, setValues] = useState<Record<keyof RentalMortgageInput, string>>(() =>
    Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, key === 'vacantMonths' || key === 'termYears' ? String(value) : value.toFixed(2)])) as Record<keyof RentalMortgageInput, string>
  );
  let result: ReturnType<typeof calculateRentalMortgage> | null = null;
  let error = 'Completa todos los campos para calcular el resultado.';
  try {
    if (Object.values(values).every((value) => value.trim() !== '')) {
      const input = { ...initial };
      for (const key of Object.keys(initial) as (keyof RentalMortgageInput)[]) input[key] = Number(values[key]);
      result = calculateRentalMortgage(input);
    }
  } catch (cause) { if (cause instanceof RangeError) error = cause.message; }

  function fields(items: Field[]) {
    return items.map(({ key, label, suffix, min = 0, max = 1e12, step = 'any', hint }) => (
      <div className="field" key={key}>
        <label htmlFor={`mortgage-${key}`}>{label}</label>
        <div className="input-wrap">{key === 'termYears' || key === 'vacantMonths' ? <input id={`mortgage-${key}`} type="number" inputMode={step === 1 ? 'numeric' : 'decimal'} min={min} max={max} step={step} value={values[key]} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /> : <DecimalInput id={`mortgage-${key}`} min={min} max={key === 'downPayment' ? Number(values.purchasePrice) : max} value={values[key]} onValueChange={(value) => setValues((current) => ({ ...current, [key]: value }))} aria-describedby={hint ? `mortgage-${key}-hint` : undefined} />}<span>{suffix}</span></div>
        {hint && <p className="field-hint" id={`mortgage-${key}-hint`}>{hint}</p>}
      </div>
    ));
  }
  return (
    <section className="calculator" aria-label="Calculadora de alquiler con hipoteca">
      <div className="form-panel">
        <div className="panel-heading"><span className="eyebrow">01 / TUS DATOS</span><h2>Compra y alquiler</h2><p>Los valores iniciales son un ejemplo, no una oferta bancaria. Sustitúyelos por tus cifras.</p></div>
        <div className="fields">{fields(propertyFields)}</div>
        <div className="form-divider" />
        <h3 className="field-group-title">La hipoteca <span>nueva, sin carencia</span></h3>
        <div className="fields">{fields(loanFields)}</div>
        <div className="form-divider" />
        <h3 className="field-group-title">Gastos recurrentes <span>al año</span></h3>
        <div className="fields">{fields(expenseFields)}</div>
      </div>
      <div className="result-panel" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">02 / PRIMER AÑO ESTIMADO</span>
        {result ? <>
          <p className="result-label">Dinero disponible al mes · media anual</p>
          <div className="hero-number money-hero">{money.format(result.averageMonthlyCashFlow)}</div>
          <p className="result-caption">Después de gastos y de la cuota completa de hipoteca, antes de impuestos. Incluye los meses sin inquilino.</p>
          {result.annualCashFlow < 0 && <p className="cashflow-warning">Con estas cifras necesitarías aportar {money.format(-result.annualCashFlow)} durante el año para cubrir los pagos.</p>}
          <div className="result-divider" />
          <dl className="result-list">
            <div><dt>Importe de hipoteca</dt><dd>{money.format(result.loanAmount)}</dd></div>
            <div><dt>Dinero propio inicial</dt><dd>{money.format(result.ownCash)}</dd></div>
            <div><dt>Cuota mensual de hipoteca</dt><dd>{money.format(result.monthlyPayment)}</dd></div>
            <div><dt>Mes alquilado, gastos prorrateados</dt><dd>{money.format(result.occupiedMonthlyCashFlow)}</dd></div>
            <div><dt>Mes vacío, gastos prorrateados</dt><dd>{money.format(result.vacantMonthlyCashFlow)}</dd></div>
            <div className="total"><dt>Alquiler mínimo para cubrir pagos</dt><dd>{result.breakEvenMonthlyRent === null ? 'Sin solución' : money.format(result.breakEvenMonthlyRent)}</dd></div>
          </dl>
          <p className="result-caption">El alquiler mínimo tiene en cuenta la ocupación indicada y los gastos del año. Con 12 meses vacíos no hay ingresos que cubran los pagos.</p>
          <div className="gross-result"><span>Rentabilidad del efectivo sobre dinero propio</span><strong>{result.cashOnCashPercent === null ? 'No calculable' : `${percent.format(result.cashOnCashPercent)} %`}</strong></div>
          <p className="result-caption">Efectivo anual ÷ dinero propio inicial. No incluye revalorización ni capital amortizado; con aportación inicial cero no se puede calcular.</p>
          <div className="result-divider" />
          <h3 className="mortgage-result-heading">El año, desglosado</h3>
          <dl className="result-list">
            <div><dt>Alquiler cobrado estimado</dt><dd>{money.format(result.effectiveAnnualRent)}</dd></div>
            <div><dt>Gastos recurrentes</dt><dd>− {money.format(result.annualExpenses)}</dd></div>
            <div><dt>Pagos de hipoteca</dt><dd>− {money.format(result.annualDebtPayments)}</dd></div>
            <div className="total"><dt>Efectivo disponible anual</dt><dd>{money.format(result.annualCashFlow)}</dd></div>
          </dl>
          <details className="mortgage-details"><summary>Intereses y capital amortizado</summary>
            <dl className="result-list">
              <div><dt>Intereses del primer año</dt><dd>{money.format(result.firstYearInterest)}</dd></div>
              <div><dt>Capital amortizado en el año</dt><dd>{money.format(result.firstYearPrincipal)}</dd></div>
              <div><dt>Deuda al finalizar el año</dt><dd>{money.format(result.remainingPrincipal)}</dd></div>
            </dl>
            <p className="result-caption">El capital amortizado reduce tu deuda. Ya está incluido en las cuotas descontadas y no es dinero disponible para gastar.</p>
          </details>
        </> : <p className="input-error" role="status">{error}</p>}
      </div>
    </section>
  );
}
