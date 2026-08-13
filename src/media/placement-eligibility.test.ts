import { describe, expect, it } from "vitest";
import {
  getMediaPlacementEligibility,
  homepageHeroMedia,
} from "./placement-eligibility";

describe("homepage hero placement eligibility", () => {
  it("uses one approved large venue image as the primary", () => {
    const { media, sizes, quality, fetchPriority, maxRenderedWidth } =
      homepageHeroMedia.primary;
    expect(getMediaPlacementEligibility(media).heroPrimary).toBe(true);
    expect(media.width).toBeGreaterThanOrEqual(1600);
    expect(media.height).toBeGreaterThanOrEqual(1000);
    expect(maxRenderedWidth).toBeLessThanOrEqual(media.width);
    expect(sizes).not.toBe(media.sizes);
    expect(sizes).not.toContain("210px");
    expect(quality).toBe(90);
    expect(fetchPriority).toBe("high");
  });

  it("keeps both supporting food images within their source density", () => {
    expect(homepageHeroMedia.supporting).toHaveLength(2);
    for (const placement of homepageHeroMedia.supporting) {
      expect(getMediaPlacementEligibility(placement.media).heroSupporting).toBe(
        true,
      );
      expect(placement.media.width).toBeGreaterThanOrEqual(900);
      expect(placement.media.height).toBeGreaterThanOrEqual(540);
      expect(placement.maxRenderedWidth).toBeLessThanOrEqual(
        placement.media.width,
      );
      expect(placement.sizes).not.toBe(placement.media.sizes);
      expect(placement.sizes).not.toContain("210px");
      expect(placement.quality).toBe(85);
      expect(placement.fetchPriority).not.toBe("high");
    }
  });
});
