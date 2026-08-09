import { describe, expect, it } from "vitest";
import { menuItems } from "./menu";
import {
  galleryImageIds,
  homepageFoodImageIds,
  menuMediaPlacements,
  publicMenuMediaPlacements,
} from "./menu-media";
import { foodProcessingConfig } from "@/media/food-processing-config";
import { imageMedia } from "@/media/manifest";
import processingReport from "../../docs/food-media-processing-report.json";

describe("owner-approved food media", () => {
  it("maps only valid menu item IDs and preserves hold records privately", () => {
    const itemIds = new Set(menuItems.map((entry) => entry.id));
    expect(
      menuMediaPlacements.every((entry) => itemIds.has(entry.itemId)),
    ).toBe(true);
    expect(
      publicMenuMediaPlacements.every((entry) => entry.status === "approved"),
    ).toBe(true);
    const expectedPublic = foodProcessingConfig.filter(
      (entry) =>
        entry.itemId !== null &&
        entry.status === "approved" &&
        entry.uses.includes("menu-feature"),
    );
    expect(publicMenuMediaPlacements).toHaveLength(expectedPublic.length);
    expect(
      new Set(publicMenuMediaPlacements.map((entry) => entry.imageId)),
    ).toEqual(new Set(expectedPublic.map((entry) => entry.imageId)));
    expect(
      publicMenuMediaPlacements.some(
        (entry) => entry.imageId === "food-unidentified-dessert",
      ),
    ).toBe(false);
    expect(
      foodProcessingConfig.filter((entry) => entry.status === "hold"),
    ).toHaveLength(3);
    expect(
      foodProcessingConfig.filter((entry) => entry.status === "review"),
    ).toHaveLength(0);
  });

  it("requires rights, dimensions, alt text, stable ratios, and local output", () => {
    const foodImages = imageMedia.filter((entry) =>
      entry.source.startsWith("/media/menu/"),
    );
    expect(foodImages).toHaveLength(45);
    expect(foodImages.every((entry) => entry.rightsStatus === "approved")).toBe(
      true,
    );
    expect(
      foodImages.every(
        (entry) => entry.width > 0 && entry.height > 0 && entry.aspectRatio > 0,
      ),
    ).toBe(true);
    expect(
      foodImages
        .filter((entry) => entry.productionReady)
        .every((entry) => entry.alt.trim().length > 0),
    ).toBe(true);
    expect(foodImages.every((entry) => !/^https?:/.test(entry.source))).toBe(
      true,
    );
    expect(JSON.stringify(foodImages)).not.toMatch(
      /DoorDash|Grubhub|Toast|Uber Eats|cdn\./i,
    );
  });

  it("keeps homepage and gallery selections restrained without capping menu completeness", () => {
    expect(homepageFoodImageIds.length).toBeLessThanOrEqual(3);
    expect(galleryImageIds.length).toBeLessThanOrEqual(8);
    expect(publicMenuMediaPlacements.length).toBeGreaterThan(20);
  });

  it("maps every approved menu image exactly once and never publishes holds", () => {
    const ids = publicMenuMediaPlacements.map((entry) => entry.imageId);
    const itemIds = publicMenuMediaPlacements.map((entry) => entry.itemId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(itemIds).size).toBe(itemIds.length);
    expect(
      publicMenuMediaPlacements.some((entry) =>
        [
          "food-chicken-boneless-biryani",
          "food-unidentified-dessert",
          "food-kadai-chicken",
        ].includes(entry.imageId),
      ),
    ).toBe(false);
    expect(publicMenuMediaPlacements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          imageId: "food-jhol-momo-non-veg",
          itemId: "amuse-bouche-jhol-momo",
        }),
        expect.objectContaining({
          imageId: "food-tandoori-full",
          itemId: "embers-non-veg-tandoori-chicken",
        }),
      ]),
    );
  });

  it("retains deterministic duplicate and non-generative processing evidence", () => {
    expect(processingReport.exactDuplicates).toEqual([]);
    expect(
      processingReport.records.every(
        (record) =>
          record.sourceSha256.length === 64 &&
          record.outputSha256.length === 64 &&
          record.perceptualDHash.length === 64,
      ),
    ).toBe(true);
    expect(
      processingReport.records.every(
        (record) => record.generativeAlteration === false,
      ),
    ).toBe(true);
  });
});
