import { describe, expect, it } from "vitest";
import { navigation } from "./site";
describe("navigation", () => {
  it("contains unique, valid routes", () => {
    expect(new Set(navigation.map((x) => x.href)).size).toBe(navigation.length);
    expect(navigation.every((x) => x.href.startsWith("/"))).toBe(true);
  });
  it("replaces Gather with Catering", () => {
    expect(navigation).toContainEqual({ href: "/catering", label: "Catering" });
    expect(navigation.map((item) => item.label)).not.toContain("Gather");
  });
});
