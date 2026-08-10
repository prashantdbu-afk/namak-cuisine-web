import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analyticsEvents,
  isValidGa4Id,
  isValidGtmId,
  pageEventForPath,
  trackEvent,
} from "./analytics";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_GA4_ID;
  delete process.env.NEXT_PUBLIC_GTM_ID;
  delete window.dataLayer;
  delete window.gtag;
});

describe("analytics configuration and events", () => {
  it("validates GA4 and GTM identifiers", () => {
    expect(isValidGa4Id("G-ABC123")).toBe(true);
    expect(isValidGa4Id("UA-123")).toBe(false);
    expect(isValidGtmId("GTM-ABC123")).toBe(true);
    expect(isValidGtmId("G-ABC123")).toBe(false);
  });

  it("contains every required analytics event", () => {
    expect(analyticsEvents).toEqual(
      expect.arrayContaining([
        "page_view",
        "menu_view",
        "bar_view",
        "gallery_view",
        "visit_view",
        "call_click",
        "directions_click",
        "reserve_click",
        "catering_page_view",
        "catering_submit",
        "social_click",
      ]),
    );
  });

  it("maps priority routes to view events", () => {
    expect(pageEventForPath("/menu")).toBe("menu_view");
    expect(pageEventForPath("/bar")).toBe("bar_view");
    expect(pageEventForPath("/catering")).toBe("catering_page_view");
    expect(pageEventForPath("/about")).toBeNull();
  });

  it("sends events directly to GA4 when GTM is absent", () => {
    process.env.NEXT_PUBLIC_GA4_ID = "G-TEST123";
    window.gtag = vi.fn();
    trackEvent("call_click", { placement: "header" });
    expect(window.gtag).toHaveBeenCalledWith("event", "call_click", {
      placement: "header",
    });
  });

  it("uses the GTM data layer when a container is configured", () => {
    process.env.NEXT_PUBLIC_GA4_ID = "G-TEST123";
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123";
    trackEvent("directions_click", { placement: "visit" });
    expect(window.dataLayer).toContainEqual({
      event: "directions_click",
      placement: "visit",
    });
  });
});
