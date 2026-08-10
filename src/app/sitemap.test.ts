import { describe, expect, it } from "vitest";
import sitemap, { routeLastModified } from "./sitemap";

describe("sitemap", () => {
  it("includes catering and excludes the private-dining redirect", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://namakcuisine.com/catering");
    expect(urls).not.toContain("https://namakcuisine.com/private-dining");
  });
  it("uses stable real modification dates for every indexable route", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      const path = new URL(entry.url).pathname || "/";
      expect((entry.lastModified as Date).toISOString()).toBe(
        `${routeLastModified[path as keyof typeof routeLastModified]}T00:00:00.000Z`,
      );
    }
    expect(routeLastModified["/menu"]).toBe("2026-08-09");
  });
});
