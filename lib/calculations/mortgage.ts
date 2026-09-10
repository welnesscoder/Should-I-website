/**
 * Standard fixed-rate amortization: M = P * r(1+r)^n / ((1+r)^n - 1)
 */
export function monthlyMortgagePayment(principal: number, annualRatePct: number, termYears: number): number {
  const n = Math.round(termYears * 12);
  if (n <= 0 || principal <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export interface BuyVsRentInputs {
  homePrice: number;
  downPaymentPct: number;
  mortgageRatePct: number;
  mortgageTermYears: number;
  yearsInProperty: number;
  monthlyRent: number;
  propertyTaxPct: number; // annual, % of home value
  insurancePct: number; // annual, % of home value
  maintenancePct: number; // annual, % of home value
  buyingClosingCostPct: number; // one-time, % of home price
  sellingCostPct: number; // one-time, % of sale price
  annualAppreciationPct: number;
  annualRentGrowthPct: number;
  opportunityCostRatePct: number; // annual return assumption for money not spent on the house
}

export interface YearSnapshot {
  year: number;
  cumulativeCostBuying: number;
  cumulativeCostRenting: number;
}

export interface BuyVsRentResult {
  monthlyPayment: number;
  downPayment: number;
  closingCosts: number;
  homeValueAtEnd: number;
  remainingBalanceAtEnd: number;
  equityAtEnd: number;
  netSaleProceeds: number;
  totalCostBuying: number;
  totalCostRenting: number;
  yearlySnapshots: YearSnapshot[];
  breakEvenYear: number | null;
}

/**
 * Simulates owning vs. renting month by month over the given horizon. Both
 * scenarios start from the same cash position: the buyer spends the down
 * payment and closing costs on the house; the renter invests that same
 * amount, and invests (or draws down) the monthly difference between the
 * buyer's carrying costs and rent. This is an educational estimate, not
 * a financial projection — real markets don't move this smoothly.
 */
export function simulateBuyVsRent(inputs: BuyVsRentInputs): BuyVsRentResult {
  const {
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    yearsInProperty,
    monthlyRent,
    propertyTaxPct,
    insurancePct,
    maintenancePct,
    buyingClosingCostPct,
    sellingCostPct,
    annualAppreciationPct,
    annualRentGrowthPct,
    opportunityCostRatePct,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = Math.max(0, homePrice - downPayment);
  const monthlyPayment = monthlyMortgagePayment(loanAmount, mortgageRatePct, mortgageTermYears);
  const closingCosts = homePrice * (buyingClosingCostPct / 100);
  const totalPaymentMonths = Math.round(mortgageTermYears * 12);
  const horizonMonths = Math.round(yearsInProperty * 12);
  const monthlyRate = mortgageRatePct / 100 / 12;
  const opportunityMonthlyRate = opportunityCostRatePct / 100 / 12;

  let balance = loanAmount;
  let homeValue = homePrice;
  let rent = monthlyRent;
  let cashOutBuying = downPayment + closingCosts;
  let totalRentPaid = 0;
  let investedCapital = downPayment + closingCosts;

  const yearlySnapshots: YearSnapshot[] = [];

  for (let month = 1; month <= horizonMonths; month += 1) {
    const interestPortion = balance * monthlyRate;
    const principalPortion = monthlyPayment - interestPortion;
    const payingMortgage = month <= totalPaymentMonths && balance > 0;
    if (payingMortgage) {
      balance = Math.max(0, balance - principalPortion);
      cashOutBuying += monthlyPayment;
    }

    const taxes = (homeValue * propertyTaxPct) / 100 / 12;
    const insurance = (homeValue * insurancePct) / 100 / 12;
    const maintenance = (homeValue * maintenancePct) / 100 / 12;
    cashOutBuying += taxes + insurance + maintenance;

    const buyerMonthlyCarrying = (payingMortgage ? monthlyPayment : 0) + taxes + insurance + maintenance;
    totalRentPaid += rent;

    const contribution = buyerMonthlyCarrying - rent;
    investedCapital = investedCapital * (1 + opportunityMonthlyRate) + contribution;

    if (month % 12 === 0) {
      const year = month / 12;
      const homeValueThisYear = homeValue * (1 + annualAppreciationPct / 100);
      const sellingCostsThisYear = homeValueThisYear * (sellingCostPct / 100);
      const equityThisYear = homeValueThisYear - balance;
      const cumulativeCostBuying = cashOutBuying - (equityThisYear - sellingCostsThisYear);
      const cumulativeCostRenting = totalRentPaid - investedCapital;
      yearlySnapshots.push({ year, cumulativeCostBuying, cumulativeCostRenting });

      homeValue = homeValueThisYear;
      rent *= 1 + annualRentGrowthPct / 100;
    }
  }

  const homeValueAtEnd = homeValue;
  const remainingBalanceAtEnd = balance;
  const equityAtEnd = homeValueAtEnd - remainingBalanceAtEnd;
  const sellingCosts = homeValueAtEnd * (sellingCostPct / 100);
  const netSaleProceeds = equityAtEnd - sellingCosts;

  const totalCostBuying = cashOutBuying - netSaleProceeds;
  const totalCostRenting = totalRentPaid - investedCapital;

  const breakEvenSnapshot = yearlySnapshots.find((s) => s.cumulativeCostBuying <= s.cumulativeCostRenting);

  return {
    monthlyPayment,
    downPayment,
    closingCosts,
    homeValueAtEnd,
    remainingBalanceAtEnd,
    equityAtEnd,
    netSaleProceeds,
    totalCostBuying,
    totalCostRenting,
    yearlySnapshots,
    breakEvenYear: breakEvenSnapshot?.year ?? null,
  };
}
