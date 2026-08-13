import { describe, expect, it } from "vitest";
import {
  emptyWeeklyMetrics,
  getOverallGrowthSignal,
  getRecommendations,
  renderWeeklyGrowthReport,
} from "./reporting";

describe("restaurant growth reporting", () => {
  it("uses documented signal thresholds", () => {
    const previous = {
      ...emptyWeeklyMetrics(),
      uniqueVisitors: 100,
      highIntentVisitors: 20,
    };
    const current = {
      ...previous,
      uniqueVisitors: 118,
      highIntentVisitors: 25,
    };
    expect(getOverallGrowthSignal(current, previous)).toBe("🟢 Strong");
  });

  it("creates deterministic recommendations without claiming restaurant visits", () => {
    const previous = {
      ...emptyWeeklyMetrics(),
      uniqueVisitors: 100,
      menuViewers: 40,
      directionsClickers: 10,
    };
    const current = { ...previous, menuViewers: 50, directionsClickers: 9 };
    expect(getRecommendations(current, previous)[0]?.action).toContain(
      "Get Directions",
    );
    const report = renderWeeklyGrowthReport({
      periodLabel: "Test week",
      current,
      previous,
    });
    expect(report).toContain("do not confirm actual restaurant visits");
    expect(report).not.toContain("actual visits: 9");
  });

  it("states when there is not enough data", () => {
    const empty = emptyWeeklyMetrics();
    expect(
      renderWeeklyGrowthReport({
        periodLabel: "First week",
        current: empty,
        previous: empty,
      }),
    ).toContain("Not enough data yet");
  });
});
