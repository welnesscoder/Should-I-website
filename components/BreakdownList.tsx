import type { ResultFactor } from "@/lib/engines/types";

function barColorVar(score: number): string {
  if (score >= 61) return "var(--color-yes)";
  if (score <= 39) return "var(--color-no)";
  return "var(--color-tie)";
}

const WEIGHT_LABEL: Record<string, string> = { low: "Low priority", medium: "Medium priority", high: "High priority" };

export default function BreakdownList({ factors }: { factors: ResultFactor[] }) {
  if (!factors.length) return null;

  return (
    <ul className="flex flex-col gap-4">
      {factors.map((f, i) => (
        <li key={`${f.label}-${i}`}>
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="text-sm font-medium">{f.label}</span>
            <span className="font-mono text-sm text-slate whitespace-nowrap">
              {f.score}/100{f.weight ? ` · ${WEIGHT_LABEL[f.weight]}` : ""}
            </span>
          </div>
          <div
            className="h-2 rounded-full bg-rule/40 overflow-hidden"
            role="img"
            aria-label={`${f.label}: ${f.score} out of 100`}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(2, f.score)}%`, background: barColorVar(f.score) }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
