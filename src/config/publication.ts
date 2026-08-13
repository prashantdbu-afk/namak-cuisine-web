export type PublicationState = "published" | "hidden" | "noindex";

export const routePublication = {
  "/": "published",
  "/menu": "published",
  "/bar": "published",
  "/about": "published",
  "/catering": "published",
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

export function isMediaReviewAvailable(
  env: { VERCEL_ENV?: string; ENABLE_MEDIA_REVIEW?: string } = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    ENABLE_MEDIA_REVIEW: process.env.ENABLE_MEDIA_REVIEW,
  },
) {
  return env.VERCEL_ENV !== "production" || env.ENABLE_MEDIA_REVIEW === "true";
}

export const isStockReviewAvailable = isMediaReviewAvailable;

export function isStockMediaPreviewAvailable(
  env: { VERCEL_ENV?: string; ENABLE_BAR_STOCK?: string } = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    ENABLE_BAR_STOCK: process.env.ENABLE_BAR_STOCK,
  },
) {
  return env.VERCEL_ENV !== "production" || env.ENABLE_BAR_STOCK === "true";
}

export function routeRobots(route: SiteRoute) {
  return {
    index: isProductionDeployment && isRouteIndexable(route),
    follow: isProductionDeployment && isRouteIndexable(route),
  };
}
