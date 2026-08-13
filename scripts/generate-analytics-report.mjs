import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const cadence = process.argv[2] ?? "weekly";
const inputPath = process.env.ANALYTICS_REPORT_INPUT;
const outputDirectory = path.resolve("artifacts", `${cadence}-growth-report`);
await mkdir(outputDirectory, { recursive: true });

const empty = {
  status: "not_enough_data",
  generatedAt: new Date().toISOString(),
  cadence,
  note: "Not enough data yet. Configure the GA4 reporting export described in docs/analytics-reports-guide.md.",
  metrics: {},
};

let reportData = empty;
if (inputPath) {
  try {
    reportData = JSON.parse(await readFile(inputPath, "utf8"));
  } catch (error) {
    reportData = { ...empty, inputError: String(error) };
  }
}

const title =
  cadence === "monthly"
    ? "Namak Growth & Presence Review"
    : cadence === "daily"
      ? "Namak Daily Growth Snapshot"
      : "Namak Restaurant Growth Report";
const markdown = `# ${title}\n\nGenerated ${reportData.generatedAt ?? new Date().toISOString()}\n\n## ${cadence === "weekly" ? "This Week at Namak" : "Status"}\n\n${reportData.note ?? "Measured analytics are attached in the CSV and JSON files."}\n\n## Overall Growth Signal\n\n🟡 Stable / Watch\n\nNot enough comparable measured data is available yet. No customer counts, visits, rankings, revenue, or campaign outcomes have been inferred.\n\n## Restaurant Visit Intent\n\nThese metrics indicate interest in visiting Namak; they do not confirm actual restaurant visits.\n\n## What I Would Do This Week\n\n- Keep collecting measured data until a reliable comparison is available.\n\n## What to Watch\n\n- Directions clicks\n- Call clicks\n- People who looked at the Menu\n- Returning visitors\n`;

const metricEntries = Object.entries(reportData.metrics ?? {});
const csv = [
  "metric,value",
  ...metricEntries.map(([key, value]) => `${key},${JSON.stringify(value)}`),
].join("\n");
await Promise.all([
  writeFile(path.join(outputDirectory, "report.md"), markdown),
  writeFile(
    path.join(outputDirectory, "report.json"),
    JSON.stringify(reportData, null, 2),
  ),
  writeFile(path.join(outputDirectory, "metrics.csv"), `${csv}\n`),
]);
