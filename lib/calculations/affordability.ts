import { clamp } from "@/lib/engines/normalize";

export type NeedVsWant = "need" | "want";

/** Take-home income minus essential monthly expenses. Never negative in the output. */
export function disposableIncome(takeHomeIncome: number, essentialExpenses: number): number {
  return Math.max(0, takeHomeIncome - essentialExpenses);
}

/** Price as a percentage of monthly disposable income. Returns a large number, uncapped, if disposable income is ~0. */
export function purchaseBurdenPct(price: number, monthlyDisposableIncome: number): number {
  if (monthlyDisposableIncome <= 0) return price > 0 ? 999 : 0;
  return (price / monthlyDisposableIncome) * 100;
}

/** Price divided by total expected lifetime uses. */
export function costPerUse(price: number, usesPerMonth: number, ownershipMonths: number): number {
  const totalUses = usesPerMonth * ownershipMonths;
  if (totalUses <= 0) return price;
  return price / totalUses;
}

/** Roughly how many hours of work this purchase costs, given an effective hourly rate. */
export function workHoursForPrice(price: number, effectiveHourlyRate: number): number | undefined {
  if (!effectiveHourlyRate || effectiveHourlyRate <= 0) return undefined;
  return price / effectiveHourlyRate;
}

/** Derives an hourly rate from monthly take-home pay and hours worked per month. */
export function estimatedHourlyRate(monthlyTakeHome: number, hoursWorkedPerMonth: number): number | undefined {
  if (!hoursWorkedPerMonth || hoursWorkedPerMonth <= 0) return undefined;
  return monthlyTakeHome / hoursWorkedPerMonth;
}

export interface AffordabilityInputs {
  burdenPct: number;
  savings: number;
  price: number;
}

/**
 * 0-100, higher = more affordable. Penalizes burden on disposable income;
 * rewards having savings well beyond the purchase price, penalizes buying
 * with savings thinner than the price itself.
 */
export function affordabilityScore({ burdenPct, savings, price }: AffordabilityInputs): number {
  let score = 100 - burdenPct * 1.1;
  if (price > 0) {
    if (savings >= price * 3) score += 10;
    else if (savings < price) score -= 15;
  }
  return clamp(score);
}

export interface UsageInputs {
  usesPerMonth: number;
  costPerUse: number;
}

/** 0-100, higher = the purchase earns its keep through frequent, low-cost-per-use usage. */
export function usageScore({ usesPerMonth, costPerUse }: UsageInputs): number {
  let base: number;
  if (costPerUse <= 1) base = 95;
  else if (costPerUse <= 3) base = 82;
  else if (costPerUse <= 8) base = 65;
  else if (costPerUse <= 20) base = 45;
  else if (costPerUse <= 50) base = 28;
  else base = 15;

  if (usesPerMonth >= 20) base += 5;
  else if (usesPerMonth < 1) base -= 12;

  return clamp(base);
}

export interface ImpulseRiskInputs {
  alreadyOwnsAlternative: boolean;
  howLongWantedMonths: number;
  needVsWant: NeedVsWant;
}

/** 0-100, higher = riskier / more likely to be an impulse regret. */
export function impulseRiskScore({ alreadyOwnsAlternative, howLongWantedMonths, needVsWant }: ImpulseRiskInputs): number {
  let score = 50;
  if (alreadyOwnsAlternative) score += 25;
  score += needVsWant === "want" ? 15 : -15;

  if (howLongWantedMonths >= 6) score -= 20;
  else if (howLongWantedMonths >= 1) score -= 5;
  else score += 20;

  return clamp(score);
}
