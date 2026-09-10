import { describe, expect, it } from "vitest";
import { effectiveHourlyCompensation, percentDifferenceToScale } from "../compensation";

describe("effectiveHourlyCompensation", () => {
  it("computes pay per hour including commute time", () => {
    const rate = effectiveHourlyCompensation({
      annualCompensation: 96000,
      weeklyHours: 40,
      weeklyCommuteHours: 5,
      weeksPerYear: 48,
    });
    expect(rate).toBeCloseTo(96000 / (45 * 48));
  });

  it("is lower when commute time increases for the same pay", () => {
    const noCommute = effectiveHourlyCompensation({ annualCompensation: 90000, weeklyHours: 40 });
    const longCommute = effectiveHourlyCompensation({
      annualCompensation: 90000,
      weeklyHours: 40,
      weeklyCommuteHours: 10,
    });
    expect(longCommute).toBeLessThan(noCommute);
  });
});

describe("percentDifferenceToScale", () => {
  it("returns 0 for identical values", () => {
    expect(percentDifferenceToScale(100, 100)).toBe(0);
  });

  it("returns a positive value scaled toward +2 for a big improvement", () => {
    expect(percentDifferenceToScale(100, 150)).toBeCloseTo(2);
  });

  it("returns a negative value scaled toward -2 for a big decline", () => {
    expect(percentDifferenceToScale(100, 50)).toBeCloseTo(-2);
  });

  it("clamps to the -2..2 range", () => {
    expect(percentDifferenceToScale(100, 1000)).toBe(2);
  });
});
