import { site } from "./site";

export type MapMode = "static-preview" | "interactive" | "directions-only";
export type MapProvider = "google";

export type MapConfiguration = {
  provider: MapProvider;
  mode: MapMode;
  address: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  zoom: number;
  staticMapEnabled: boolean;
  interactiveMapEnabled: boolean;
};

export function getMapConfiguration(): MapConfiguration {
  const staticMapEnabled = Boolean(process.env.GOOGLE_MAPS_SERVER_API_KEY);
  const interactiveMapEnabled = Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
  );

  return {
    provider: "google",
    mode: staticMapEnabled
      ? "static-preview"
      : interactiveMapEnabled
        ? "interactive"
        : "directions-only",
    address: site.address.formatted,
    zoom: 16,
    staticMapEnabled,
    interactiveMapEnabled,
  };
}
