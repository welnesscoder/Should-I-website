import { describe, expect, it } from "vitest";
import { compareDebtVsInvest } from "../debtVsInvest";

describe("compareDebtVsInvest", () => {
  it("keeps guaranteed and expected returns clearly distinct", () => {
    const result = compareDebtVsInvest({
      debtRatePct: 19,
      debtBalance: 5000,
      expectedReturnPct: 7,
      investmentTimeHorizonYears: 10,
      availableCash: 5000,
      hasEmergencyFund: true,
    });
    expect(result.guaranteedReturnPct).toBe(19);
    expect(result.riskAdjustedExpectedReturnPct).toBeLessThan(7);
  });

  it("favors paying off debt when the debt rate is high relative to risk-adjusted expected return", () => {
    const result = compareDebtVsInvest({
      debtRatePct: 22,
      debtBalance: 8000,
      expectedReturnPct: 7,
      investmentTimeHorizonYears: 10,
      availableCash: 8000,
      hasEmergencyFund: true,
    });
    expect(result.score).toBeLessThan(50);
  });

  it("favors investing when expected return clearly beats a low debt rate", () => {
    const result = compareDebtVsInvest({
      debtRatePct: 3,
      debtBalance: 8000,
      expectedReturnPct: 8,
      investmentTimeHorizonYears: 10,
      availableCash: 8000,
      hasEmergencyFund: true,
    });
    expect(result.score).toBeGreaterThan(50);
  });

  it("caps the score and warns when there is no emergency fund", () => {
    const result = compareDebtVsInvest({
      debtRatePct: 3,
      debtBalance: 8000,
      expectedReturnPct: 10,
      investmentTimeHorizonYears: 10,
      availableCash: 8000,
      hasEmergencyFund: false,
    });
    expect(result.emergencyFundWarning).toBe(true);
    expect(result.score).toBeLessThanOrEqual(35);
  });
});
