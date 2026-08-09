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

describe("owner-approved food media", () => {
  it("maps only valid menu item IDs and preserves hold records privately", () => {
    const itemIds = new Set(menuItems.map((entry) => entry.id));
    expect(
      menuMediaPlacements.every((entry) => itemIds.has(entry.itemId)),
    ).toBe(true);
    expect(
      publicMenuMediaPlacements.every((entry) => entry.status === "approved"),
    ).toBe(true);
    expect(publicMenuMediaPlacements).toHaveLength(16);
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
    ).toHaveLength(2);
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

  it("keeps public image counts editorially restrained", () => {
    expect(homepageFoodImageIds.length).toBeLessThanOrEqual(3);
    expect(galleryImageIds.length).toBeLessThanOrEqual(8);
    expect(publicMenuMediaPlacements.length).toBeLessThanOrEqual(20);
  });
});
