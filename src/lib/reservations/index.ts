import { integrations, type ReservationMode } from "@/config/integrations";
import { site } from "@/config/site";
export function getReservationAction(
  mode: ReservationMode = integrations.reservation.mode,
) {
  if (mode === "call")
    return { available: true, href: site.phoneHref, label: "Call to reserve" };
  if (mode === "external" && integrations.reservation.externalUrl)
    return {
      available: true,
      href: integrations.reservation.externalUrl,
      label: "Reserve a table",
    };
  return {
    available: false,
    href: undefined,
    label: "Reservations unavailable",
  };
}
