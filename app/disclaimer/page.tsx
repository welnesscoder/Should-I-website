import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Should I? is for clarity and fun, not professional advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">Disclaimer</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          Should I? provides general, educational estimates to help you think through everyday decisions. It is
          not professional financial, legal, medical, or psychological advice, and nothing on this site should be
          treated as a personal recommendation.
        </p>
        <p>
          Calculators involving money — buying a home, paying off debt versus investing, comparing a job offer —
          rely on assumptions you enter and reasonable defaults. Real interest rates, market returns, and home
          prices do not move in a straight line, and outcomes can differ significantly from these estimates.
          For any decision with real financial, legal, or health consequences, consult a qualified professional.
        </p>
        <p>
          Should I? is not designed or intended for decisions involving self-harm, medical emergencies, or other
          high-stakes or dangerous situations. If you are in crisis or need immediate help, please contact
          emergency services or a crisis line in your area.
        </p>
        <p className="text-sm border-l-2 border-rule pl-3">
          This page is a placeholder and should be reviewed by qualified legal counsel before launch.
        </p>
      </div>
    </div>
  );
}
