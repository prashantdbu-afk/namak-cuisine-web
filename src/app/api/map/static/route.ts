import { NextResponse } from "next/server";
import { getMapConfiguration } from "@/config/map";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  const map = getMapConfiguration();
  if (!key) return new NextResponse(null, { status: 404 });

  const params = new URLSearchParams({
    center: map.address,
    zoom: String(map.zoom),
    size: "640x400",
    scale: "2",
    maptype: "roadmap",
    format: "png",
    markers: `color:0xb8484f|${map.address}`,
    key,
  });
  for (const style of [
    "feature:poi.business|visibility:off",
    "feature:transit|visibility:off",
    "feature:road|element:geometry|color:0xf0e8da",
    "feature:road|element:labels.text.fill|color:0x42564f",
    "feature:landscape|element:geometry|color:0xf8f3e9",
    "feature:water|element:geometry|color:0xcbdcd6",
  ]) {
    params.append("style", style);
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/staticmap?${params}`,
    { next: { revalidate: 86_400 } },
  );
  if (!response.ok) return new NextResponse(null, { status: 502 });

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
