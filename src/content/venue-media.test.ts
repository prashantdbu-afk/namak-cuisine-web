import { describe, expect, it } from "vitest";
import { imageMedia } from "@/media/manifest";
import { venueProcessingConfig } from "@/media/venue-processing-config";
import {
  aboutVenueImageIds,
  getApprovedVenueImage,
  homepageVenueImageIds,
  homepageVenuePlacements,
  isVenueMediaPubliclyEligible,
  publicGallerySections,
  selectPublicGallerySections,
  venueGallerySections,
  venuePlacements,
  wideDiningOverviewIds,
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

  it("keeps homepage subjects unique and distinct from Our Story", () => {
    const aboutIds = new Set<string>(aboutVenueImageIds);
    expect(new Set(homepageVenueImageIds).size).toBe(
      homepageVenueImageIds.length,
    );
    expect(homepageVenueImageIds.filter((id) => aboutIds.has(id))).toEqual([]);
    expect(
      homepageVenuePlacements.gallery.filter((id) =>
        wideDiningOverviewIds.has(id),
      ),
    ).toHaveLength(0);
    expect(wideDiningOverviewIds.has(homepageVenuePlacements.experience)).toBe(
      false,
    );
  });

  it("keeps approved venue coverage and dedicated short captions intact", () => {
    const publicIds = new Set([
      ...venuePlacements.homepageGallery,
      ...venueGallerySections.flatMap((section) => section.imageIds),
    ]);

    expect(venuePlacements.homepageGallery).toHaveLength(3);
    expect(
      venueGallerySections.map(({ id, imageIds }) => [id, imageIds.length]),
    ).toEqual([
      ["restaurant", 6],
      ["bar", 4],
      ["kitchen", 0],
      ["exterior", 3],
    ]);

    for (const imageId of publicIds) {
      const media = getApprovedVenueImage(imageId);
      expect(media.displayCaption).toBeTruthy();
      expect(media.displayCaption).not.toBe(media.alt);
      expect(media.displayCaption?.length).toBeLessThanOrEqual(40);
      expect(media.alt.length).toBeGreaterThan(
        media.displayCaption?.length ?? 0,
      );
    }
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
    expect(publicGallerySections.map((section) => section.id)).toEqual([
      "restaurant",
      "bar",
      "exterior",
    ]);
  });

  it("automatically publishes a gallery category after media is approved", () => {
    expect(
      selectPublicGallerySections([
        { id: "kitchen", label: "Kitchen", imageIds: ["approved-image"] },
      ]),
    ).toHaveLength(1);
  });
});
