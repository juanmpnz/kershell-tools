import { describe, expect, it } from 'vitest';
import { calculateRentalMortgage, type RentalMortgageInput } from './rental-mortgage';

const base: RentalMortgageInput = {
  purchasePrice: 200000, purchaseCosts: 20000, downPayment: 40000,
  annualInterestPercent: 3, termYears: 25, monthlyRent: 1000, vacantMonths: 1,
  annualIbi: 500, annualCommunity: 600, annualInsurance: 300,
  annualMaintenance: 600, annualManagement: 0,
};

describe('rental with mortgage', () => {
  it('matches the reference French loan and separates cash from principal', () => {
    const result = calculateRentalMortgage(base);
    expect(result.monthlyPayment).toBeCloseTo(758.7381022, 6);
    expect(result.loanAmount).toBe(160000);
    expect(result.ownCash).toBe(60000);
    expect(result.effectiveAnnualRent).toBe(11000);
    expect(result.annualCashFlow).toBeCloseTo(-104.8572264, 5);
    expect(result.firstYearInterest).toBeCloseTo(4740.3121625, 5);
    expect(result.firstYearPrincipal).toBeCloseTo(4364.5450636, 5);
    expect(result.firstYearInterest + result.firstYearPrincipal).toBeCloseTo(result.annualDebtPayments, 6);
    expect(result.remainingPrincipal + result.firstYearPrincipal).toBeCloseTo(result.loanAmount, 6);
    expect(result.cashOnCashPercent).toBeCloseTo(result.annualCashFlow / 60000 * 100);
    expect(result.averageMonthlyCashFlow).toBeLessThan(0);
    expect(result.occupiedMonthlyCashFlow).toBeGreaterThan(0);
  });
  it('calculates zero interest and a loan paid off in one year', () => {
    const result = calculateRentalMortgage({ ...base, annualInterestPercent: 0, termYears: 1 });
    expect(result.monthlyPayment).toBeCloseTo(160000 / 12);
    expect(result.firstYearInterest).toBe(0);
    expect(result.firstYearPrincipal).toBeCloseTo(160000);
    expect(result.remainingPrincipal).toBeCloseTo(0);
  });
  it('handles cash purchases and undefined return with no own cash', () => {
    const cash = calculateRentalMortgage({ ...base, downPayment: 200000 });
    expect(cash.monthlyPayment).toBe(0);
    expect(cash.annualCashFlow).toBe(9000);
    expect(cash.firstYearPrincipal).toBe(0);
    expect(calculateRentalMortgage({ ...base, downPayment: 0, purchaseCosts: 0 }).cashOnCashPercent).toBeNull();
  });
  it('accounts for all vacancy and finds a rent that balances the annual payments', () => {
    const result = calculateRentalMortgage(base);
    expect(calculateRentalMortgage({ ...base, monthlyRent: result.breakEvenMonthlyRent! }).annualCashFlow).toBeCloseTo(0);
    const empty = calculateRentalMortgage({ ...base, vacantMonths: 12 });
    expect(empty.breakEvenMonthlyRent).toBeNull();
    expect(empty.annualCashFlow).toBeCloseTo(-empty.annualExpenses - empty.annualDebtPayments);
    expect(empty.averageMonthlyCashFlow).toBeCloseTo(empty.vacantMonthlyCashFlow);
  });
  it('allows fractional vacancy and very small positive interest', () => {
    const tiny = calculateRentalMortgage({ ...base, annualInterestPercent: 1e-10, vacantMonths: 0.5 });
    expect(tiny.monthlyPayment).toBeCloseTo(160000 / 300, 6);
    expect(tiny.effectiveAnnualRent).toBe(11500);
  });
  it('rejects invalid financing and rental inputs', () => {
    for (const patch of [
      { downPayment: -1 }, { downPayment: 200001 }, { annualInterestPercent: NaN },
      { annualInterestPercent: 101 }, { termYears: 0 }, { termYears: 1.5 },
      { termYears: 51 }, { purchaseCosts: Infinity }, { monthlyRent: 1e13 },
      { vacantMonths: 13 }, { purchasePrice: 0 },
    ]) expect(() => calculateRentalMortgage({ ...base, ...patch })).toThrow(RangeError);
  });
});
