import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import {
  isRouteIndexable,
  routePublication,
  type SiteRoute,
} from "@/config/publication";
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(routePublication) as SiteRoute[])
    .filter(isRouteIndexable)
    .map((route) => ({
      url: `${site.domain}${route === "/" ? "" : route}`,
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
