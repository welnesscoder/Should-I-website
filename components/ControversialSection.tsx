import { getUnifiedControversial } from "@/lib/content/trending";
import ControversialRow from "./ControversialRow";

export default async function ControversialSection() {
  const controversial = await getUnifiedControversial(3);
  if (controversial.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mb-3">😭 People can&apos;t agree</h2>
      <div className="flex flex-col">
        {controversial.map((entry) => (
          <ControversialRow key={entry.kind === "should_i" ? entry.decision.id : entry.item.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
