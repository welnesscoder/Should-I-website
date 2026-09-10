import Link from "next/link";
import { getDailyQuestion, getDailyQuestionVoteCounts, getPreviousDailyQuestion } from "@/lib/supabase/queries";
import DailyQuestionVote from "./DailyQuestionVote";

export default async function QuestionOfTheDay() {
  const today = await getDailyQuestion();
  if (!today) return null;

  const [counts, previous] = await Promise.all([getDailyQuestionVoteCounts(today.id), getPreviousDailyQuestion()]);
  const previousCounts = previous ? await getDailyQuestionVoteCounts(previous.id) : null;
  const previousTotal = previousCounts ? previousCounts.yes + previousCounts.no : 0;
  const previousYesPct = previousTotal ? Math.round((previousCounts!.yes / previousTotal) * 100) : null;

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <div className="rounded-lg border dashed-edge p-5 bg-white/40">
        <h2 className="font-mono text-xs uppercase tracking-wide text-slate mb-2">Question of the day</h2>
        <p className="font-serif text-xl font-semibold mb-4 text-balance">{today.questionText}</p>
        <DailyQuestionVote dailyQuestionId={today.id} initialCounts={counts} />
        {previous && previousYesPct !== null && (
          <p className="text-xs text-slate mt-4 border-t border-rule pt-3">
            Yesterday: <span className="italic">&ldquo;{previous.questionText}&rdquo;</span> — {previousYesPct}% yes
          </p>
        )}
      </div>
      <p className="text-xs text-slate mt-2">
        <Link href="/question-of-the-day" className="underline hover:text-ink">
          See the full history
        </Link>
      </p>
    </section>
  );
}
