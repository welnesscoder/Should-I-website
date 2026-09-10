import buyVsLeaseCar from "./buy-vs-lease-car";
import buyVsRentHome from "./buy-vs-rent-home";
import payOffDebtVsInvest from "./pay-off-debt-vs-invest";
import lowerSalaryForEquity from "./lower-salary-for-equity";
import buyItOnSale from "./buy-it-on-sale";
import shouldIBuyIt from "./should-i-buy-it";
import type { DecisionConfig } from "@/lib/engines/types";

const MONEY_DECISIONS: DecisionConfig[] = [
  shouldIBuyIt,
  buyVsLeaseCar,
  buyVsRentHome,
  payOffDebtVsInvest,
  lowerSalaryForEquity,
  buyItOnSale,
];

export default MONEY_DECISIONS;
