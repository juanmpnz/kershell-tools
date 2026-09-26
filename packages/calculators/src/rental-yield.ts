/** Annual, pre-tax rental estimate in euros. Financing is deliberately excluded. */
export interface RentalYieldInput {
  purchasePrice: number;
  purchaseCosts: number;
  monthlyRent: number;
  vacantMonths: number;
  annualIbi: number;
  annualCommunity: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualManagement: number;
}

export interface RentalYieldResult {
  investedCapital: number;
  potentialAnnualRent: number;
  effectiveAnnualRent: number;
  annualExpenses: number;
  annualNetIncome: number;
  grossYieldPercent: number;
  netYieldPercent: number;
}

export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  const nonNegative: (keyof RentalYieldInput)[] = [
    'purchasePrice', 'purchaseCosts', 'monthlyRent', 'annualIbi',
    'annualCommunity', 'annualInsurance', 'annualMaintenance', 'annualManagement',
  ];
  if (nonNegative.some((key) => !Number.isFinite(input[key]) || input[key] < 0)) {
    throw new RangeError('Los importes deben ser números finitos y no negativos.');
  }
  if (input.purchasePrice <= 0 || !Number.isFinite(input.vacantMonths) ||
      input.vacantMonths < 0 || input.vacantMonths > 12) {
    throw new RangeError('Indica un precio positivo y entre 0 y 12 meses vacíos.');
  }

  const investedCapital = input.purchasePrice + input.purchaseCosts;
  const potentialAnnualRent = input.monthlyRent * 12;
  const effectiveAnnualRent = input.monthlyRent * (12 - input.vacantMonths);
  const annualExpenses = input.annualIbi + input.annualCommunity + input.annualInsurance +
    input.annualMaintenance + input.annualManagement;
  const annualNetIncome = effectiveAnnualRent - annualExpenses;

  return {
    investedCapital,
    potentialAnnualRent,
    effectiveAnnualRent,
    annualExpenses,
    annualNetIncome,
    grossYieldPercent: potentialAnnualRent / investedCapital * 100,
    netYieldPercent: annualNetIncome / investedCapital * 100,
  };
}
