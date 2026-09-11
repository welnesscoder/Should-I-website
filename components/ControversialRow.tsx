import TicketRow from "./TicketRow";
import { decisionHref } from "@/content/decisions";
import { socialHref } from "@/content/social";
import { SOCIAL_TYPE_ACCENT, SOCIAL_TYPE_LABEL } from "@/lib/content/types";
import type { ControversialResult } from "@/lib/content/trending";

export default function ControversialRow({ entry }: { entry: ControversialResult }) {
  if (entry.kind === "should_i") {
    return (
      <TicketRow
        href={decisionHref(entry.decision)}
        title={entry.decision.title}
        teaser={entry.splitLabel}
        badge="Should I?"
        badgeClass="border-brand text-brand"
      />
    );
  }

  const { item } = entry;
  const accent = SOCIAL_TYPE_ACCENT[item.type];
  return (
    <TicketRow
      href={socialHref(item)}
      title={item.prompt || `${item.optionA.label} or ${item.optionB.label}?`}
      teaser={entry.splitLabel}
      badge={SOCIAL_TYPE_LABEL[item.type]}
      badgeClass={`${accent.border} ${accent.text}`}
    />
  );
}
