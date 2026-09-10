import hitSnooze from "./hit-snooze";
import orderFoodInstead from "./order-food-instead";
import textThemFirst from "./text-them-first";
import skipTheGym from "./skip-the-gym";
import sayYesToInvite from "./say-yes-to-invite";
import type { DecisionConfig } from "@/lib/engines/types";

const QUICK_DECISIONS: DecisionConfig[] = [
  textThemFirst,
  hitSnooze,
  orderFoodInstead,
  skipTheGym,
  sayYesToInvite,
];

export default QUICK_DECISIONS;
