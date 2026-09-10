import { describe, expect, it } from "vitest";
import {
  affordabilityScore,
  costPerUse,
  disposableIncome,
  estimatedHourlyRate,
  impulseRiskScore,
  purchaseBurdenPct,
  usageScore,
  workHoursForPrice,
} from "../affordability";

describe("disposableIncome", () => {
  it("subtracts essential expenses from take-home income", () => {
    expect(disposableIncome(4000, 2500)).toBe(1500);
  });

  it("never goes negative", () => {
    expect(disposableIncome(1000, 3000)).toBe(0);
  });
});

describe("purchaseBurdenPct", () => {
  it("computes price as a percentage of disposable income", () => {
    expect(purchaseBurdenPct(300, 1500)).toBeCloseTo(20);
  });

  it("returns a large sentinel when disposable income is zero and price is positive", () => {
    expect(purchaseBurdenPct(100, 0)).toBeGreaterThan(100);
  });

  it("returns 0 when both price and disposable income are 0", () => {
    expect(purchaseBurdenPct(0, 0)).toBe(0);
  });
});

describe("costPerUse", () => {
  it("divides price by total expected uses", () => {
    expect(costPerUse(120, 4, 12)).toBeCloseTo(120 / 48);
  });

  it("falls back to full price when there are no expected uses", () => {
    expect(costPerUse(120, 0, 12)).toBe(120);
  });
});

describe("workHoursForPrice / estimatedHourlyRate", () => {
  it("derives an hourly rate from monthly take-home and hours worked", () => {
    expect(estimatedHourlyRate(4000, 160)).toBeCloseTo(25);
  });

  it("computes hours of work needed for a price at a given rate", () => {
    expect(workHoursForPrice(500, 25)).toBeCloseTo(20);
  });

  it("returns undefined when the hourly rate is not known", () => {
    expect(workHoursForPrice(500, 0)).toBeUndefined();
    expect(estimatedHourlyRate(4000, 0)).toBeUndefined();
  });
});

describe("affordabilityScore", () => {
  it("scores low burden with ample savings as very affordable", () => {
    const score = affordabilityScore({ burdenPct: 5, savings: 10000, price: 200 });
    expect(score).toBeGreaterThan(85);
  });

  it("penalizes a purchase that eats most of disposable income", () => {
    const score = affordabilityScore({ burdenPct: 90, savings: 500, price: 1000 });
    expect(score).toBeLessThan(30);
  });

  it("is monotonically decreasing in burden percentage", () => {
    const low = affordabilityScore({ burdenPct: 10, savings: 5000, price: 500 });
    const high = affordabilityScore({ burdenPct: 60, savings: 5000, price: 500 });
    expect(high).toBeLessThan(low);
  });
});

describe("usageScore", () => {
  it("rewards frequent, cheap-per-use purchases", () => {
    expect(usageScore({ usesPerMonth: 25, costPerUse: 0.5 })).toBeGreaterThan(90);
  });

  it("penalizes rare, expensive-per-use purchases", () => {
    expect(usageScore({ usesPerMonth: 0.5, costPerUse: 200 })).toBeLessThan(20);
  });
});

describe("impulseRiskScore", () => {
  it("is low risk for a genuine need, wanted for a while, no existing alternative", () => {
    const score = impulseRiskScore({
      alreadyOwnsAlternative: false,
      howLongWantedMonths: 12,
      needVsWant: "need",
    });
    expect(score).toBeLessThan(30);
  });

  it("is high risk for a same-day want when an alternative is already owned", () => {
    const score = impulseRiskScore({
      alreadyOwnsAlternative: true,
      howLongWantedMonths: 0,
      needVsWant: "want",
    });
    expect(score).toBeGreaterThan(70);
  });
});
