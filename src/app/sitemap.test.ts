import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes catering and excludes the private-dining redirect", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://namakcuisine.com/catering");
    expect(urls).not.toContain("https://namakcuisine.com/private-dining");
  });
});
