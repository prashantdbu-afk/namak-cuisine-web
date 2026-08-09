import { NextResponse, type NextRequest } from "next/server";
import {
  getPublicationState,
  isProductionDeployment,
  routePublication,
  type SiteRoute,
} from "@/config/publication";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const route = request.nextUrl.pathname as SiteRoute;
  const state =
    route in routePublication ? getPublicationState(route) : undefined;
  if (!isProductionDeployment || state === "hidden" || state === "noindex")
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)",
  ],
};
