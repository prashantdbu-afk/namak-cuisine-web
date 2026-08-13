import { describe, expect, it } from "vitest";
import { getOpenStatus, isWithinPeriods } from ".";
describe("Dallas opening hours", () => {
  it("opens during regular service", () =>
    expect(isWithinPeriods(12 * 60, [{ open: "11:00", close: "22:00" }])).toBe(
      true,
    ));
  it("closes at the exact closing minute", () =>
    expect(isWithinPeriods(22 * 60, [{ open: "11:00", close: "22:00" }])).toBe(
      false,
    ));
  it("supports midnight closing", () => {
    expect(
      isWithinPeriods(23 * 60 + 59, [{ open: "11:00", close: "24:00" }]),
    ).toBe(true);
    expect(isWithinPeriods(0, [{ open: "11:00", close: "24:00" }])).toBe(false);
  });
  it("honors a closed special-hours override", () => {
    const date = new Date("2026-08-08T18:00:00-05:00");
    expect(
      getOpenStatus(date, [{ date: "2026-08-08", periods: null }]).isOpen,
    ).toBe(false);
  });
  it("changes day after Dallas midnight", () => {
    expect(getOpenStatus(new Date("2026-08-09T05:01:00Z")).day).toBe("Sunday");
  });
});
