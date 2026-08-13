import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/config/site";
import { AnalyticsEvents } from "./AnalyticsEvents";

const mocks = vi.hoisted(() => ({
  pathname: "/menu",
  sendGAEvent: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: mocks.sendGAEvent,
}));

function renderTrackedLink(href: string, label: string, landmark = "main") {
  const Wrapper = landmark === "footer" ? "footer" : "main";
  render(
    <>
      <AnalyticsEvents />
      <Wrapper>
        <a href={href}>{label}</a>
      </Wrapper>
    </>,
  );
  fireEvent.click(screen.getByRole("link", { name: label }));
}

describe("analytics events", () => {
  beforeEach(() => {
    mocks.pathname = "/menu";
    mocks.sendGAEvent.mockClear();
  });

  it("tracks the menu view without sending a manual page_view", async () => {
    render(<AnalyticsEvents />);
    await waitFor(() =>
      expect(mocks.sendGAEvent).toHaveBeenCalledWith("event", "view_menu"),
    );
    expect(mocks.sendGAEvent).not.toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.anything(),
    );
  });

  it("tracks calls with route-only source and CTA location", () => {
    mocks.pathname = "/catering";
    renderTrackedLink(site.phoneHref, "Call Our Team");
    expect(mocks.sendGAEvent).toHaveBeenCalledWith("event", "click_call", {
      source_page: "/catering",
      cta_location: "page_content",
    });
  });

  it("tracks directions without including destination query data", () => {
    mocks.pathname = "/visit";
    renderTrackedLink(site.directionsUrl, "Get Directions");
    expect(mocks.sendGAEvent).toHaveBeenCalledWith(
      "event",
      "click_directions",
      { source_page: "/visit", cta_location: "page_content" },
    );
  });

  it.each([
    [site.social.instagram, "Instagram", "click_instagram"],
    [site.social.facebook, "Facebook", "click_facebook"],
  ])("tracks the %s social link", (href, label, eventName) => {
    mocks.pathname = "/";
    renderTrackedLink(href, label, "footer");
    expect(mocks.sendGAEvent).toHaveBeenCalledWith("event", eventName, {
      source_page: "/",
    });
  });

  it("never includes PII-shaped fields or URL query strings", () => {
    mocks.pathname = "/catering";
    renderTrackedLink(site.phoneHref, "Call");
    const payload = mocks.sendGAEvent.mock.calls.find(
      (call) => call[1] === "click_call",
    )?.[2];
    expect(payload).toEqual({
      source_page: "/catering",
      cta_location: "page_content",
    });
    expect(payload).not.toHaveProperty("name");
    expect(payload).not.toHaveProperty("email");
    expect(payload).not.toHaveProperty("phone");
    expect(payload).not.toHaveProperty("notes");
    expect(JSON.stringify(payload)).not.toContain("?");
  });
});
