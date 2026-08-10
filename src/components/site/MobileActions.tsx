import Link from "next/link";
import { site } from "@/config/site";
import { integrations } from "@/config/integrations";
import { getReservationAction } from "@/lib/reservations";
import { getOrderAction } from "@/lib/ordering";
export function MobileActions() {
  const reserve = getReservationAction();
  const order = getOrderAction();
  const callReservation = integrations.reservation.mode === "call";
  return (
    <nav className="mobile-actions" aria-label="Quick actions">
      <Link href="/menu">Menu</Link>
      <a
        href={site.phoneHref}
        data-analytics-event={callReservation ? "reserve_click" : "call_click"}
        data-analytics-placement="mobile-actions"
      >
        {callReservation ? "Call to Reserve" : "Call"}
      </a>
      <a
        href={site.directionsUrl}
        data-analytics-event="directions_click"
        data-analytics-placement="mobile-actions"
      >
        Directions
      </a>
      {order.available && <a href={order.href}>Order</a>}
      {!callReservation && reserve.available && (
        <a
          href={reserve.href}
          data-analytics-event="reserve_click"
          data-analytics-placement="mobile-actions"
        >
          Reserve
        </a>
      )}
    </nav>
  );
}
