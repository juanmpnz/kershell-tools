/** Cataluña, transmisión de pleno dominio de una vivienda, régimen general (consultado 2026-09-28).
 * ITP TUB: https://atc.gencat.cat/es/tributs/itpajd/tpo/tarifes-tipus/
 * IVA: https://sede.agenciatributaria.gob.es/Sede/iva/iva-operaciones-inmobiliarias/compro-vivienda-tengo-que-pagar-itp.html
 * AJD AJ4: https://atc.gencat.cat/es/tributs/itpajd/operacions/immobles/compravenda-immobles/
 * Base: https://atc.gencat.cat/es/tributs/itpajd/tpo/base-imposable/
 * https://atc.gencat.cat/es/tributs/itpajd/ajd/documents-notarials/
 */
export type PurchaseKind = 'used' | 'new';
export interface PurchaseCostsInput {
  kind: PurchaseKind;
  purchasePrice: number;
  /** Optional higher fiscal value: cadastral reference, declared or market value, as applicable. */
  otherFiscalValue: number;
  notary: number;
  registry: number;
  agency: number;
  appraisal: number;
  mortgagePrincipal: number;
}
export interface PurchaseCostsResult {
  taxBase: number;
  transferTax: number;
  vat: number;
  documentedActsTax: number;
  taxes: number;
  otherCosts: number;
  acquisitionCosts: number;
  totalPriceAndCosts: number;
  cashNeeded: number;
}

/** Progressive TUB tariff from 27 June 2025, for acquisition of the entire property. */
export function generalTransferTax(taxBase: number): number {
  if (!Number.isFinite(taxBase) || taxBase < 0) throw new RangeError('Base imponible no válida.');
  const bands = [
    { width: 600_000, rate: 0.10 },
    { width: 300_000, rate: 0.11 },
    { width: 600_000, rate: 0.12 },
    { width: Infinity, rate: 0.13 },
  ];
  let remaining = taxBase;
  let tax = 0;
  for (const band of bands) {
    const amount = Math.min(remaining, band.width);
    tax += amount * band.rate;
    remaining -= amount;
    if (remaining <= 0) break;
  }
  return Math.round((tax + Number.EPSILON) * 100) / 100;
}

export function calculatePurchaseCosts(input: PurchaseCostsInput): PurchaseCostsResult {
  const fields: (keyof Omit<PurchaseCostsInput, 'kind'>)[] = [
    'purchasePrice', 'otherFiscalValue', 'notary', 'registry', 'agency', 'appraisal', 'mortgagePrincipal',
  ];
  if ((input.kind !== 'used' && input.kind !== 'new') || fields.some((key) =>
    !Number.isFinite(input[key]) || input[key] < 0 || input[key] > Number.MAX_SAFE_INTEGER
  ) || input.purchasePrice <= 0 || input.mortgagePrincipal > input.purchasePrice) {
    throw new RangeError('Revisa el precio, los importes y el préstamo: no puede superar el precio.');
  }
  const taxBase = Math.max(input.purchasePrice, input.otherFiscalValue);
  const transferTax = input.kind === 'used' ? generalTransferTax(taxBase) : 0;
  const vat = input.kind === 'new' ? Math.round(input.purchasePrice * 10) / 100 : 0;
  const documentedActsTax = input.kind === 'new' ? Math.round(taxBase * 1.5) / 100 : 0;
  const taxes = transferTax + vat + documentedActsTax;
  const otherCosts = input.notary + input.registry + input.agency + input.appraisal;
  const acquisitionCosts = taxes + otherCosts;
  const totalPriceAndCosts = input.purchasePrice + acquisitionCosts;
  return {
    taxBase, transferTax, vat, documentedActsTax, taxes, otherCosts,
    acquisitionCosts, totalPriceAndCosts,
    cashNeeded: totalPriceAndCosts - input.mortgagePrincipal,
  };
}
