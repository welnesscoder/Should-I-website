import { clamp } from "@/lib/engines/normalize";

export interface EffectiveHourlyInputs {
  annualCompensation: number;
  weeklyHours: number;
  weeklyCommuteHours?: number;
  weeksPerYear?: number;
}

/**
 * Salary (plus bonus, if folded in) divided by all the time it actually
 * takes to earn it — working hours plus commute, since commute time is
 * spent but not paid.
 */
export function effectiveHourlyCompensation({
  annualCompensation,
  weeklyHours,
  weeklyCommuteHours = 0,
  weeksPerYear = 48,
}: EffectiveHourlyInputs): number {
  const annualHours = (weeklyHours + weeklyCommuteHours) * weeksPerYear;
  if (annualHours <= 0) return 0;
  return annualCompensation / annualHours;
}

/**
 * Maps a percentage difference between two comparable numbers onto the
 * shared -2..2 weighted-factor scale (roughly: 15% better ≈ +1, 30%+ ≈ +2).
 */
export function percentDifferenceToScale(current: number, candidate: number): number {
  if (current <= 0) return 0;
  const pctDiff = ((candidate - current) / current) * 100;
  return clamp(pctDiff / 15, -2, 2);
}
