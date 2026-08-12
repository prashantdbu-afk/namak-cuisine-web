import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes catering and excludes the private-dining redirect", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain("https://namakcuisine.com/catering");
    expect(urls).not.toContain("https://namakcuisine.com/private-dining");
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });
});
