export const site = {
  name: "Namak Indian Restaurant & Bar",
  shortName: "Namak",
  domain: "https://namakcuisine.com",
  phone: "214-730-0047",
  phoneHref: "tel:+12147300047",
  address: {
    street: "5500 Greenville Ave #600",
    city: "Dallas",
    region: "TX",
    postalCode: "75206",
    country: "US",
    formatted: "5500 Greenville Ave #600, Dallas, TX 75206",
  },
  timeZone: "America/Chicago",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=5500+Greenville+Ave+%23600%2C+Dallas%2C+TX+75206",
  social: {
    instagram: "https://www.instagram.com/namak_greenvilledallas/",
    facebook: "https://www.facebook.com/profile.php?id=61575667318010",
  },
} as const;

const allNavigation = [
  { href: "/menu", label: "Menu" },
  { href: "/bar", label: "Bar" },
  { href: "/about", label: "Our story" },
  { href: "/catering", label: "Catering" },
  { href: "/gallery", label: "Gallery" },
  { href: "/visit", label: "Visit" },
] as const;

import { isRouteVisible, type SiteRoute } from "./publication";
export const navigation = allNavigation.filter((item) =>
  isRouteVisible(item.href as SiteRoute),
);
