import { describe, expect, it } from "vitest";
import { barCategoryMedia } from "./bar-media";
import { barStockCandidates, selectedBarStock } from "@/media/bar-stock";
import { barMenuItems } from "./menu";
import { imageMedia } from "@/media/manifest";

describe("licensed editorial bar media", () => {
  it("defines exactly eight reviewed slots with two alternates each", () => {
    expect(selectedBarStock).toHaveLength(8);
    expect(barStockCandidates).toHaveLength(24);
    for (const selected of selectedBarStock) {
      const slot = barStockCandidates.filter(
        (candidate) => candidate.slotId === selected.slotId,
      );
      expect(slot.map((candidate) => candidate.role).sort()).toEqual([
        "alternate-1",
        "alternate-2",
        "recommended",
      ]);
      expect(selected.provider).toBe("pexels");
      expect(selected.sourcePageUrl).toMatch(
        /^https:\/\/www\.pexels\.com\/photo\//,
      );
      expect(selected.licenseUrl).toBe("https://www.pexels.com/license/");
      expect(selected.representation).toBe("editorial-generic");
    }
  });

  it("self-hosts approved selected images without mapping them to named products", () => {
    const records = imageMedia.filter((record) =>
      record.id.startsWith("bar-stock-"),
    );
    expect(records).toHaveLength(8);
    expect(
      records.every(
        (record) =>
          record.source.startsWith("/media/bar/") &&
          record.rightsStatus === "approved" &&
          record.productionReady === false,
      ),
    ).toBe(true);
    expect(barCategoryMedia).toHaveLength(7);
    const brandedNames = barMenuItems.map((item) => item.name.toLowerCase());
    expect(
      records.some((record) =>
        brandedNames.some((name) => record.alt.toLowerCase().includes(name)),
      ),
    ).toBe(false);
    expect(JSON.stringify(barCategoryMedia)).not.toMatch(
      /Heineken|Bombay Sapphire|Tito|Patron|Bacardi|Jack Daniels/i,
    );
  });
});
