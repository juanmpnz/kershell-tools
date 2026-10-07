'use client';

import { useState } from 'react';
import { DecimalInput } from './decimal-input';
import { calculatePurchaseCosts, type PurchaseCostsInput, type PurchaseKind } from '@kershell/calculators';

const initial: Omit<PurchaseCostsInput, 'kind'> = {
  purchasePrice: 300000, otherFiscalValue: 0, notary: 0, registry: 0,
  agency: 0, appraisal: 0, mortgagePrincipal: 0,
};
const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
type NumericKey = keyof typeof initial;
const fields: { key: NumericKey; label: string; hint?: string }[] = [
  { key: 'purchasePrice', label: 'Precio de compra' },
  { key: 'otherFiscalValue', label: 'Otro valor fiscal, si es mayor', hint: 'Valor de referencia catastral, declarado o de mercado, según corresponda. Déjalo en 0 si no hay un valor superior conocido.' },
  { key: 'notary', label: 'Notaría' },
  { key: 'registry', label: 'Registro' },
  { key: 'agency', label: 'Gestoría' },
  { key: 'appraisal', label: 'Tasación' },
  { key: 'mortgagePrincipal', label: 'Importe del préstamo', hint: 'Opcional. Reduce el dinero propio necesario, no los impuestos de la compraventa.' },
];

export function PurchaseCostsCalculator() {
  const [kind, setKind] = useState<PurchaseKind>('used');
  const [values, setValues] = useState<Record<NumericKey, string>>(() =>
    Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, value.toFixed(2)])) as Record<NumericKey, string>
  );
  let result: ReturnType<typeof calculatePurchaseCosts> | null = null;
  try {
    if (Object.values(values).every((value) => value.trim() !== '')) {
      const input = { ...initial, kind };
      for (const key of Object.keys(initial) as NumericKey[]) input[key] = Number(values[key]);
      result = calculatePurchaseCosts(input);
    }
  } catch { /* Show the validation message in the result panel. */ }

  return (
    <section className="calculator" aria-label="Calculadora de gastos de compra">
      <div className="form-panel">
        <div className="panel-heading"><span className="eyebrow">01 / TUS DATOS</span><h2>La compra</h2><p>Compra del 100 % de una vivienda en Cataluña, en régimen general.</p></div>
        <fieldset className="kind-picker"><legend>Tipo de vivienda</legend>
          <label><input type="radio" name="kind" value="used" checked={kind === 'used'} onChange={() => setKind('used')} /> Usada</label>
          <label><input type="radio" name="kind" value="new" checked={kind === 'new'} onChange={() => setKind('new')} /> Nueva</label>
        </fieldset>
        <div className="fields">{fields.slice(0, 2).map(renderField)}</div>
        <div className="form-divider" />
        <h3 className="field-group-title">Otros gastos <span>introduce tu presupuesto</span></h3>
        <div className="fields">{fields.slice(2, 6).map(renderField)}</div>
        <div className="form-divider" />
        <div className="fields">{fields.slice(6).map(renderField)}</div>
      </div>
      <div className="result-panel" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">02 / RESULTADO ESTIMADO</span>
        {result ? <>
          <p className="result-label">Gastos e impuestos de compra</p>
          <div className="hero-number money-hero">{euro.format(result.acquisitionCosts)}</div>
          <p className="result-caption">Además del precio de la vivienda. Los gastos que no hayas rellenado se cuentan como 0 €.</p>
          <div className="result-divider" />
          <dl className="result-list">
            <div><dt>Base fiscal estimada</dt><dd>{euro.format(result.taxBase)}</dd></div>
            {kind === 'used' ? <div><dt>ITP, tarifa general TUB</dt><dd>{euro.format(result.transferTax)}</dd></div> : <>
              <div><dt>IVA, 10 % del precio</dt><dd>{euro.format(result.vat)}</dd></div>
              <div><dt>AJD, 1,5 % de la base</dt><dd>{euro.format(result.documentedActsTax)}</dd></div>
            </>}
            <div><dt>Otros gastos indicados</dt><dd>{euro.format(result.otherCosts)}</dd></div>
            <div className="total"><dt>Precio + gastos</dt><dd>{euro.format(result.totalPriceAndCosts)}</dd></div>
          </dl>
          <div className="gross-result"><span>Dinero propio estimado{result.cashNeeded === result.totalPriceAndCosts ? ' (sin préstamo)' : ''}</span><strong>{euro.format(result.cashNeeded)}</strong></div>
        </> : <p className="input-error" role="status">Introduce un precio mayor que 0 y gastos no negativos. El préstamo no puede superar el precio de compra.</p>}
      </div>
    </section>
  );

  function renderField({ key, label, hint }: (typeof fields)[number]) {
    return <div className="field" key={key}>
      <label htmlFor={key}>{label}</label>
      <div className="input-wrap"><DecimalInput id={key} min={key === 'purchasePrice' ? '0.01' : '0'} value={values[key]} onValueChange={(value) => setValues((current) => ({ ...current, [key]: value }))} aria-describedby={hint ? `${key}-hint` : undefined} /><span>€</span></div>
      {hint && <p className="field-hint" id={`${key}-hint`}>{hint}</p>}
    </div>;
  }
}
