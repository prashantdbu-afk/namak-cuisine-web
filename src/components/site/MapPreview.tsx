"use client";
import { useState } from "react";
import { site } from "@/config/site";
export function MapPreview() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="map-preview">
      {revealed ? (
        <div className="map-revealed">
          <span aria-hidden>⌖</span>
          <p>{site.address.formatted}</p>
          <a className="text-link" href={site.directionsUrl}>
            Open directions ↗
          </a>
        </div>
      ) : (
        <button onClick={() => setRevealed(true)}>
          <span aria-hidden>⌖</span>
          <strong>Find us on Greenville Avenue</strong>
          <small>Reveal location details</small>
        </button>
      )}
    </div>
  );
}
