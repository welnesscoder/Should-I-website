import TicketRow from "./TicketRow";
import { decisionHref } from "@/content/decisions";
import { socialHref } from "@/content/social";
import { SOCIAL_TYPE_LABEL } from "@/lib/content/types";
import type { ControversialResult } from "@/lib/content/trending";

export default function ControversialRow({ entry }: { entry: ControversialResult }) {
  if (entry.kind === "should_i") {
    return <TicketRow href={decisionHref(entry.decision)} title={entry.decision.title} teaser={entry.splitLabel} />;
  }

  const { item } = entry;
  return (
    <TicketRow
      href={socialHref(item)}
      title={item.prompt || `${item.optionA.label} or ${item.optionB.label}?`}
      teaser={entry.splitLabel}
      badge={SOCIAL_TYPE_LABEL[item.type]}
    />
  );
}
