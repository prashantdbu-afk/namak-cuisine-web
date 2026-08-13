import { describe, expect, it } from "vitest";
import { barCategoryMedia } from "./bar-media";
import { barStockCandidates, selectedBarStock } from "@/media/bar-stock";
import { barCategories, barMenuItems } from "./menu";
import { getImageRecord, imageMedia } from "@/media/manifest";

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

  it("keeps all approved category imagery in the production manifest", () => {
    const records = imageMedia.filter((record) =>
      record.id.startsWith("bar-stock-"),
    );
    expect(records).toHaveLength(11);
    expect(barCategoryMedia).toHaveLength(11);
    expect(new Set(barCategoryMedia.map(({ imageId }) => imageId)).size).toBe(
      11,
    );
    expect(
      barCategoryMedia.every(({ categoryId }) =>
        barCategories.some(({ id }) => id === categoryId),
      ),
    ).toBe(true);
    expect(
      barCategoryMedia.every(({ imageId }) => {
        const record = getImageRecord(imageId);
        return record.productionReady && record.rightsStatus === "approved";
      }),
    ).toBe(true);
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
