export const analyticsEvents = [
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
] as const;

export type AnalyticsEventName = (typeof analyticsEvents)[number];
export type AnalyticsParameters = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isValidGa4Id(value?: string) {
  return Boolean(value && /^G-[A-Z0-9]+$/i.test(value));
}

export function isValidGtmId(value?: string) {
  return Boolean(value && /^GTM-[A-Z0-9]+$/i.test(value));
}

export function trackEvent(
  name: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") return;
  const payload = Object.fromEntries(
    Object.entries(parameters).filter((entry) => entry[1] !== undefined),
  );
  if (isValidGtmId(process.env.NEXT_PUBLIC_GTM_ID)) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: name, ...payload });
    return;
  }
  if (isValidGa4Id(process.env.NEXT_PUBLIC_GA4_ID) && window.gtag)
    window.gtag("event", name, payload);
}

export function pageEventForPath(pathname: string): AnalyticsEventName | null {
  if (pathname === "/menu") return "menu_view";
  if (pathname === "/bar") return "bar_view";
  if (pathname === "/gallery") return "gallery_view";
  if (pathname === "/visit") return "visit_view";
  if (pathname === "/catering") return "catering_page_view";
  return null;
}
