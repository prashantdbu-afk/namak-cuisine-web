import { describe, expect, it } from "vitest";
import { menuItems } from "./menu";
import {
  galleryImageIds,
  getMenuImagePresentationTier,
  homepageFoodImageIds,
  menuMediaPlacements,
  publicMenuMediaPlacements,
} from "./menu-media";
import { foodProcessingConfig } from "@/media/food-processing-config";
import { imageMedia } from "@/media/manifest";
import processingReport from "../../docs/food-media-processing-report.json";
import { readFileSync } from "node:fs";

const requiredSystems = {
  "AMUSE-BOUCHE": "ivory-coupe",
  SOUPS: "charcoal-kadhai",
  "EMBERS VEG": "ivory-coupe",
  "EMBERS NON-VEG": "ivory-coupe",
  "VEG ENTREES": "charcoal-kadhai",
  "NON-VEG ENTREES": "charcoal-kadhai",
  "BIRYANI AND PULAO": "charcoal-kadhai",
  "INDIAN BREADS": "bread-basket",
} as const;

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
        itemIds.has(entry.itemId) &&
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
    expect(foodImages).toHaveLength(42);
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

  it("keeps a four-image, single-system homepage row and a restrained gallery", () => {
    expect(homepageFoodImageIds).toHaveLength(4);
    expect(
      homepageFoodImageIds.every((id) => {
        const record = foodProcessingConfig.find(
          (entry) => entry.imageId === id,
        );
        return (
          record?.targetPlateSystem === "ivory-coupe" &&
          record.visualCompliance === "pass" &&
          record.menuEligible
        );
      }),
    ).toBe(true);
    expect(galleryImageIds.length).toBeLessThanOrEqual(8);
    expect(publicMenuMediaPlacements.length).toBeGreaterThan(0);
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
    expect(
      publicMenuMediaPlacements.filter((entry) =>
        ["food-jhol-momo-non-veg", "food-tandoori-full"].includes(
          entry.imageId,
        ),
      ),
    ).toHaveLength(2);
  });

  it("uses compliance only for presentation tier, never full-menu visibility", () => {
    expect(
      publicMenuMediaPlacements.some(
        (entry) =>
          entry.visualCompliance !== "pass" || entry.menuEligible === false,
      ),
    ).toBe(true);
    expect(
      publicMenuMediaPlacements.every((entry) =>
        ["curated", "standardized-original"].includes(entry.presentationTier),
      ),
    ).toBe(true);
    expect(
      publicMenuMediaPlacements.some(
        (entry) => entry.presentationTier === "curated",
      ),
    ).toBe(true);
    expect(
      publicMenuMediaPlacements.some(
        (entry) => entry.presentationTier === "standardized-original",
      ),
    ).toBe(true);
    expect(
      foodProcessingConfig
        .filter((entry) => entry.status === "hold")
        .every((entry) => getMenuImagePresentationTier(entry) === "hold"),
    ).toBe(true);
  });

  it("publishes every valid approved production-ready menu-feature image", () => {
    const publicIds = new Set(
      publicMenuMediaPlacements.map((entry) => entry.imageId),
    );
    const mediaById = new Map(imageMedia.map((entry) => [entry.id, entry]));
    const validItemIds = new Set(menuItems.map((entry) => entry.id));
    const eligible = foodProcessingConfig.filter((entry) => {
      const media = mediaById.get(entry.imageId);
      return (
        entry.itemId !== null &&
        validItemIds.has(entry.itemId) &&
        entry.status === "approved" &&
        entry.uses.includes("menu-feature") &&
        media?.rightsStatus === "approved" &&
        media.productionReady
      );
    });
    expect(publicIds).toEqual(new Set(eligible.map((entry) => entry.imageId)));
    expect(publicMenuMediaPlacements).toHaveLength(eligible.length);
    expect(
      foodProcessingConfig
        .filter((entry) =>
          ["temporary", "reject"].includes(entry.visualCompliance),
        )
        .filter((entry) =>
          eligible.some((candidate) => candidate.imageId === entry.imageId),
        )
        .every((entry) => publicIds.has(entry.imageId)),
    ).toBe(true);
  });

  it("enforces one audited plate system within each public category", () => {
    for (const [category, target] of Object.entries(requiredSystems)) {
      const publicRecords = foodProcessingConfig.filter(
        (entry) =>
          entry.category === category &&
          publicMenuMediaPlacements.some(
            (placement) => placement.imageId === entry.imageId,
          ),
      );
      expect(
        publicRecords.every((entry) => entry.targetPlateSystem === target),
        category,
      ).toBe(true);
      expect(
        new Set(publicRecords.map((entry) => entry.targetPlateSystem)).size,
        category,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("does not misclassify known gold-charger or grill photographs", () => {
    const gold = foodProcessingConfig.find(
      (entry) => entry.imageId === "food-bharwan-paneer-tikka",
    );
    const grill = foodProcessingConfig.find(
      (entry) => entry.imageId === "food-tandoori-full",
    );
    expect(gold?.actualVisiblePlate).toMatch(/gold charger/i);
    expect(gold?.visualCompliance).toBe("reject");
    expect(grill?.actualVisiblePlate).toMatch(/tabletop grill/i);
    expect(grill?.visualCompliance).toBe("reject");
  });

  it("uses neutral defaults instead of image-ID seeded corrections", () => {
    const source = readFileSync(
      `${process.cwd()}/src/media/food-processing-config.ts`,
      "utf8",
    );
    expect(source).not.toMatch(/charCodeAt|const seed|seed %/);
    expect(source).toContain("brightness: options.brightness ?? 1");
    expect(source).toContain("sharpenSigma: options.sharpenSigma ?? 0.4");
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
