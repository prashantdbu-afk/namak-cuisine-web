import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isProductionDeployment } from "@/config/publication";
export default function robots(): MetadataRoute.Robots {
  return isProductionDeployment
    ? {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${site.domain}/sitemap.xml`,
        host: site.domain,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
