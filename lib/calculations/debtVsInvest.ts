import { clamp } from "@/lib/engines/normalize";

export interface DebtVsInvestInputs {
  debtRatePct: number;
  debtBalance: number;
  expectedReturnPct: number;
  investmentTimeHorizonYears: number;
  availableCash: number;
  hasEmergencyFund: boolean;
}

export interface DebtVsInvestResult {
  guaranteedReturnPct: number; // avoided interest, risk-free
  riskAdjustedExpectedReturnPct: number; // haircut applied to reflect market uncertainty
  score: number; // 0-100, higher favors investing, lower favors paying off debt
  emergencyFundWarning: boolean;
  guaranteedDollarsPerYear: number;
  expectedDollarsPerYear: number;
}

/** Applies a haircut to the expected return to reflect that it is not guaranteed, unlike interest avoided by paying down debt. */
const RISK_HAIRCUT = 0.7;

export function compareDebtVsInvest({
  debtRatePct,
  debtBalance,
  expectedReturnPct,
  availableCash,
  hasEmergencyFund,
}: DebtVsInvestInputs): DebtVsInvestResult {
  const riskAdjustedExpectedReturnPct = expectedReturnPct * RISK_HAIRCUT;
  const gap = riskAdjustedExpectedReturnPct - debtRatePct;

  let score = clamp(50 + gap * 2.5);
  let emergencyFundWarning = false;

  if (!hasEmergencyFund) {
    // Without a cash cushion, an uncertain investment return is a much bigger risk than usual.
    score = Math.min(score, 35);
    emergencyFundWarning = true;
  }

  return {
    guaranteedReturnPct: debtRatePct,
    riskAdjustedExpectedReturnPct,
    score,
    emergencyFundWarning,
    guaranteedDollarsPerYear: (Math.min(debtBalance, availableCash) * debtRatePct) / 100,
    expectedDollarsPerYear: (availableCash * expectedReturnPct) / 100,
  };
}
