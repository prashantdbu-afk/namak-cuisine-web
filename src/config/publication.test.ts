import { describe, expect, it } from "vitest";
import {
  isRouteIndexable,
  isRouteVisible,
  routePublication,
  isMediaReviewAvailable,
} from "./publication";

describe("publication state", () => {
  it("keeps hidden routes out of public navigation and indexing", () => {
    const routes = Object.keys(routePublication) as Array<
      keyof typeof routePublication
    >;
    expect(routes.filter(isRouteVisible)).toHaveLength(routes.length);
    expect(routes.filter(isRouteIndexable)).toHaveLength(routes.length);
  });
  it("keeps media review available only outside production by default", () => {
    expect(isMediaReviewAvailable({ VERCEL_ENV: "preview" })).toBe(true);
    expect(isMediaReviewAvailable({ VERCEL_ENV: "production" })).toBe(false);
    expect(
      isMediaReviewAvailable({
        VERCEL_ENV: "production",
        ENABLE_MEDIA_REVIEW: "true",
      }),
    ).toBe(true);
    expect(Object.keys(routePublication)).not.toContain("/media-review");
  });
});
