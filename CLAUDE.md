@AGENTS.md

# Should I? — V2 Project Brief (for Claude Code)

This file is the handoff context for building the real, production version of
"Should I?" out of a working prototype. Read this fully before writing code.

## 0. Where things stand

The prototype lived at `should_i.jsx` (a single-file React component demoing
the concept: 5 categories, 3 decision engines, 25 decisions, ticket/stamp
visual language, and community voting via a non-production `window.storage`
API). It is not part of this repo — treat its content and design language as
reference only. The app below is the real, from-scratch build.

## 1. Product

**Should I?** — life is full of questionable decisions. Users pick a
decision, answer a few honest questions, get a clear 0–100 verdict with a
plain-language explanation, see what the community voted, and can share the
result. Balance useful/search-intent decisions (Money, Career) with
fun/shareable ones (Fun, Quick) — don't let it drift into a generic
calculator directory.

Core loop: **Decide → Result → Vote → Share → Discover → Decide again.**

Brand voice: smart, concise, slightly witty, non-judgmental, human. No
financial-guru language, no lecturing, no fake certainty, no generic AI
phrasing, minimal emoji.

## 2. Categories (preserve exactly)

Money, Life, Career, Fun, Quick — each needs a real landing page at
`/[category]`.

## 3. Decision manifest (preserve all 25 from the prototype)

| id | category | engine | title |
|---|---|---|---|
| buy-vs-lease-car | money | calculated | Should I buy instead of lease my next car? |
| buy-vs-rent-home | money | calculated | Should I buy a home instead of renting? |
| pay-off-debt-vs-invest | money | calculated | Should I pay off debt before investing? |
| lower-salary-for-equity | money | weighted | Should I take a lower salary for equity? |
| buy-it-on-sale | money | quick | Should I buy it because it's on sale? |
| move-to-new-city | life | weighted | Should I move to a new city? |
| get-a-pet | life | weighted | Should I get a pet? |
| go-back-to-school | life | weighted | Should I go back to school? |
| move-in-with-partner | life | weighted | Should I move in with my partner? |
| take-that-trip-now | life | quick | Should I take that trip now? |
| take-job-offer | career | weighted (hybrid) | Should I take this job offer? |
| ask-for-a-raise | career | calculated | Should I ask for a raise? |
| quit-without-a-job | career | weighted | Should I quit without another job lined up? |
| go-freelance | career | weighted | Should I go freelance? |
| accept-the-promotion | career | quick | Should I accept this promotion? |
| go-to-the-party | fun | quick | Should I go to the party tonight? |
| binge-the-season | fun | quick | Should I binge the whole season tonight? |
| buy-concert-tickets | fun | calculated | Should I buy tickets to this concert? |
| get-a-tattoo | fun | weighted | Should I get this tattoo? |
| try-new-hobby | fun | quick | Should I try this new hobby? |
| hit-snooze | quick | quick | Should I hit snooze? |
| order-food-instead | quick | quick | Should I order food instead of cooking? |
| text-them-first | quick | quick | Should I text them first? |
| skip-the-gym | quick | quick | Should I skip the gym today? |
| say-yes-to-invite | quick | quick | Should I say yes to this invite? |

**Plus one new decision, the general-purchase flagship:**
`should-i-buy-it` (money, calculated) — the deep version from Section 6 of
the original brief (income, expenses, savings, uses/month, ownership
duration, need-vs-want, how-long-wanted). `buy-it-on-sale` stays as a
separate fast/quick check for the narrower "it's discounted right now"
moment — both coexist by design; they serve different moments.

**Three flagships, polished first:** `should-i-buy-it`, `take-job-offer`,
`text-them-first`.

## 4. Shared result contract

```ts
type Verdict = "YES" | "PROBABLY_YES" | "MAYBE" | "PROBABLY_NO" | "NO";
// score bands: 0–19 NO · 20–39 PROBABLY_NO · 40–60 MAYBE · 61–80 PROBABLY_YES · 81–100 YES

interface ResultFactor { label: string; score: number; weight?: "low" | "medium" | "high"; }
interface Insight { label: string; value: string; }

interface DecisionResult {
  score: number;              // 0–100
  verdict: Verdict;
  headline: string;
  explanation: string;
  breakdown: ResultFactor[];
  biggestReasonYes?: string;
  biggestReasonHesitate?: string;
  insights?: Insight[];       // "14.6 hours of work", "$0.72/use"
  warnings?: string[];
}
```

All three engines must emit this shape. Never invent a per-decision result
type.

### Engine scoring approach
- **Quick**: 3–5 yes/no questions, baseline 50, each yes/no shifts the score
  (~±18), clamp 0–100, map to verdict band. 5-band verdict copy per decision.
- **Weighted**: factor UI is semantic ("Much worse → Much better", 5-point)
  × importance ("Low/Medium/High" → ×0.5/1/1.5), summed and normalized to
  0–100. Hybrid decisions (`take-job-offer`) allow a factor to be
  `{ type: "computed", computeFn }` instead of `{ type: "subjective" }` —
  e.g. effective hourly compensation feeds in as a factor alongside
  culture/growth sliders, both contributing to the same normalized sum.
  No 4th engine type.
- **Calculated**: bespoke per decision, decomposed into 2–4 named,
  independently-scored components, combined into the overall score.
  Reusable math lives in `/lib/calculations`, not inside components. Unit
  tests required.

### `should-i-buy-it` scoring sketch
```
disposableIncome   = takeHome − essentialExpenses
purchaseBurdenPct  = price / disposableIncome × 100
costPerUse         = price / (usesPerMonth × ownershipMonths)
workHours          = price / effectiveHourlyRate

affordabilityScore = clamp(100 − purchaseBurdenPct × k, 0, 100)   // bonus if savings ≫ price
usageScore         = f(usesPerMonth, ownershipMonths, costPerUse)
impulseRisk        = f(alreadyOwnsAlternative, howLongWanted, needVsWant)  // 0–100, higher = worse

score = 0.4×affordability + 0.4×usage + 0.2×(100 − impulseRisk)
```
`buy-vs-rent-home` and `pay-off-debt-vs-invest` get equivalent component
decomposition — proper mortgage amortization for the former (not
interest-only), guaranteed-vs-expected framing for the latter.

## 5. Resolved flags from spec review

1. **Money-category verdicts risk reading as financial advice.** Keep the
   score, but for home-purchase and debt-vs-invest specifically, the
   headline copy stays visibly hedged ("under these assumptions...") and
   never phrases as a personal recommendation. This shows up in the actual
   copy, not just a disclaimer footer.
2. **Do not persist raw financial inputs** (income, savings, price) in any
   analytics/`decision_runs` table. Log score, verdict, engine, decision id,
   timestamp only.
3. Anonymous vote dedup (cookie/session fingerprint + DB `UNIQUE`
   constraint) is intentionally soft — no anti-fraud beyond that for V2.
4. OG images use `next/og` (`ImageResponse` from a route handler), which
   works on Vercel and other Node/Edge-capable hosts — not locked to Vercel.
5. Decisions stay as **code config files** (25–60 scale), not DB rows. Only
   migrate to DB-backed config if/when actually scaling toward "hundreds".
6. `should-i-buy-it` and `buy-it-on-sale` coexist (see Section 3).

## 6. Database schema (Supabase / Postgres)

```sql
decisions (
  id uuid pk, slug text unique, category text, title text, teaser text,
  engine_type text, risk_level text default 'standard',
  is_published boolean default true, seo jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

votes (
  id uuid pk, decision_id uuid references decisions,
  choice text check (choice in ('yes','no')),
  voter_fingerprint text,  -- hashed, not raw IP
  created_at timestamptz default now(),
  unique (decision_id, voter_fingerprint)
);

decision_runs (   -- analytics only, no raw financial inputs
  id uuid pk, decision_id uuid references decisions,
  session_id text, score int, verdict text,
  created_at timestamptz default now()
);

daily_questions (
  id uuid pk, question_text text, date date unique,
  created_at timestamptz default now()
);

daily_question_votes (
  id uuid pk, daily_question_id uuid references daily_questions,
  choice text, voter_fingerprint text,
  created_at timestamptz default now(),
  unique (daily_question_id, voter_fingerprint)
);
```

- Votes are written through a Postgres RPC (`cast_vote(decision_id, choice,
  fingerprint)`) called from a Next.js Route Handler using the **service
  role key**, never the anon key directly from the client. Atomic
  insert-and-return-counts avoids race conditions.
- Trending = query `votes` filtered to last 24–48h, grouped by
  `decision_id`, ordered by count. No materialized view needed yet.
- Question of the Day = row where `date = today`. No cron needed — insert
  future rows ahead of time.
- When Supabase env vars are absent (local dev/build without credentials),
  data-access functions degrade gracefully (empty/zero states) rather than
  throwing, so `next build` and local dev still work.

## 7. Folder structure (Next.js App Router)

```
/app
  page.tsx                          — home
  [category]/page.tsx               — category landing
  [category]/[slug]/page.tsx        — decision page
  [category]/[slug]/opengraph-image.tsx
  trending/page.tsx
  question-of-the-day/page.tsx
  about, contact, privacy, terms, methodology, disclaimer — static pages
  api/vote/route.ts
  api/daily-question-vote/route.ts
  sitemap.ts  robots.ts

/components
  Header.tsx  CategoryCard.tsx  TicketRow.tsx
  EngineRunner.tsx  QuickEngine.tsx  WeightedEngine.tsx  CalculatedEngine.tsx
  ResultCard.tsx  ScoreDial.tsx  BreakdownList.tsx  ShareCard.tsx
  CommunityVote.tsx  RelatedDecisions.tsx  ProgressSteps.tsx

/lib
  engines/{types.ts, quick.ts, weighted.ts, calculated.ts, normalize.ts}
  calculations/{mortgage.ts, affordability.ts, debtVsInvest.ts, compensation.ts}
  calculations/__tests__/*.test.ts
  supabase/{client.ts, server.ts, queries.ts}
  analytics/events.ts

/content/decisions/{money,life,career,fun,quick}/*.ts   — one config file per decision
```

## 8. Design system

- Fonts: **Bitter** (serif, headlines/verdicts) + **IBM Plex Sans** (UI/body)
  + IBM Plex Mono (small data labels only, used sparingly).
- Palette: paper `#EDEFEA`, ink `#1B1D1F`, slate `#6B7280`, yes `#2F6F4E`,
  no `#A13D2C`, tie/gold `#B9922F`, rule `#C9CCC3`.
- Visual system: "ticket/verdict-stamp" — dashed ticket edges, a rotated
  stamp-style box for the verdict, restrained motion (one pop animation on
  reveal, nothing else animates on scroll). No SaaS card shadows, no
  gradients, no ALL-CAPS eyebrows.

## 9. Explicitly out of scope for V2

Paid membership, mobile app, DMs, followers, profiles, large commenting
system, crypto, AI chatbot, mass auto-generated pages, DB-backed decision
config, real-time trending infrastructure.

## 10. Success criteria

A first-time mobile visitor should understand the product in 5 seconds,
start a decision in 10, finish a Quick decision in ~15, get a visually
satisfying and legible result, vote without an account, see real community
numbers, share the result, and land on another relevant decision — without
needing more features than that.
