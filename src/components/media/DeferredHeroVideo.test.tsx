import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeferredHeroVideo, shouldLoadHeroVideo } from "./DeferredHeroVideo";
import { getVideoRecord } from "@/media/manifest";

describe("DeferredHeroVideo", () => {
  it("blocks video for reduced motion, Save-Data, and 2G", () => {
    expect(shouldLoadHeroVideo({ reducedMotion: true })).toBe(false);
    expect(shouldLoadHeroVideo({ reducedMotion: false, saveData: true })).toBe(
      false,
    );
    expect(
      shouldLoadHeroVideo({ reducedMotion: false, effectiveType: "2g" }),
    ).toBe(false);
  });
  it("renders a poster before a video source", () => {
    render(<DeferredHeroVideo media={getVideoRecord("hero-video")} />);
    expect(document.querySelector("video")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /background video/i }),
    ).toBeNull();
  });
});
