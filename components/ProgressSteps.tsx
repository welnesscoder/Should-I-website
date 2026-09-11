export default function ProgressSteps({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-wide text-slate">
          Step {current} of {total}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full bg-rule/40 overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
