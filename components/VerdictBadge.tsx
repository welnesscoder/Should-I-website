import type { Verdict } from "@/lib/engines/types";
import { VERDICT_LABEL } from "@/lib/engines/types";
import { VERDICT_STYLES } from "@/lib/verdictStyles";

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const style = VERDICT_STYLES[verdict];
  const Icon = style.Icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border-4 px-4 py-2 font-serif text-2xl sm:text-3xl font-bold ${style.textClass}`}
      style={{ borderColor: "currentColor", transform: "rotate(-3deg)" }}
    >
      <Icon aria-hidden="true" size={26} />
      <span>{VERDICT_LABEL[verdict].toUpperCase()}</span>
    </div>
  );
}
