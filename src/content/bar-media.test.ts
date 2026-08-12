import { describe, expect, it } from "vitest";
import { barCategoryMedia } from "./bar-media";
import { barStockCandidates, selectedBarStock } from "@/media/bar-stock";
import { barMenuItems } from "./menu";
import { imageMedia } from "@/media/manifest";

describe("licensed editorial bar media", () => {
  it("defines the hero and eleven reviewed category slots with two alternates each", () => {
    expect(selectedBarStock).toHaveLength(12);
    expect(barStockCandidates).toHaveLength(36);
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

  it("keeps selected review imagery out of the production manifest", () => {
    const records = imageMedia.filter((record) =>
      record.id.startsWith("bar-stock-"),
    );
    expect(records).toHaveLength(0);
    expect(barCategoryMedia).toHaveLength(11);
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
