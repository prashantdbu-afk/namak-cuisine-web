import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync("src/app/layout.tsx", "utf8");
const eventSource = readFileSync("src/lib/analytics/events.ts", "utf8");
const trackerSource = readFileSync(
  "src/components/analytics/AnalyticsEvents.tsx",
  "utf8",
);

describe("root analytics integration", () => {
  it("loads the official component through centralized environment config", () => {
    expect(layoutSource).toContain(
      'import { GoogleAnalytics } from "@next/third-parties/google"',
    );
    expect(layoutSource).toContain("getAnalyticsConfig()");
    expect(layoutSource).toContain("analytics.enabled");
    expect(layoutSource).toContain("gaId={analytics.measurementId}");
    expect(layoutSource).not.toContain("G-YYFJJQGY6T");
  });

  it("does not implement duplicate manual pageview events", () => {
    expect(eventSource).not.toContain('sendGAEvent("event", "page_view"');
    expect(trackerSource).toContain('firstParty("page_view")');
    expect(layoutSource.match(/<GoogleAnalytics/g)).toHaveLength(1);
  });
});
