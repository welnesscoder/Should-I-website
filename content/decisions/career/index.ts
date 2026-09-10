import takeJobOffer from "./take-job-offer";
import askForARaise from "./ask-for-a-raise";
import quitWithoutAJob from "./quit-without-a-job";
import goFreelance from "./go-freelance";
import acceptThePromotion from "./accept-the-promotion";
import type { DecisionConfig } from "@/lib/engines/types";

const CAREER_DECISIONS: DecisionConfig[] = [
  takeJobOffer,
  askForARaise,
  quitWithoutAJob,
  goFreelance,
  acceptThePromotion,
];

export default CAREER_DECISIONS;
