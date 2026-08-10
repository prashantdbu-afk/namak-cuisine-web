import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isProductionDeployment } from "@/config/publication";
export function createRobots(production: boolean): MetadataRoute.Robots {
  return production
    ? {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${site.domain}/sitemap.xml`,
        host: site.domain,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
export default function robots(): MetadataRoute.Robots {
  return createRobots(isProductionDeployment);
}
