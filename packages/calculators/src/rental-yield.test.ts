import { describe, expect, it } from 'vitest';
import { calculateRentalYield, type RentalYieldInput } from './rental-yield';

const base: RentalYieldInput = {
  purchasePrice: 200_000, purchaseCosts: 20_000, monthlyRent: 1_000,
  vacantMonths: 1, annualIbi: 500, annualCommunity: 600,
  annualInsurance: 300, annualMaintenance: 600, annualManagement: 0,
};

describe('calculateRentalYield', () => {
  it('uses the full acquisition cost and vacancy for net yield', () => {
    const result = calculateRentalYield(base);
    expect(result.investedCapital).toBe(220_000);
    expect(result.potentialAnnualRent).toBe(12_000);
    expect(result.effectiveAnnualRent).toBe(11_000);
    expect(result.annualExpenses).toBe(2_000);
    expect(result.annualNetIncome).toBe(9_000);
    expect(result.grossYieldPercent).toBeCloseTo(12_000 / 220_000 * 100);
    expect(result.netYieldPercent).toBeCloseTo(9_000 / 220_000 * 100);
  });

  it('can show a negative net return', () => {
    expect(calculateRentalYield({ ...base, annualMaintenance: 20_000 }).netYieldPercent).toBeLessThan(0);
  });

  it('rejects invalid money and vacancy values', () => {
    expect(() => calculateRentalYield({ ...base, purchasePrice: 0 })).toThrow(RangeError);
    expect(() => calculateRentalYield({ ...base, monthlyRent: Number.NaN })).toThrow(RangeError);
    expect(() => calculateRentalYield({ ...base, vacantMonths: 13 })).toThrow(RangeError);
  });
});
