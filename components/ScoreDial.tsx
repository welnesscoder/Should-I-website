import type { Verdict } from "@/lib/engines/types";
import { VERDICT_STYLES } from "@/lib/verdictStyles";

const SIZE = 152;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreDial({ score, verdict }: { score: number; verdict: Verdict }) {
  const style = VERDICT_STYLES[verdict];
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center stamp-pop"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} strokeWidth={STROKE} fill="none" className="stroke-rule" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ stroke: style.cssVar }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-bold leading-none">{score}</span>
        <span className="text-xs text-slate mt-1">/ 100</span>
      </div>
    </div>
  );
}
