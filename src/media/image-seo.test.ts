import { describe, expect, it } from "vitest";
import manifest from "./manifest.json";
import type { ImageRecord, MediaRecord } from "./types";

describe("image SEO", () => {
  it("gives production meaningful images dimensions, responsive sizes, modern filenames, and unique alt text", () => {
    const meaningful = (manifest as MediaRecord[]).filter(
      (record): record is ImageRecord =>
        record.kind === "image" && record.productionReady && !record.decorative,
    );
    const altText = meaningful.map((record) => record.alt.trim());
    expect(meaningful.length).toBeGreaterThan(0);
    expect(new Set(altText).size).toBe(altText.length);
    for (const record of meaningful) {
      expect(record.width).toBeGreaterThan(0);
      expect(record.height).toBeGreaterThan(0);
      expect(record.sizes.trim()).not.toBe("");
      expect(record.source).toMatch(/\.(avif|webp)$/i);
      expect(record.alt.trim()).not.toBe("");
    }
  });
});
