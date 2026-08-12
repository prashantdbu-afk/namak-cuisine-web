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

export const homepageVenuePlacements = {
  hero: "venue-dining-wide-02",
  experience: "venue-entrance-interior-01",
  bar: "venue-bar-wide-01",
  gallery: ["venue-seating-01", "venue-bar-wide-05", "venue-exterior-day-04"],
} as const;

export const aboutVenuePlacements = {
  hero: "venue-architecture-01",
  hospitality: "venue-seating-03",
  bar: "venue-bar-wide-03",
  dallas: "venue-entrance-exterior-02",
} as const;

export const homepageVenueImageIds = [
  homepageVenuePlacements.hero,
  homepageVenuePlacements.experience,
  homepageVenuePlacements.bar,
  ...homepageVenuePlacements.gallery,
] as const;

export const aboutVenueImageIds = Object.values(aboutVenuePlacements);
const aboutVenueImageIdSet = new Set<string>(aboutVenueImageIds);

export const wideDiningOverviewIds = new Set([
  "venue-dining-wide-02",
  "venue-dining-wide-03",
  "venue-dining-wide-04",
  "venue-dining-wide-05",
  "venue-dining-wide-06",
  "venue-dining-wide-07",
  "venue-dining-bar-01",
  "venue-dining-window-01",
  "venue-dining-window-02",
]);

const sharedHomepageAboutIds = homepageVenueImageIds.filter((imageId) =>
  aboutVenueImageIdSet.has(imageId),
);
if (sharedHomepageAboutIds.length > 0) {
  throw new Error(
    `Homepage and About must use distinct venue media: ${sharedHomepageAboutIds.join(", ")}`,
  );
}

export const venuePlacements = {
  homepageExperience: homepageVenuePlacements.experience,
  homepageBar: "venue-bar-wide-01",
  homepageGallery: homepageVenuePlacements.gallery,
  about: Object.values(aboutVenuePlacements),
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
