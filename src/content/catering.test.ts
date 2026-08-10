import { describe, expect, it } from "vitest";
import {
  cateringEventOptions,
  cateringMediaIds,
  cateringMenuGroups,
} from "./catering";
import { getImageRecord } from "@/media/manifest";

describe("catering content", () => {
  it("publishes all sixteen event options", () => {
    expect(cateringEventOptions).toHaveLength(16);
    expect(
      cateringEventOptions.map((option) => option.label).join(" "),
    ).toContain("Mehndi");
    expect(
      cateringEventOptions.map((option) => option.label).join(" "),
    ).toContain("Griha Pravesh");
  });

  it("uses exact food-menu data without prices or bar groups", () => {
    expect(cateringMenuGroups).not.toHaveLength(0);
    expect(
      cateringMenuGroups.every((group) => group.id.startsWith("food-")),
    ).toBe(true);
    expect(
      cateringMenuGroups
        .flatMap((group) => group.items)
        .every((item) => !("priceCents" in item)),
    ).toBe(true);
  });

  it("has exactly four approved, self-hosted stock slots", () => {
    const records = Object.values(cateringMediaIds).map(getImageRecord);
    expect(records).toHaveLength(4);
    for (const record of records) {
      expect(record.source).toMatch(/^\/media\/catering\//);
      expect(record.rightsStatus).toBe("approved");
      expect(record.productionReady).toBe(true);
      expect(record.stock?.representation).toBe("editorial-generic");
      expect(record.stock?.sourcePageUrl).toContain("pexels.com/photo/");
    }
  });
});
