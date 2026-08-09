export type PublicationState = "published" | "hidden" | "noindex";

export const routePublication = {
  "/": "published",
  "/menu": "published",
  "/bar": "published",
  "/about": "published",
  "/private-dining": "published",
  "/gallery": "published",
  "/visit": "published",
  "/contact": "published",
  "/privacy": "published",
  "/accessibility": "published",
} as const satisfies Record<string, PublicationState>;

export type SiteRoute = keyof typeof routePublication;

export function getPublicationState(route: SiteRoute): PublicationState {
  return routePublication[route] as PublicationState;
}

export function isRouteVisible(route: SiteRoute) {
  return getPublicationState(route) !== "hidden";
}

export function isRouteIndexable(route: SiteRoute) {
  return getPublicationState(route) === "published";
}

export const isProductionDeployment = process.env.VERCEL_ENV === "production";

export function routeRobots(route: SiteRoute) {
  return {
    index: isProductionDeployment && isRouteIndexable(route),
    follow: isProductionDeployment && isRouteIndexable(route),
  };
}
