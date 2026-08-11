import { getImageRecord } from "@/media/manifest";
import type { ImageRecord } from "@/media/types";

export function isVenueMediaPubliclyEligible(media: ImageRecord) {
  return (
    media.rightsStatus === "approved" &&
    media.productionReady &&
    media.venueMediaStatus === "approved" &&
    (media.peopleApproval === "approved" ||
      media.peopleApproval === "not-applicable") &&
    !media.sensitiveInformationFound &&
    (!media.generativeEdit || media.ownerApprovedEdit)
  );
}

export function getApprovedVenueImage(id: string) {
  const media = getImageRecord(id);
  if (!isVenueMediaPubliclyEligible(media))
    throw new Error(`Venue media is not approved for public use: ${id}`);
  return media;
}

export const venuePlacements = {
  homepageExperience: "venue-dining-wide-03",
  homepageBar: "venue-bar-wide-01",
  homepageGallery: [
    "venue-seating-01",
    "venue-dining-bar-01",
    "venue-exterior-day-03",
  ],
  about: ["venue-dining-wide-07", "venue-dining-window-02"],
  visit: [
    "venue-exterior-day-03",
    "venue-entrance-exterior-01",
    "venue-entrance-interior-01",
  ],
  barHero: "venue-bar-wide-01",
} as const;

export const venueGallerySections = [
  {
    id: "restaurant",
    label: "Restaurant",
    imageIds: [
      "venue-dining-wide-03",
      "venue-seating-01",
      "venue-dining-wide-07",
      "venue-dining-window-02",
      "venue-architecture-01",
      "venue-dining-wide-02",
    ],
  },
  {
    id: "bar",
    label: "Bar",
    imageIds: [
      "venue-bar-wide-01",
      "venue-bar-wide-02",
      "venue-bar-wide-03",
      "venue-bar-wide-05",
    ],
  },
  { id: "kitchen", label: "Kitchen", imageIds: [] },
  {
    id: "exterior",
    label: "Exterior",
    imageIds: [
      "venue-exterior-day-03",
      "venue-exterior-day-01",
      "venue-entrance-exterior-02",
    ],
  },
] as const;
