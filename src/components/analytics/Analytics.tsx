"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  isValidGa4Id,
  isValidGtmId,
  pageEventForPath,
  trackEvent,
  type AnalyticsEventName,
} from "@/lib/analytics";

const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

function AnalyticsRouteEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const pageLocation = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;
    trackEvent("page_view", {
      page_location: pageLocation,
      page_path: `${pathname}${search ? `?${search}` : ""}`,
      page_title: document.title,
    });
    const routeEvent = pageEventForPath(pathname);
    if (routeEvent) trackEvent(routeEvent, { page_path: pathname });
  }, [pathname, search]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-analytics-event]",
      );
      const name = target?.dataset.analyticsEvent as
        AnalyticsEventName | undefined;
      if (!target || !name) return;
      trackEvent(name, {
        link_url: target instanceof HTMLAnchorElement ? target.href : undefined,
        link_text: target.textContent?.trim(),
        placement: target.dataset.analyticsPlacement,
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

export function Analytics() {
  const gaEnabled = isValidGa4Id(ga4Id);
  const gtmEnabled = isValidGtmId(gtmId);
  if (!gaEnabled && !gtmEnabled) return null;
  return (
    <>
      {gtmEnabled && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {gaEnabled && !gtmEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-loader" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:false});`}
          </Script>
        </>
      )}
      <Suspense fallback={null}>
        <AnalyticsRouteEvents />
      </Suspense>
    </>
  );
}

export function GoogleTagManagerNoScript() {
  if (!isValidGtmId(gtmId)) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        className="analytics-noscript"
        title="Google Tag Manager"
      />
    </noscript>
  );
}
