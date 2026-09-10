import moveToNewCity from "./move-to-new-city";
import getAPet from "./get-a-pet";
import goBackToSchool from "./go-back-to-school";
import moveInWithPartner from "./move-in-with-partner";
import takeThatTripNow from "./take-that-trip-now";
import type { DecisionConfig } from "@/lib/engines/types";

const LIFE_DECISIONS: DecisionConfig[] = [
  moveToNewCity,
  getAPet,
  goBackToSchool,
  moveInWithPartner,
  takeThatTripNow,
];

export default LIFE_DECISIONS;
