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

Reports are designed to use Namak's owner-controlled PostgreSQL event store,
not to depend exclusively on GA4. Until the database, schema, and read-only
report export are configured, the workflow deliberately reports **Not enough
data yet** instead of inventing numbers. GA4 can remain enabled in parallel for
comparison and is independently controlled.

The reporting model supports measured inputs for visitors, sessions, page
views, returning visitors, Menu/Bar/Catering interest, Calls, Directions,
device share, traffic sources, day of week, and Dallas-local time windows.
Query strings and form/PII fields must be removed before input is supplied.

## First-party production setup

1. Provision an owner-controlled PostgreSQL database.
2. Run `data/analytics-schema.sql` against it.
3. Add `DATABASE_URL` to Vercel **Production** only. Treat it as a secret.
4. Add `NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED=true` to Vercel Production.
5. Keep it unset or `false` in Preview and Development.
6. In Neon, create a separate PostgreSQL role with `SELECT` permission only on
   `analytics_events`. It must not have `INSERT`, `UPDATE`, `DELETE`, schema
   creation, or ownership privileges.
7. Add that role's pooled connection string to GitHub Actions as repository
   secret `ANALYTICS_REPORT_DATABASE_URL`. Do not copy the website's
   write-capable `DATABASE_URL` into GitHub.
8. GitHub Actions queries Neon directly with this read-only secret. The optional
   `ANALYTICS_REPORT_INPUT` JSON fixture remains available only for local tests.

## Report periods

- Daily: rolling 24 hours ending when the report runs.
- Weekly: rolling 7 days ending when the report runs.
- Monthly: rolling 30 days ending when the report runs.
- Each report also queries the immediately preceding period of equal length for
  deterministic comparisons. Day names and restaurant-facing day groupings use
  `America/Chicago`; timestamps in JSON remain ISO 8601 UTC.

The workflow performs two parameterized, read-only queries: one `SELECT` reads
the current and preceding comparison window, and one `SELECT DISTINCT` finds
visitor IDs seen before the current window for returning-visitor percentage.
No website write-capable credential is used. Database failures stop the job
with a generic message and never print the connection string.

For a local fixture report without Neon access:

```bash
ANALYTICS_REPORT_INPUT=data/analytics-report-fixture.example.json \
  node scripts/generate-analytics-report.mjs daily
```

The browser creates a random UUID stored in first-party local storage and a
random per-tab session UUID in session storage. The endpoint accepts only the
approved event name, pathname, and general CTA location. It does not accept
names, emails, customer phone numbers, form content, fingerprints, or query
strings. The schema does not store IP addresses.

`page_view` is sent only to Namak's first-party endpoint so all public content
routes can be measured. It is not manually sent to GA4; GA4 pageviews remain
the responsibility of Enhanced Measurement.

Obvious Playwright, Lighthouse, headless-browser, and search-crawler user agents
are discarded by the endpoint. Preview and development deployments cannot
persist events because collection is production-gated. This is intentionally a
small exclusion list and is not a fingerprinting system.

## Expected event behavior

- Each meaningful route navigation sends one first-party `page_view`.
- Menu, Bar, and Catering also send one corresponding `view_*` event. This is
  intentional: one event counts the route view and the other categorizes
  restaurant interest.
- React hydration does not create duplicate events because the tracker retains
  the most recently recorded route.
- Each actual Call, Directions, Instagram, or Facebook click sends one event.
- GA4 receives no manual `page_view`; Enhanced Measurement owns GA4 pageviews.

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
