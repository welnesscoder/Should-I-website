import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Should I? collects, and what it doesn't.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">Privacy Policy</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          Should I? doesn&apos;t require an account to use. Here&apos;s a plain-language summary of what the
          product collects today:
        </p>
        <ul className="list-disc list-inside flex flex-col gap-2">
          <li>
            <strong className="text-ink">Votes.</strong> When you vote yes or no on a decision or the daily
            question, we store your choice along with a hashed, anonymous identifier tied to your browser — not
            your name, email, or IP address — so we can prevent obvious repeat voting.
          </li>
          <li>
            <strong className="text-ink">Decision analytics.</strong> When you complete a decision, we log the
            decision, the resulting score and verdict, and an anonymous session id. We do not store the inputs
            you typed in — income, prices, salaries, or anything else you entered stay on your device.
          </li>
          <li>
            <strong className="text-ink">Local storage.</strong> Your browser remembers which decisions
            you&apos;ve already voted on, so the site doesn&apos;t ask twice. This stays on your device.
          </li>
        </ul>
        <p>We do not sell personal data, and we do not require sign-up to use any part of the product.</p>
        <p className="text-sm border-l-2 border-rule pl-3">
          This page is a placeholder and should be reviewed by qualified legal counsel before launch, especially
          if analytics or advertising providers are added later.
        </p>
      </div>
    </div>
  );
}
