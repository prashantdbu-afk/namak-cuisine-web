import { NextResponse } from "next/server";
import postgres from "postgres";
import { parseFirstPartyEvent } from "@/lib/analytics/schema";

export async function POST(request: Request) {
  if (
    process.env.VERCEL_ENV !== "production" ||
    process.env.NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED !== "true"
  )
    return new NextResponse(null, { status: 404 });
  const event = parseFirstPartyEvent(await request.json().catch(() => null));
  if (!event)
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl)
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    await sql`insert into analytics_events
      (event_name, visitor_id, session_id, source_page, cta_location)
      values (${event.eventName}, ${event.visitorId}, ${event.sessionId},
      ${event.sourcePage}, ${event.ctaLocation ?? null})`;
    return new NextResponse(null, { status: 204 });
  } finally {
    await sql.end();
  }
}
