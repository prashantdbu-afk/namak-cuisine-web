import { describe, expect, it } from "vitest";
import { imageMedia, mediaManifest } from "./manifest";
import { resolveImage } from "./resolve-media";

describe("media manifest", () => {
  it("has unique IDs and stable dimensions", () => {
    expect(new Set(mediaManifest.map((item) => item.id)).size).toBe(
      mediaManifest.length,
    );
    expect(
      mediaManifest.every((item) => item.width > 0 && item.height > 0),
    ).toBe(true);
  });
  it("resolves provider details behind one boundary", () => {
    expect(resolveImage(imageMedia[0])).toBe("/media/hero-poster.svg");
  });
});
