"use client";

import { useState } from "react";
import type { MapConfiguration } from "@/config/map";
import { site } from "@/config/site";
import { hoursDisplay } from "@/content/hours";
import { OpenStatus } from "./OpenStatus";

type RestaurantMapProps = {
  configuration: MapConfiguration;
};

export function RestaurantMap({ configuration }: RestaurantMapProps) {
  const [interactive, setInteractive] = useState(false);

  return (
    <article
      className="location-card"
      data-map-enabled={configuration.staticMapEnabled || interactive}
    >
      {configuration.staticMapEnabled || interactive ? (
        <div className="location-map">
          {interactive ? (
            <iframe
              src="/api/map/embed"
              title="Map showing Namak Indian Restaurant & Bar on Greenville Avenue in Dallas"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            // The proxy protects the server key and preserves Google attribution.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/api/map/static"
              width="1280"
              height="800"
              alt="Map showing Namak Indian Restaurant & Bar on Greenville Avenue in Dallas"
            />
          )}
          {interactive && (
            <button
              className="map-return"
              type="button"
              onClick={() => setInteractive(false)}
            >
              Return to map preview
            </button>
          )}
        </div>
      ) : null}

      <div className="location-details">
        <div>
          <p className="eyebrow dark">Dallas, Texas</p>
          <h2>{site.name}</h2>
          <OpenStatus />
          <address>{configuration.address}</address>
          <a
            className="location-phone"
            href={site.phoneHref}
            data-analytics-event="call_click"
            data-analytics-placement="visit-card"
          >
            {site.phone}
          </a>
        </div>
        <div className="location-hours" aria-label="Opening hours">
          {hoursDisplay.map((entry) => (
            <p key={entry.days}>
              <strong>{entry.days}</strong>
              <span>{entry.hours}</span>
            </p>
          ))}
        </div>
        <div className="location-actions">
          <a
            className="button"
            href={site.directionsUrl}
            data-analytics-event="directions_click"
            data-analytics-placement="visit-card"
          >
            Get Directions
          </a>
          {configuration.interactiveMapEnabled &&
            (!interactive ? (
              <button
                className="button secondary-button"
                type="button"
                onClick={() => setInteractive(true)}
              >
                View Interactive Map
              </button>
            ) : null)}
        </div>
      </div>
    </article>
  );
}
