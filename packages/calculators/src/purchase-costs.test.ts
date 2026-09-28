import { describe, expect, it } from 'vitest';
import { calculatePurchaseCosts, generalTransferTax, type PurchaseCostsInput } from './purchase-costs';

const base: PurchaseCostsInput = {
  kind: 'used', purchasePrice: 300_000, otherFiscalValue: 0,
  notary: 1_000, registry: 500, agency: 0, appraisal: 400, mortgagePrincipal: 240_000,
};

describe('Catalonia general purchase costs', () => {
  it.each([
    [600_000, 60_000], [600_001, 60_000.11],
    [900_000, 93_000], [900_001, 93_000.12],
    [1_500_000, 165_000], [1_500_001, 165_000.13],
  ])('calculates TUB at the boundary %i', (price, tax) => {
    expect(generalTransferTax(price)).toBe(tax);
  });
  it('adds ITP, entered expenses and subtracts the loan from cash needed', () => {
    const result = calculatePurchaseCosts(base);
    expect(result.transferTax).toBe(30_000);
    expect(result.otherCosts).toBe(1_900);
    expect(result.acquisitionCosts).toBe(31_900);
    expect(result.cashNeeded).toBe(91_900);
  });
  it('uses a higher fiscal value for ITP and AJD, but IVA on price', () => {
    const used = calculatePurchaseCosts({ ...base, otherFiscalValue: 350_000 });
    expect(used.taxBase).toBe(350_000);
    expect(used.transferTax).toBe(35_000);
    const fresh = calculatePurchaseCosts({ ...base, kind: 'new', otherFiscalValue: 350_000 });
    expect(fresh.vat).toBe(30_000);
    expect(fresh.documentedActsTax).toBe(5_250);
    expect(fresh.transferTax).toBe(0);
  });
  it('rejects invalid amounts and loans exceeding the price', () => {
    expect(() => calculatePurchaseCosts({ ...base, purchasePrice: 0 })).toThrow(RangeError);
    expect(() => calculatePurchaseCosts({ ...base, notary: Number.NaN })).toThrow(RangeError);
    expect(() => calculatePurchaseCosts({ ...base, otherFiscalValue: -1 })).toThrow(RangeError);
    expect(() => calculatePurchaseCosts({ ...base, mortgagePrincipal: 300_001 })).toThrow(RangeError);
  });
});
