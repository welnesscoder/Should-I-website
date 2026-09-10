import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Should I?",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">Terms of Service</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          By using Should I?, you agree that the site is provided for general informational and entertainment
          purposes, without warranty of any kind. Results, scores, and verdicts are estimates based on the
          information you provide and general assumptions — they are not guarantees, and Should I? is not liable
          for decisions made based on them.
        </p>
        <p>
          Community voting features are provided as-is. We may moderate, remove, or adjust decisions, questions,
          or vote data at our discretion, including to address abuse or inaccurate content.
        </p>
        <p>
          These terms may be updated from time to time; continued use of the site after a change constitutes
          acceptance of the updated terms.
        </p>
        <p className="text-sm border-l-2 border-rule pl-3">
          This page is a placeholder and should be reviewed by qualified legal counsel before launch.
        </p>
      </div>
    </div>
  );
}
