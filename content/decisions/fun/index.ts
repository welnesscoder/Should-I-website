import goToTheParty from "./go-to-the-party";
import bingeTheSeason from "./binge-the-season";
import buyConcertTickets from "./buy-concert-tickets";
import getATattoo from "./get-a-tattoo";
import tryNewHobby from "./try-new-hobby";
import type { DecisionConfig } from "@/lib/engines/types";

const FUN_DECISIONS: DecisionConfig[] = [
  goToTheParty,
  bingeTheSeason,
  buyConcertTickets,
  getATattoo,
  tryNewHobby,
];

export default FUN_DECISIONS;
