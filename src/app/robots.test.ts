import { describe, expect, it } from "vitest";
import { createRobots } from "./robots";

describe("robots", () => {
  it("allows production and publishes the sitemap", () => {
    expect(createRobots(true)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://namakcuisine.com/sitemap.xml",
      host: "https://namakcuisine.com",
    });
  });

  it("blocks preview crawling", () => {
    expect(createRobots(false)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });
});
