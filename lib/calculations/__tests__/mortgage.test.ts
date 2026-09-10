import { describe, expect, it } from "vitest";
import { monthlyMortgagePayment, simulateBuyVsRent } from "../mortgage";

describe("monthlyMortgagePayment", () => {
  it("matches a known amortization value (300k, 6%, 30yr ~= $1798.65)", () => {
    const payment = monthlyMortgagePayment(300000, 6, 30);
    expect(payment).toBeCloseTo(1798.65, 1);
  });

  it("divides evenly with a 0% rate", () => {
    expect(monthlyMortgagePayment(120000, 0, 10)).toBeCloseTo(1000);
  });

  it("returns 0 for a zero or negative principal", () => {
    expect(monthlyMortgagePayment(0, 5, 30)).toBe(0);
  });
});

const baseInputs = {
  homePrice: 380000,
  downPaymentPct: 10,
  mortgageRatePct: 6.5,
  mortgageTermYears: 30,
  yearsInProperty: 7,
  monthlyRent: 1900,
  propertyTaxPct: 1.1,
  insurancePct: 0.4,
  maintenancePct: 1,
  buyingClosingCostPct: 3,
  sellingCostPct: 6,
  annualAppreciationPct: 3,
  annualRentGrowthPct: 3,
  opportunityCostRatePct: 6,
};

describe("simulateBuyVsRent", () => {
  it("produces a positive down payment and monthly payment", () => {
    const result = simulateBuyVsRent(baseInputs);
    expect(result.downPayment).toBeCloseTo(38000);
    expect(result.monthlyPayment).toBeGreaterThan(0);
  });

  it("produces one snapshot per year in the horizon", () => {
    const result = simulateBuyVsRent(baseInputs);
    expect(result.yearlySnapshots).toHaveLength(baseInputs.yearsInProperty);
  });

  it("home equity grows when appreciation outpaces the remaining loan balance decline", () => {
    const result = simulateBuyVsRent(baseInputs);
    expect(result.homeValueAtEnd).toBeGreaterThan(baseInputs.homePrice);
    expect(result.equityAtEnd).toBeGreaterThan(0);
  });

  it("a much higher rent makes renting look more expensive than a cheaper rent scenario", () => {
    const cheapRent = simulateBuyVsRent({ ...baseInputs, monthlyRent: 900 });
    const expensiveRent = simulateBuyVsRent({ ...baseInputs, monthlyRent: 3000 });
    expect(expensiveRent.totalCostRenting).toBeGreaterThan(cheapRent.totalCostRenting);
  });

  it("a much higher home price makes buying look more expensive", () => {
    const cheapHome = simulateBuyVsRent({ ...baseInputs, homePrice: 200000 });
    const expensiveHome = simulateBuyVsRent({ ...baseInputs, homePrice: 900000 });
    expect(expensiveHome.totalCostBuying).toBeGreaterThan(cheapHome.totalCostBuying);
  });
});
