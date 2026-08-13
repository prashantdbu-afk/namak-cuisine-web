"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import {
  trackCtaClick,
  trackPageView,
  trackSocialClick,
  sendFirstPartyEvent,
  type AnalyticsEventName,
} from "@/lib/analytics/events";

const routeViewEvents = {
  "/menu": "view_menu",
  "/bar": "view_bar",
  "/catering": "view_catering",
} as const satisfies Record<string, AnalyticsEventName>;

function getCtaLocation(link: HTMLAnchorElement) {
  const explicitLocation = link.dataset.analyticsLocation;
  if (explicitLocation) return explicitLocation;
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest("nav")) return "navigation";
  return "page_content";
}

function isSameDestination(href: string, destination: string) {
  try {
    const linkUrl = new URL(href, window.location.origin);
    const destinationUrl = new URL(destination);
    return (
      linkUrl.hostname === destinationUrl.hostname &&
      linkUrl.pathname === destinationUrl.pathname &&
      linkUrl.search === destinationUrl.search
    );
  } catch {
    return false;
  }
}

export function AnalyticsEvents({
  googleEnabled = true,
  firstPartyEnabled = false,
}: {
  googleEnabled?: boolean;
  firstPartyEnabled?: boolean;
}) {
  const pathname = usePathname();
  const lastTrackedView = useRef<string | null>(null);
  const lastTrackedFirstPartyPage = useRef<string | null>(null);

  const firstParty = useCallback(
    (eventName: AnalyticsEventName, ctaLocation?: string) => {
      if (!firstPartyEnabled) return;
      const visitorKey = "namak_analytics_visitor_id";
      const sessionKey = "namak_analytics_session_id";
      let visitorId = localStorage.getItem(visitorKey);
      let sessionId = sessionStorage.getItem(sessionKey);
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(visitorKey, visitorId);
      }
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
      }
      void sendFirstPartyEvent({
        eventName,
        visitorId,
        sessionId,
        sourcePage: pathname,
        ...(ctaLocation ? { ctaLocation } : {}),
      }).catch(() => {
        // Analytics must never interrupt navigation or primary restaurant CTAs.
      });
    },
    [firstPartyEnabled, pathname],
  );

  useEffect(() => {
    if (firstPartyEnabled && lastTrackedFirstPartyPage.current !== pathname) {
      lastTrackedFirstPartyPage.current = pathname;
      firstParty("page_view");
    }
    const eventName = routeViewEvents[pathname as keyof typeof routeViewEvents];
    if (!eventName || lastTrackedView.current === pathname) return;
    lastTrackedView.current = pathname;
    if (googleEnabled) trackPageView(eventName);
    firstParty(eventName);
  }, [pathname, googleEnabled, firstPartyEnabled, firstParty]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (href.toLowerCase().startsWith("tel:")) {
        const location = getCtaLocation(link);
        if (googleEnabled) trackCtaClick("click_call", pathname, location);
        firstParty("click_call", location);
        return;
      }

      if (isSameDestination(href, site.directionsUrl)) {
        const location = getCtaLocation(link);
        if (googleEnabled)
          trackCtaClick("click_directions", pathname, location);
        firstParty("click_directions", location);
        return;
      }

      if (isSameDestination(href, site.social.instagram)) {
        if (googleEnabled) trackSocialClick("click_instagram", pathname);
        firstParty("click_instagram");
        return;
      }

      if (isSameDestination(href, site.social.facebook)) {
        if (googleEnabled) trackSocialClick("click_facebook", pathname);
        firstParty("click_facebook");
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, googleEnabled, firstPartyEnabled, firstParty]);

  return null;
}
