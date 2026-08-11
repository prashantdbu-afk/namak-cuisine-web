import { describe, expect, it } from "vitest";
import { imageMedia } from "@/media/manifest";
import { venueProcessingConfig } from "@/media/venue-processing-config";
import {
  getApprovedVenueImage,
  isVenueMediaPubliclyEligible,
  venueGallerySections,
  venuePlacements,
} from "./venue-media";

describe("venue media publication policy", () => {
  it("audits every supplied venue photograph exactly once", () => {
    expect(venueProcessingConfig).toHaveLength(43);
    expect(
      new Set(venueProcessingConfig.map((record) => record.sourceFilename))
        .size,
    ).toBe(43);
    expect(
      new Set(venueProcessingConfig.map((record) => record.imageId)).size,
    ).toBe(43);
  });

  it("publishes only approved, privacy-safe, natural records", () => {
    const venueRecords = imageMedia.filter((record) => record.venueCategory);
    for (const media of venueRecords.filter(isVenueMediaPubliclyEligible)) {
      expect(media.venueMediaStatus).toBe("approved");
      expect(media.sensitiveInformationFound).toBe(false);
      expect(["approved", "not-applicable"]).toContain(media.peopleApproval);
      expect(media.generativeEdit).toBe(false);
    }
  });

  it("uses only eligible records in every public venue placement", () => {
    const ids = [
      venuePlacements.homepageExperience,
      venuePlacements.homepageBar,
      venuePlacements.barHero,
      ...venuePlacements.homepageGallery,
      ...venuePlacements.about,
      ...venuePlacements.visit,
      ...venueGallerySections.flatMap((section) => section.imageIds),
    ];
    expect(() => ids.forEach(getApprovedVenueImage)).not.toThrow();
  });

  it("keeps kitchen review frames off public gallery pages", () => {
    expect(
      venueGallerySections.find((section) => section.id === "kitchen")
        ?.imageIds,
    ).toHaveLength(0);
    expect(
      venueProcessingConfig.filter(
        (record) =>
          record.category.startsWith("kitchen") && record.productionReady,
      ),
    ).toHaveLength(0);
  });
});
