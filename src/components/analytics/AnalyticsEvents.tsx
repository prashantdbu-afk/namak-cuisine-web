"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import {
  trackCtaClick,
  trackPageView,
  trackSocialClick,
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

export function AnalyticsEvents() {
  const pathname = usePathname();
  const lastTrackedView = useRef<string | null>(null);

  useEffect(() => {
    const eventName = routeViewEvents[pathname as keyof typeof routeViewEvents];
    if (!eventName || lastTrackedView.current === pathname) return;
    lastTrackedView.current = pathname;
    trackPageView(eventName);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (href.toLowerCase().startsWith("tel:")) {
        trackCtaClick("click_call", pathname, getCtaLocation(link));
        return;
      }

      if (isSameDestination(href, site.directionsUrl)) {
        trackCtaClick("click_directions", pathname, getCtaLocation(link));
        return;
      }

      if (isSameDestination(href, site.social.instagram)) {
        trackSocialClick("click_instagram", pathname);
        return;
      }

      if (isSameDestination(href, site.social.facebook)) {
        trackSocialClick("click_facebook", pathname);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
