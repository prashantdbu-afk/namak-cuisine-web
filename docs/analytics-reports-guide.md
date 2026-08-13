# Namak analytics reports guide

The primary owner-facing report is the **Namak Restaurant Growth Report**.
It uses restaurant-owner language, deterministic growth rules, and clearly
labels Calls and Directions as **Restaurant Visit Intent**, not confirmed
physical visits.

## Find the weekly report

1. Open the Namak GitHub repository.
2. Select **Actions**.
3. Select **Analytics Growth Reports** (the weekly scheduled run is labeled by
   its cadence).
4. Open the latest successful run.
5. Scroll to **Artifacts**.
6. Download **namak-weekly-growth-report**.
7. Open `report.md` first. CSV and JSON files are included for technical review.

Daily and monthly artifacts are named `namak-daily-growth-report` and
`namak-monthly-growth-report`.

## Data connection required

The public GA4 Measurement ID sends website events but cannot read reports.
Reporting requires a separate GA4 Property ID and read-only access to the GA4
Data API. Until that owner-controlled access is configured, the workflow
deliberately reports **Not enough data yet** instead of inventing numbers.

The reporting model supports measured inputs for visitors, sessions, page
views, returning visitors, Menu/Bar/Catering interest, Calls, Directions,
device share, traffic sources, day of week, and Dallas-local time windows.
Query strings and form/PII fields must be removed before input is supplied.

## Reporting rules

- Strong: unique visitors and high-intent visitors both improve by at least 10%.
- Needs Attention: either measure falls by 15% or more.
- Stable / Watch: all other cases, including insufficient comparison data.
- Recommendations are created only by explicit thresholds in
  `src/lib/analytics/reporting.ts` and are limited to five.
- Suggested promotions are experiments, never automatic discount advice.

## Optional restaurant covers and goals

`data/business-daily-metrics.example.csv` provides optional owner-entered lunch
and dinner covers. `data/business-goals.example.json` provides nullable goal
fields; no fabricated target is supplied. When populated later, reports may
compare timing of website intent and covers, but must describe correlation—not
causation.

For monthly experiments, keep a dated owner log of Google Business posts,
Instagram Reels, weekday experiments, food photography, catering campaigns,
and local ads. Reports may say traffic changed after an experiment, but must not
claim the experiment caused the change.
