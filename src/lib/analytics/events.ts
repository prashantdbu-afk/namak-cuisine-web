"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type AnalyticsEventName =
  | "page_view"
  | "click_call"
  | "click_directions"
  | "view_menu"
  | "view_bar"
  | "view_catering"
  | "click_instagram"
  | "click_facebook"
  | "click_reserve"
  | "click_order"
  | "submit_catering_inquiry";

type PageViewEventName = "view_menu" | "view_bar" | "view_catering";
type SocialEventName = "click_instagram" | "click_facebook";
type CtaEventName = "click_call" | "click_directions";

export type NamakEventPayload = {
  eventName: AnalyticsEventName;
  visitorId: string;
  sessionId: string;
  sourcePage: string;
  ctaLocation?: string;
};

export function sendFirstPartyEvent(payload: NamakEventPayload) {
  return fetch("/api/analytics/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}

export function trackPageView(eventName: PageViewEventName) {
  sendGAEvent("event", eventName);
}

export function trackSocialClick(
  eventName: SocialEventName,
  sourcePage: string,
) {
  sendGAEvent("event", eventName, { source_page: sourcePage });
}

export function trackCtaClick(
  eventName: CtaEventName,
  sourcePage: string,
  ctaLocation: string,
) {
  sendGAEvent("event", eventName, {
    source_page: sourcePage,
    cta_location: ctaLocation,
  });
}
