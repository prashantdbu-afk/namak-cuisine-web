import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { MapConfiguration } from "@/config/map";
import { site } from "@/config/site";
import { RestaurantMap } from "./RestaurantMap";

const configuration: MapConfiguration = {
  provider: "google",
  mode: "static-preview",
  address: site.address.formatted,
  zoom: 16,
  staticMapEnabled: true,
  interactiveMapEnabled: true,
};

describe("RestaurantMap", () => {
  it("renders a useful no-key fallback without the obsolete placeholder", () => {
    const { container } = render(
      <RestaurantMap
        configuration={{
          ...configuration,
          mode: "directions-only",
          staticMapEnabled: false,
          interactiveMapEnabled: false,
        }}
      />,
    );

    expect(screen.getByText(site.address.formatted)).toBeVisible();
    expect(screen.getByText(site.phone)).toBeVisible();
    expect(screen.getByText("Sunday–Thursday")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Get Directions" }),
    ).toHaveAttribute("href", site.directionsUrl);
    expect(container.querySelector("iframe, img")).toBeNull();
    expect(container.textContent).not.toMatch(
      /Reveal location details|map unavailable|⌖/i,
    );
  });

  it("loads and closes the interactive map only after deliberate action", () => {
    const { container } = render(
      <RestaurantMap configuration={configuration} />,
    );

    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/api/map/static");
    fireEvent.click(
      screen.getByRole("button", { name: "View Interactive Map" }),
    );

    const iframe = screen.getByTitle(
      "Map showing Namak Indian Restaurant & Bar on Greenville Avenue in Dallas",
    );
    expect(iframe).toHaveAttribute("src", "/api/map/embed");
    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(iframe).toHaveAttribute(
      "referrerpolicy",
      "strict-origin-when-cross-origin",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Return to map preview" }),
    );
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("img")).toBeVisible();
  });

  it("keeps map dimensions stable and removes dotted-map CSS", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toMatch(/\.location-map\s*\{[^}]*min-height:\s*320px/s);
    expect(css).toMatch(/\.location-map\s*\{[^}]*aspect-ratio:\s*16 \/ 10/s);
    expect(css).toMatch(
      /@media \(max-width: 560px\)[\s\S]*min-height:\s*260px/,
    );
    expect(css).toMatch(/\.location-map img\s*\{[^}]*object-fit:\s*contain/s);
    expect(css).not.toContain(".map-revealed");
    expect(css).not.toContain(
      "radial-gradient(var(--pomegranate) 1px, transparent 1px)",
    );
  });

  it("contains no committed Google API key", () => {
    const sources = [
      ".env.example",
      "src/config/map.ts",
      "src/app/api/map/static/route.ts",
      "src/app/api/map/embed/route.ts",
    ].map((path) => readFileSync(join(process.cwd(), path), "utf8"));
    expect(sources.join("\n")).not.toMatch(/AIza[0-9A-Za-z_-]{20,}/);
  });
});
