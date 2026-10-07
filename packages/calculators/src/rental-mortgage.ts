import { calculateRentalYield, type RentalYieldInput } from './rental-yield';

/** First 12 months of a new, fixed-rate French-amortization loan. EUR, before tax. */
export interface RentalMortgageInput extends RentalYieldInput {
  downPayment: number;
  annualInterestPercent: number;
  termYears: number;
}

export interface RentalMortgageResult {
  loanAmount: number;
  ownCash: number;
  monthlyPayment: number;
  effectiveAnnualRent: number;
  annualExpenses: number;
  annualDebtPayments: number;
  annualCashFlow: number;
  averageMonthlyCashFlow: number;
  occupiedMonthlyCashFlow: number;
  vacantMonthlyCashFlow: number;
  breakEvenMonthlyRent: number | null;
  cashOnCashPercent: number | null;
  firstYearInterest: number;
  firstYearPrincipal: number;
  remainingPrincipal: number;
}

export function calculateRentalMortgage(input: RentalMortgageInput): RentalMortgageResult {
  const rental = calculateRentalYield(input);
  if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0 || value > 1e12)) {
    throw new RangeError('Indica importes finitos entre 0 y un billón de euros.');
  }
  if (input.downPayment > input.purchasePrice) {
    throw new RangeError('La entrada no puede superar el precio de compra.');
  }
  if (input.annualInterestPercent > 100 || !Number.isInteger(input.termYears) || input.termYears < 1 || input.termYears > 50) {
    throw new RangeError('Indica un TIN entre 0 y 100 % y un plazo entero entre 1 y 50 años.');
  }
  const loanAmount = input.purchasePrice - input.downPayment;
  const ownCash = input.downPayment + input.purchaseCosts;
  const months = input.termYears * 12;
  const rate = input.annualInterestPercent / 1200;
  // expm1/log1p avoid cancellation for interest rates close to zero.
  const monthlyPayment = rate === 0 ? loanAmount / months : loanAmount * rate / -Math.expm1(-months * Math.log1p(rate));
  let remainingPrincipal = loanAmount;
  let firstYearInterest = 0;
  let firstYearPrincipal = 0;
  for (let month = 0; month < 12; month++) {
    const interest = remainingPrincipal * rate;
    const principal = Math.min(remainingPrincipal, Math.max(0, monthlyPayment - interest));
    firstYearInterest += interest;
    firstYearPrincipal += principal;
    remainingPrincipal = Math.max(0, remainingPrincipal - principal);
  }
  const annualDebtPayments = monthlyPayment * 12;
  const annualCashFlow = rental.annualNetIncome - annualDebtPayments;
  return {
    loanAmount, ownCash, monthlyPayment,
    effectiveAnnualRent: rental.effectiveAnnualRent,
    annualExpenses: rental.annualExpenses,
    annualDebtPayments, annualCashFlow,
    averageMonthlyCashFlow: annualCashFlow / 12,
    occupiedMonthlyCashFlow: input.monthlyRent - rental.annualExpenses / 12 - monthlyPayment,
    vacantMonthlyCashFlow: -rental.annualExpenses / 12 - monthlyPayment,
    breakEvenMonthlyRent: input.vacantMonths === 12 ? null : (rental.annualExpenses + annualDebtPayments) / (12 - input.vacantMonths),
    cashOnCashPercent: ownCash === 0 ? null : annualCashFlow / ownCash * 100,
    firstYearInterest, firstYearPrincipal, remainingPrincipal,
  };
}
