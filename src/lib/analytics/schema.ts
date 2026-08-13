import type { AnalyticsEventName } from "./events";

export const collectedEventNames = [
  "page_view",
  "click_call",
  "click_directions",
  "view_menu",
  "view_bar",
  "view_catering",
  "click_instagram",
  "click_facebook",
] as const satisfies readonly AnalyticsEventName[];

export type CollectedEventName = (typeof collectedEventNames)[number];

export type FirstPartyEvent = {
  eventName: CollectedEventName;
  visitorId: string;
  sessionId: string;
  sourcePage: string;
  ctaLocation?: string;
};

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseFirstPartyEvent(value: unknown): FirstPartyEvent | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (
    !collectedEventNames.includes(input.eventName as CollectedEventName) ||
    typeof input.visitorId !== "string" ||
    !uuid.test(input.visitorId) ||
    typeof input.sessionId !== "string" ||
    !uuid.test(input.sessionId) ||
    typeof input.sourcePage !== "string" ||
    !input.sourcePage.startsWith("/") ||
    input.sourcePage.includes("?") ||
    input.sourcePage.length > 120 ||
    (input.ctaLocation !== undefined &&
      (typeof input.ctaLocation !== "string" || input.ctaLocation.length > 40))
  )
    return null;
  return {
    eventName: input.eventName as CollectedEventName,
    visitorId: input.visitorId,
    sessionId: input.sessionId,
    sourcePage: input.sourcePage,
    ...(input.ctaLocation ? { ctaLocation: input.ctaLocation as string } : {}),
  };
}

export function isObviousAutomation(userAgent: string) {
  return /playwright|lighthouse|headlesschrome|pagespeed|googlebot|bingbot/i.test(
    userAgent,
  );
}
