import heroMedia from "./homepage-hero-media.json";
import { getImageRecord } from "./manifest";
import type { ImageRecord } from "./types";

type HeroImageQuality = 75 | 85 | 90;

export type MediaPlacementEligibility = {
  menu: boolean;
  card: boolean;
  gallery: boolean;
  heroSupporting: boolean;
  heroPrimary: boolean;
};

export function getMediaPlacementEligibility(
  media: ImageRecord,
): MediaPlacementEligibility {
  const approved = media.rightsStatus === "approved" && media.productionReady;
  const hasFocalPoint = Boolean(media.focalPoint);
  const venueSafe =
    media.venueMediaStatus === "approved" &&
    media.sensitiveInformationFound === false &&
    (media.peopleApproval === "approved" ||
      media.peopleApproval === "not-applicable");

  return {
    menu: approved && media.menuEligible === true,
    card: approved && media.width >= 600 && media.height >= 360,
    gallery: approved && hasFocalPoint && media.width >= 1000,
    heroSupporting:
      approved && hasFocalPoint && media.width >= 900 && media.height >= 540,
    heroPrimary:
      approved &&
      venueSafe &&
      hasFocalPoint &&
      media.width >= 1600 &&
      media.height >= 1000,
  };
}

export const homepageHeroMedia = {
  primary: {
    ...heroMedia.primary,
    quality: heroMedia.primary.quality as HeroImageQuality,
    media: getImageRecord(heroMedia.primary.imageId),
  },
  supporting: heroMedia.supporting.map((placement) => ({
    ...placement,
    quality: placement.quality as HeroImageQuality,
    media: getImageRecord(placement.imageId),
  })),
} as const;

if (!getMediaPlacementEligibility(homepageHeroMedia.primary.media).heroPrimary)
  throw new Error("Homepage primary hero media is not placement-eligible.");

for (const placement of homepageHeroMedia.supporting) {
  if (!getMediaPlacementEligibility(placement.media).heroSupporting)
    throw new Error(
      `Homepage supporting hero media is not placement-eligible: ${placement.imageId}`,
    );
}
