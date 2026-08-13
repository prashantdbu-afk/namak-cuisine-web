import assert from "node:assert/strict";
import test from "node:test";

import {
  buildReportData,
  calculateMetrics,
  getRecommendations,
  getReportPeriod,
  readAnalyticsData,
} from "./analytics-growth-report.mjs";

const event = (
  event_name,
  visitor_id,
  session_id,
  source_page,
  occurred_at,
) => ({
  event_name,
  visitor_id,
  session_id,
  source_page,
  occurred_at,
  cta_location: null,
});

test("calculates owner metrics and deduplicates high-intent visitors", () => {
  const events = [
    event("page_view", "v1", "s1", "/menu", "2026-08-13T10:00:00Z"),
    event("view_menu", "v1", "s1", "/menu", "2026-08-13T10:00:01Z"),
    event("click_call", "v1", "s1", "/menu", "2026-08-13T10:00:02Z"),
    event("click_directions", "v1", "s1", "/visit", "2026-08-13T10:00:03Z"),
    event("view_bar", "v2", "s2", "/bar", "2026-08-13T11:00:00Z"),
    event("view_catering", "v2", "s3", "/catering", "2026-08-13T12:00:00Z"),
  ];
  const metrics = calculateMetrics(events, new Set(["v2"]));
  assert.equal(metrics.uniqueVisitors, 2);
  assert.equal(metrics.sessions, 3);
  assert.equal(metrics.pageViews, 1);
  assert.equal(metrics.callClicks, 1);
  assert.equal(metrics.directionsClicks, 1);
  assert.equal(metrics.highIntentVisitors, 1);
  assert.equal(metrics.highIntentRate, 50);
  assert.equal(metrics.menuViewers, 1);
  assert.equal(metrics.barViewers, 1);
  assert.equal(metrics.cateringViewers, 1);
  assert.equal(metrics.returningVisitorPercentage, 50);
});

test("uses rolling daily, weekly, and monthly boundaries", () => {
  const now = new Date("2026-08-13T18:00:00Z");
  assert.equal(
    getReportPeriod("daily", now).start.toISOString(),
    "2026-08-12T18:00:00.000Z",
  );
  assert.equal(
    getReportPeriod("weekly", now).start.toISOString(),
    "2026-08-06T18:00:00.000Z",
  );
  assert.equal(
    getReportPeriod("monthly", now).start.toISOString(),
    "2026-07-14T18:00:00.000Z",
  );
});

test("handles empty data and insufficient comparison data", () => {
  const report = buildReportData(
    "weekly",
    [],
    new Set(),
    new Date("2026-08-13T18:00:00Z"),
  );
  assert.equal(report.status, "empty");
  assert.deepEqual(report.recommendations, ["Not enough data yet"]);
});

test("recommendations are deterministic", () => {
  const previous = {
    uniqueVisitors: 100,
    menuViewers: 40,
    cateringViewers: 10,
    callClicks: 5,
    highIntentRate: 10,
  };
  const current = {
    uniqueVisitors: 100,
    menuViewers: 50,
    cateringViewers: 12,
    callClicks: 5,
    highIntentRate: 9,
    barViewers: 0,
    days: [],
  };
  assert.match(getRecommendations(current, previous)[0], /Get Directions/);
});

test("database reader issues SELECT-only queries and propagates failure without secrets", async () => {
  const queries = [];
  const sql = (strings) => {
    queries.push(strings.join("?"));
    return Promise.resolve([]);
  };
  await readAnalyticsData(
    sql,
    getReportPeriod("daily", new Date("2026-08-13T18:00:00Z")),
  );
  assert.equal(queries.length, 2);
  assert.ok(queries.every((query) => /^\s*SELECT/i.test(query)));
  assert.ok(
    queries.every(
      (query) => !/INSERT|UPDATE|DELETE|ALTER|CREATE|DROP/i.test(query),
    ),
  );

  const secret = "postgres://secret-value";
  await assert.rejects(
    readAnalyticsData(
      () => Promise.reject(new Error(secret)),
      getReportPeriod("daily"),
    ),
    (error) => !String(error).includes(secret),
  );
});
