import { NextResponse } from "next/server";
import { getMapConfiguration } from "@/config/map";

export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const map = getMapConfiguration();
  if (!key) return new NextResponse(null, { status: 404 });

  const params = new URLSearchParams({
    key,
    q: map.placeId ? `place_id:${map.placeId}` : map.address,
    zoom: String(map.zoom),
  });
  return NextResponse.redirect(
    `https://www.google.com/maps/embed/v1/place?${params}`,
    307,
  );
}
