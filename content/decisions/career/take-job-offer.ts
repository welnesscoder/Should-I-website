import type { WeightedDecisionConfig } from "@/lib/engines/types";
import { effectiveHourlyCompensation, percentDifferenceToScale } from "@/lib/calculations/compensation";

function hourlyRates(values: Record<string, number>) {
  const currentRate = effectiveHourlyCompensation({
    annualCompensation: values.currentAnnualComp,
    weeklyHours: values.currentWeeklyHours,
    weeklyCommuteHours: (values.currentCommuteMinutesPerDay * 5) / 60,
  });
  const newRate = effectiveHourlyCompensation({
    annualCompensation: values.newAnnualComp,
    weeklyHours: values.newWeeklyHours,
    weeklyCommuteHours: (values.newCommuteMinutesPerDay * 5) / 60,
  });
  return { currentRate, newRate };
}

const decision: WeightedDecisionConfig = {
  id: "take-job-offer",
  slug: "should-i-take-this-job-offer",
  category: "career",
  engine: "weighted",
  title: "Should I take this job offer?",
  teaser: "Pay, growth, culture, and fit — all in one place.",
  seo: {
    description:
      "Compare your current job to a new offer on effective hourly pay, career growth, work-life balance, commute, and culture — weighted by what matters most to you.",
    keywords: ["should I take this job offer", "compare job offers", "should I accept a new job"],
  },
  howItWorks:
    "Effective hourly compensation is calculated from salary, hours, and commute time for both jobs. That combines with your ratings of growth, work-life balance, commute quality, and culture — each weighted by how much it matters to you — into one score.",
  factors: [
    {
      id: "compensation",
      type: "computed",
      shortLabel: "Compensation",
      label: "How does the pay compare, hour for hour?",
      inputs: [
        { id: "currentAnnualComp", label: "Current total annual compensation", unit: "$", default: 90000, step: 1000 },
        { id: "currentWeeklyHours", label: "Current hours worked per week", default: 40, step: 1 },
        { id: "currentCommuteMinutesPerDay", label: "Current commute, minutes each way", default: 20, step: 5 },
        { id: "newAnnualComp", label: "New offer's total annual compensation", unit: "$", default: 100000, step: 1000 },
        { id: "newWeeklyHours", label: "Expected hours worked per week", default: 40, step: 1 },
        { id: "newCommuteMinutesPerDay", label: "New commute, minutes each way", default: 20, step: 5 },
      ],
      compute: (values) => {
        const { currentRate, newRate } = hourlyRates(values);
        return percentDifferenceToScale(currentRate, newRate);
      },
      insight: (values) => {
        const { currentRate, newRate } = hourlyRates(values);
        return {
          label: "Effective hourly pay",
          value: `$${currentRate.toFixed(0)}/hr → $${newRate.toFixed(0)}/hr`,
        };
      },
    },
    {
      id: "careerGrowth",
      type: "subjective",
      shortLabel: "Career growth",
      label: "How does the growth and learning potential compare?",
      scaleLabels: ["Much worse", "Worse", "About the same", "Better", "Much better"],
    },
    {
      id: "workLifeBalance",
      type: "subjective",
      shortLabel: "Work-life balance",
      label: "How does the day-to-day workload and flexibility compare?",
      scaleLabels: ["Much worse", "Worse", "About the same", "Better", "Much better"],
    },
    {
      id: "commute",
      type: "subjective",
      shortLabel: "Commute",
      label: "How does the commute and remote flexibility compare, quality of life wise?",
      scaleLabels: ["Much worse", "Worse", "About the same", "Better", "Much better"],
    },
    {
      id: "culture",
      type: "subjective",
      shortLabel: "Culture",
      label: "What's your gut on the team and culture compared to now?",
      scaleLabels: ["Much worse", "Worse", "About the same", "Better", "Much better"],
    },
  ],
};

export default decision;
