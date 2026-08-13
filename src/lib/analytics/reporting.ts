export type GrowthSignal =
  "🟢 Strong" | "🟡 Stable / Watch" | "🔴 Needs Attention";
export type RecommendationPriority = "HIGH" | "MEDIUM" | "LOW";

export type WeeklyMetrics = {
  uniqueVisitors: number;
  sessions: number;
  pageViews: number;
  returningVisitorPercentage: number;
  menuViewers: number;
  barViewers: number;
  cateringViewers: number;
  callClickers: number;
  directionsClickers: number;
  highIntentVisitors: number;
  mobileShare: number;
  instagramVisitors: number;
};

export type Recommendation = {
  priority: RecommendationPriority;
  opportunity: string;
  action: string;
  why: string;
  measureNextWeek: string;
};

export type DayMetrics = {
  day: string;
  visitors: number;
  menuViews: number;
  highIntentActions: number;
  callClicks: number;
  directionsClicks: number;
};

export type GrowthReportInput = {
  periodLabel: string;
  current: WeeklyMetrics;
  previous: WeeklyMetrics;
  days?: DayMetrics[];
};

const percentageChange = (current: number, previous: number) =>
  previous === 0 ? null : ((current - previous) / previous) * 100;

const rate = (part: number, whole: number) =>
  whole === 0 ? 0 : (part / whole) * 100;

export function getOverallGrowthSignal(
  current: WeeklyMetrics,
  previous: WeeklyMetrics,
): GrowthSignal {
  const trafficChange = percentageChange(
    current.uniqueVisitors,
    previous.uniqueVisitors,
  );
  const intentChange = percentageChange(
    current.highIntentVisitors,
    previous.highIntentVisitors,
  );
  if (trafficChange === null || intentChange === null)
    return "🟡 Stable / Watch";
  if (trafficChange >= 10 && intentChange >= 10) return "🟢 Strong";
  if (trafficChange <= -15 || intentChange <= -15) return "🔴 Needs Attention";
  return "🟡 Stable / Watch";
}

export function getRecommendations(
  current: WeeklyMetrics,
  previous: WeeklyMetrics,
  days: DayMetrics[] = [],
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const menuChange = percentageChange(
    current.menuViewers,
    previous.menuViewers,
  );
  const directionsChange = percentageChange(
    current.directionsClickers,
    previous.directionsClickers,
  );
  if ((menuChange ?? 0) > 15 && (directionsChange ?? 0) <= 0) {
    recommendations.push({
      priority: "HIGH",
      opportunity:
        "Food interest is rising without the same lift in visit intent.",
      action:
        "Test a more visible Visit / Get Directions prompt near Menu content.",
      why: `People who looked at the Menu increased ${Math.round(menuChange ?? 0)}%, while Directions did not increase.`,
      measureNextWeek: "Menu viewers and Directions clicks.",
    });
  }

  const cateringChange = percentageChange(
    current.cateringViewers,
    previous.cateringViewers,
  );
  const cateringCallRate = rate(current.callClickers, current.cateringViewers);
  const siteIntentRate = rate(
    current.highIntentVisitors,
    current.uniqueVisitors,
  );
  if ((cateringChange ?? 0) > 15 && cateringCallRate < siteIntentRate) {
    recommendations.push({
      priority: "HIGH",
      opportunity:
        "Catering interest is rising, but call intent is comparatively weak.",
      action:
        "Review the catering phone prompt, event examples, and value proposition.",
      why: `Catering interest increased ${Math.round(cateringChange ?? 0)}%, while its call rate is below the site intent rate.`,
      measureNextWeek: "Catering viewers and Catering-to-Call rate.",
    });
  }

  if (current.mobileShare > 75) {
    recommendations.push({
      priority: "HIGH",
      opportunity: "Mobile dominates customer discovery.",
      action:
        "Prioritize mobile Call, Directions, Menu, and future reservation usability.",
      why: `${current.mobileShare.toFixed(1)}% of traffic came from mobile devices.`,
      measureNextWeek: "Mobile high-intent rate and mobile usability checks.",
    });
  }

  const instagramChange = percentageChange(
    current.instagramVisitors,
    previous.instagramVisitors,
  );
  if ((instagramChange ?? 0) > 20) {
    recommendations.push({
      priority: "MEDIUM",
      opportunity: "Instagram is becoming a stronger acquisition channel.",
      action:
        "Continue testing dish, atmosphere, and Bar content linked to the relevant page.",
      why: `Instagram visitors increased ${Math.round(instagramChange ?? 0)}%.`,
      measureNextWeek:
        "Instagram visitors, Menu views, and visit intent from Instagram.",
    });
  }

  const returningChange =
    current.returningVisitorPercentage - previous.returningVisitorPercentage;
  if (returningChange >= 5) {
    recommendations.push({
      priority: "LOW",
      opportunity: "Repeat interest is strengthening.",
      action: "Explore a future loyalty or event-notification experiment.",
      why: `Returning visitor share increased ${returningChange.toFixed(1)} percentage points.`,
      measureNextWeek: "Returning visitor percentage.",
    });
  }

  if (days.length > 0) {
    const average =
      days.reduce((sum, day) => sum + day.highIntentActions, 0) / days.length;
    const weakDay = [...days].sort(
      (a, b) => a.highIntentActions - b.highIntentActions,
    )[0];
    if (weakDay && weakDay.highIntentActions < average * 0.7) {
      recommendations.push({
        priority: "MEDIUM",
        opportunity: `${weakDay.day} visit intent is well below the weekly average.`,
        action: `Test one ${weakDay.day}-focused Google Business Profile or social post linked directly to the Menu.`,
        why: `${weakDay.day} high-intent actions are at least 30% below the daily average.`,
        measureNextWeek: `${weakDay.day} Menu views, Directions clicks, and Call clicks.`,
      });
    }
  }
  return recommendations.slice(0, 5);
}

function metricLine(label: string, current: number, previous: number) {
  const change = percentageChange(current, previous);
  if (change === null)
    return `| ${label} | ${current} | ${previous} | New | → |`;
  const arrow = change > 2 ? "↑" : change < -2 ? "↓" : "→";
  return `| ${label} | ${current} | ${previous} | ${change >= 0 ? "+" : ""}${change.toFixed(1)}% | ${arrow} |`;
}

export function renderWeeklyGrowthReport(input: GrowthReportInput) {
  const { current, previous, days = [] } = input;
  const recommendations = getRecommendations(current, previous, days);
  const strongestDay = [...days].sort(
    (a, b) => b.highIntentActions - a.highIntentActions,
  )[0];
  const weakestDay = [...days].sort(
    (a, b) => a.highIntentActions - b.highIntentActions,
  )[0];
  const intentRate = rate(current.highIntentVisitors, current.uniqueVisitors);
  const signal = getOverallGrowthSignal(current, previous);
  const signalReason =
    signal === "🟢 Strong"
      ? "Both discovery and restaurant visit intent improved meaningfully."
      : signal === "🔴 Needs Attention"
        ? "Discovery or restaurant visit intent declined enough to warrant attention."
        : "Results are broadly steady, or there is not yet enough prior-period data for a strong conclusion.";

  const recommendationMarkdown = recommendations.length
    ? recommendations
        .map(
          (item) =>
            `### ${item.priority}: ${item.opportunity}\n\n**Recommended Action:** ${item.action}\n\n**Why:** ${item.why}\n\n**Measure Next Week:** ${item.measureNextWeek}`,
        )
        .join("\n\n")
    : "Not enough data yet to produce a measured recommendation.";

  return `# Namak Restaurant Growth Report

${input.periodLabel}

## This Week at Namak

- Unique visitors: **${current.uniqueVisitors}**
- Sessions: **${current.sessions}**
- Page views: **${current.pageViews}**
- Returning visitors: **${current.returningVisitorPercentage.toFixed(1)}%**
- People who looked at the Menu: **${current.menuViewers}**
- Bar viewers: **${current.barViewers}**
- Catering viewers: **${current.cateringViewers}**
- Call clicks: **${current.callClickers}**
- Directions clicks: **${current.directionsClickers}**
- People showing intent to visit: **${current.highIntentVisitors}**
- High-intent rate: **${intentRate.toFixed(1)}%**
- Strongest day: **${strongestDay?.day ?? "Not enough data yet"}**
- Weakest day: **${weakestDay?.day ?? "Not enough data yet"}**

## Overall Growth Signal

### ${signal}

${signalReason} High-intent metrics indicate interest in visiting Namak; they do not confirm actual restaurant visits.

## Week-over-Week Scorecard

| Metric | This Week | Last Week | Change | Signal |
| --- | ---: | ---: | ---: | :---: |
${metricLine("Unique Visitors", current.uniqueVisitors, previous.uniqueVisitors)}
${metricLine("Menu Views", current.menuViewers, previous.menuViewers)}
${metricLine("Call Clicks", current.callClickers, previous.callClickers)}
${metricLine("Directions Clicks", current.directionsClickers, previous.directionsClickers)}
${metricLine("Catering Views", current.cateringViewers, previous.cateringViewers)}
${metricLine("Bar Views", current.barViewers, previous.barViewers)}

## Customer Journey

Visitors **${current.uniqueVisitors}** → People considering Menu, Bar, or Catering **${current.menuViewers + current.barViewers + current.cateringViewers}** → Restaurant Visit Intent **${current.highIntentVisitors}**

## Restaurant Visit Intent

Calls: **${current.callClickers}** · Directions: **${current.directionsClickers}** · High-intent rate: **${intentRate.toFixed(1)}%**

These metrics indicate interest in visiting Namak; they do not confirm actual restaurant visits.

## Recommended Actions

${recommendationMarkdown}

## Namak Online Presence

The report uses available first-party website data when the owner-controlled database export is connected. Google Business Profile impressions, Search Console rankings, reviews, and physical restaurant visits are **unavailable unless separately connected**.

## What I Would Do This Week

${recommendations.length ? recommendations.map((item) => `- ${item.action}`).join("\n") : "- Keep collecting data until a reliable comparison is available."}

## What to Watch

- Directions clicks
- Call clicks
- People who looked at the Menu
- Returning visitors
`;
}

export const emptyWeeklyMetrics = (): WeeklyMetrics => ({
  uniqueVisitors: 0,
  sessions: 0,
  pageViews: 0,
  returningVisitorPercentage: 0,
  menuViewers: 0,
  barViewers: 0,
  cateringViewers: 0,
  callClickers: 0,
  directionsClickers: 0,
  highIntentVisitors: 0,
  mobileShare: 0,
  instagramVisitors: 0,
});
