import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import {
  isRouteIndexable,
  routePublication,
  type SiteRoute,
} from "@/config/publication";

export const routeLastModified = {
  "/": "2026-08-10",
  "/menu": "2026-08-09",
  "/bar": "2026-08-09",
  "/about": "2026-08-10",
  "/catering": "2026-08-10",
  "/gallery": "2026-08-10",
  "/visit": "2026-08-10",
  "/contact": "2026-08-10",
  "/privacy": "2026-08-10",
  "/accessibility": "2026-08-10",
} as const satisfies Record<SiteRoute, string>;

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(routePublication) as SiteRoute[])
    .filter(isRouteIndexable)
    .map((route) => ({
      url: `${site.domain}${route === "/" ? "" : route}`,
      lastModified: new Date(`${routeLastModified[route]}T00:00:00.000Z`),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
