import type { Metadata } from "next";
import {
  getDailyQuestion,
  getDailyQuestionHistory,
  getDailyQuestionVoteCounts,
} from "@/lib/supabase/queries";
import DailyQuestionVote from "@/components/DailyQuestionVote";

export const metadata: Metadata = {
  title: "Question of the Day",
  description: "One community poll a day, plus the archive of what people said before.",
  alternates: { canonical: "/question-of-the-day" },
};

export default async function QuestionOfTheDayPage() {
  const today = await getDailyQuestion();
  const history = await getDailyQuestionHistory(30);
  const past = history.filter((q) => !today || q.id !== today.id);
  const pastWithCounts = await Promise.all(
    past.map(async (q) => ({ question: q, counts: await getDailyQuestionVoteCounts(q.id) })),
  );

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Question of the Day</h1>
      <p className="text-slate mt-2">One quick yes-or-no poll, every day.</p>

      {today ? (
        <TodayCard dailyQuestionId={today.id} questionText={today.questionText} />
      ) : (
        <p className="text-slate mt-8">No question is scheduled for today — check back tomorrow.</p>
      )}

      {pastWithCounts.length > 0 && (
        <div className="mt-10 border-t border-rule pt-6">
          <p className="font-mono text-xs uppercase tracking-wide text-slate mb-4">Previous days</p>
          <ul className="flex flex-col gap-4">
            {pastWithCounts.map(({ question, counts }) => {
              const total = counts.yes + counts.no;
              const yesPct = total ? Math.round((counts.yes / total) * 100) : null;
              return (
                <li key={question.id} className="border-b border-rule pb-4">
                  <p className="font-medium">{question.questionText}</p>
                  <p className="text-sm text-slate mt-1">
                    {yesPct !== null ? `${yesPct}% yes · ${100 - yesPct}% no · ${total.toLocaleString()} votes` : "No votes recorded."}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

async function TodayCard({ dailyQuestionId, questionText }: { dailyQuestionId: string; questionText: string }) {
  const counts = await getDailyQuestionVoteCounts(dailyQuestionId);
  return (
    <div className="rounded-lg border dashed-edge p-5 bg-white/40 mt-8 max-w-md">
      <h2 className="font-serif text-xl font-semibold mb-4 text-balance">{questionText}</h2>
      <DailyQuestionVote dailyQuestionId={dailyQuestionId} initialCounts={counts} />
    </div>
  );
}
