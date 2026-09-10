import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with Should I?",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">Contact</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          Found a broken calculator, a confusing question, or a decision you think should exist? Reach out at{" "}
          <a href="mailto:hello@should-i.app" className="text-ink underline">
            hello@should-i.app
          </a>
          .
        </p>
        <p className="text-sm border-l-2 border-rule pl-3">
          Placeholder contact address — replace with a real inbox before launch.
        </p>
      </div>
    </div>
  );
}
