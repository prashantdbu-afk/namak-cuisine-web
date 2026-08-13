const DAY_MS = 24 * 60 * 60 * 1000;
const HIGH_INTENT_EVENTS = new Set(["click_call", "click_directions"]);
const PAGE_PATHS = [
  "/",
  "/menu",
  "/bar",
  "/catering",
  "/gallery",
  "/about",
  "/visit",
];

export function getReportPeriod(cadence, now = new Date()) {
  const durationDays = cadence === "daily" ? 1 : cadence === "monthly" ? 30 : 7;
  const end = new Date(now);
  const start = new Date(end.getTime() - durationDays * DAY_MS);
  const previousStart = new Date(start.getTime() - durationDays * DAY_MS);
  return {
    cadence,
    durationDays,
    start,
    end,
    previousStart,
    previousEnd: start,
  };
}

const unique = (values) => new Set(values).size;
const percentage = (part, whole) => (whole === 0 ? 0 : (part / whole) * 100);
const chicagoDay = (value) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

export function calculateMetrics(events, priorVisitorIds = new Set()) {
  const visitors = events.map((event) => event.visitor_id);
  const visitorIds = new Set(visitors);
  const highIntentIds = new Set(
    events
      .filter((event) => HIGH_INTENT_EVENTS.has(event.event_name))
      .map((event) => event.visitor_id),
  );
  const viewers = (eventName) =>
    unique(
      events
        .filter((event) => event.event_name === eventName)
        .map((event) => event.visitor_id),
    );
  const pageInterest = Object.fromEntries(
    PAGE_PATHS.map((page) => [
      page,
      unique(
        events
          .filter(
            (event) =>
              event.event_name === "page_view" && event.source_page === page,
          )
          .map((event) => event.visitor_id),
      ),
    ]),
  );

  const days = new Map();
  for (const event of events) {
    const day = chicagoDay(event.occurred_at);
    const entry = days.get(day) ?? {
      day,
      visitorIds: new Set(),
      highIntentActions: 0,
    };
    entry.visitorIds.add(event.visitor_id);
    if (HIGH_INTENT_EVENTS.has(event.event_name)) entry.highIntentActions += 1;
    days.set(day, entry);
  }
  const daily = [...days.values()].map((day) => ({
    day: day.day,
    visitors: day.visitorIds.size,
    highIntentActions: day.highIntentActions,
  }));
  const rankedDays = [...daily].sort(
    (a, b) =>
      b.highIntentActions - a.highIntentActions ||
      b.visitors - a.visitors ||
      a.day.localeCompare(b.day),
  );

  return {
    uniqueVisitors: visitorIds.size,
    sessions: unique(events.map((event) => event.session_id)),
    pageViews: events.filter((event) => event.event_name === "page_view")
      .length,
    menuViewers: viewers("view_menu"),
    barViewers: viewers("view_bar"),
    cateringViewers: viewers("view_catering"),
    callClicks: events.filter((event) => event.event_name === "click_call")
      .length,
    directionsClicks: events.filter(
      (event) => event.event_name === "click_directions",
    ).length,
    instagramClicks: events.filter(
      (event) => event.event_name === "click_instagram",
    ).length,
    facebookClicks: events.filter(
      (event) => event.event_name === "click_facebook",
    ).length,
    highIntentVisitors: highIntentIds.size,
    highIntentRate: percentage(highIntentIds.size, visitorIds.size),
    returningVisitorPercentage: percentage(
      [...visitorIds].filter((visitorId) => priorVisitorIds.has(visitorId))
        .length,
      visitorIds.size,
    ),
    pageInterest,
    strongestDay: rankedDays[0]?.day ?? null,
    weakestDay: rankedDays.at(-1)?.day ?? null,
    days: daily,
  };
}

const change = (current, previous) =>
  previous === 0 ? null : ((current - previous) / previous) * 100;

export function getRecommendations(current, previous) {
  if (previous.uniqueVisitors === 0) return ["Not enough data yet"];
  const recommendations = [];
  const menuChange = change(current.menuViewers, previous.menuViewers);
  const cateringChange = change(
    current.cateringViewers,
    previous.cateringViewers,
  );
  const currentIntentRate = current.highIntentRate;
  const previousIntentRate = previous.highIntentRate;
  if ((menuChange ?? 0) >= 15 && currentIntentRate <= previousIntentRate) {
    recommendations.push(
      "Menu interest increased without a corresponding lift in Call/Directions intent. Consider making Visit and Get Directions more visible near Menu content.",
    );
  }
  if (
    (cateringChange ?? 0) >= 15 &&
    current.callClicks <= previous.callClicks
  ) {
    recommendations.push(
      "Catering interest increased while Call clicks did not. Review the Catering call-to-action and event inquiry path.",
    );
  }
  const weekendBar = current.days
    .filter((day) => /Friday|Saturday/.test(day.day))
    .reduce((sum, day) => sum + day.visitors, 0);
  const allDayVisitors = current.days.reduce(
    (sum, day) => sum + day.visitors,
    0,
  );
  if (
    current.barViewers > 0 &&
    allDayVisitors > 0 &&
    weekendBar / allDayVisitors >= 0.5
  ) {
    recommendations.push(
      "Bar interest is concentrated around Friday/Saturday. Consider publishing Bar content before those periods.",
    );
  }
  return recommendations.length
    ? recommendations
    : ["No deterministic action threshold was triggered for this period."];
}

export async function readAnalyticsData(sql, period) {
  try {
    const rows = await sql`
      SELECT occurred_at, event_name, visitor_id, session_id, source_page, cta_location
      FROM analytics_events
      WHERE occurred_at >= ${period.previousStart.toISOString()}
        AND occurred_at < ${period.end.toISOString()}
      ORDER BY occurred_at ASC
    `;
    const priorRows = await sql`
      SELECT DISTINCT visitor_id
      FROM analytics_events
      WHERE occurred_at < ${period.start.toISOString()}
    `;
    return {
      rows,
      priorVisitorIds: new Set(priorRows.map((row) => row.visitor_id)),
    };
  } catch {
    throw new Error("The analytics database could not be read.");
  }
}

export function buildReportData(
  cadence,
  events,
  priorVisitorIds,
  now = new Date(),
) {
  const period = getReportPeriod(cadence, now);
  const inRange = (event, start, end) => {
    const occurredAt = new Date(event.occurred_at);
    return occurredAt >= start && occurredAt < end;
  };
  const currentEvents = events.filter((event) =>
    inRange(event, period.start, period.end),
  );
  const previousEvents = events.filter((event) =>
    inRange(event, period.previousStart, period.previousEnd),
  );
  const current = calculateMetrics(currentEvents, priorVisitorIds);
  const previous = calculateMetrics(previousEvents, new Set());
  return {
    status: currentEvents.length ? "measured" : "empty",
    generatedAt: now.toISOString(),
    cadence,
    timeZone: "America/Chicago",
    period: {
      definition: `Rolling ${period.durationDays === 1 ? "24 hours" : `${period.durationDays} days`}, ending at report generation time; restaurant-facing day labels use America/Chicago.`,
      start: period.start.toISOString(),
      end: period.end.toISOString(),
      previousStart: period.previousStart.toISOString(),
      previousEnd: period.previousEnd.toISOString(),
    },
    current,
    previous,
    recommendations: getRecommendations(current, previous),
  };
}

export function renderMarkdown(report) {
  const m = report.current;
  const pageLines = Object.entries(m.pageInterest)
    .map(([page, count]) => `- ${page}: **${count}**`)
    .join("\n");
  return `# Namak ${report.cadence[0].toUpperCase() + report.cadence.slice(1)} Growth Report

Generated ${report.generatedAt}

Period: ${report.period.definition}

## This Period at Namak

- Unique visitors: **${m.uniqueVisitors}**
- Sessions: **${m.sessions}**
- Page views: **${m.pageViews}**
- Menu viewers: **${m.menuViewers}**
- Bar viewers: **${m.barViewers}**
- Catering viewers: **${m.cateringViewers}**
- Call clicks: **${m.callClicks}**
- Directions clicks: **${m.directionsClicks}**
- Instagram clicks: **${m.instagramClicks}**
- Facebook clicks: **${m.facebookClicks}**
- High-intent visitors: **${m.highIntentVisitors}**
- High-intent rate: **${m.highIntentRate.toFixed(1)}%**
- Returning visitor percentage: **${m.returningVisitorPercentage.toFixed(1)}%**
- Strongest day: **${m.strongestDay ?? "Not enough data yet"}**
- Weakest day: **${m.weakestDay ?? "Not enough data yet"}**

High intent means a visitor clicked Call or Get Directions. It indicates visit intent and does not confirm an actual restaurant visit.

## Page Interest

${pageLines}

## Recommended Actions

${report.recommendations.map((item) => `- ${item}`).join("\n")}

Only measured first-party website events are included. Search rankings, reviews, revenue, reservations, and physical visits are unavailable unless separately connected.
`;
}

export function renderMetricsCsv(report) {
  const entries = Object.entries(report.current).filter(
    ([, value]) => typeof value === "number",
  );
  return (
    ["metric,value", ...entries.map(([key, value]) => `${key},${value}`)].join(
      "\n",
    ) + "\n"
  );
}
