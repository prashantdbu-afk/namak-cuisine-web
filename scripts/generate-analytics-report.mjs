import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

import {
  buildReportData,
  getReportPeriod,
  readAnalyticsData,
  renderMarkdown,
  renderMetricsCsv,
} from "./lib/analytics-growth-report.mjs";

const cadence = process.argv[2] ?? "weekly";
if (!new Set(["daily", "weekly", "monthly"]).has(cadence)) {
  throw new Error("Report cadence must be daily, weekly, or monthly.");
}

const inputPath = process.env.ANALYTICS_REPORT_INPUT;
const databaseUrl = process.env.ANALYTICS_REPORT_DATABASE_URL;
const outputDirectory = path.resolve("artifacts", `${cadence}-growth-report`);
await mkdir(outputDirectory, { recursive: true });

let events;
let priorVisitorIds;
if (inputPath) {
  const fixture = JSON.parse(await readFile(inputPath, "utf8"));
  events = fixture.events ?? [];
  priorVisitorIds = new Set(fixture.priorVisitorIds ?? []);
} else {
  if (!databaseUrl) {
    throw new Error(
      "The analytics database could not be read: ANALYTICS_REPORT_DATABASE_URL is not configured.",
    );
  }
  const sql = postgres(databaseUrl, {
    max: 1,
    connect_timeout: 15,
    idle_timeout: 5,
    prepare: false,
  });
  try {
    const result = await readAnalyticsData(sql, getReportPeriod(cadence));
    events = result.rows;
    priorVisitorIds = result.priorVisitorIds;
  } catch {
    throw new Error("The analytics database could not be read.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const reportData = buildReportData(cadence, events, priorVisitorIds);
await Promise.all([
  writeFile(
    path.join(outputDirectory, "report.md"),
    renderMarkdown(reportData),
  ),
  writeFile(
    path.join(outputDirectory, "report.json"),
    JSON.stringify(reportData, null, 2),
  ),
  writeFile(
    path.join(outputDirectory, "metrics.csv"),
    renderMetricsCsv(reportData),
  ),
]);
