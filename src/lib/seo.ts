import type { Metadata } from "next";
import { site } from "@/config/site";

export const publicPageSeo = {
  home: {
    path: "/",
    title: "Indian Restaurant & Bar on Greenville Ave, Dallas | Namak",
    description:
      "Visit Namak, an Indian restaurant and bar on Greenville Avenue in Dallas, for expressive cuisine, cocktails, warm hospitality, and catering.",
  },
  menu: {
    path: "/menu",
    title: "Indian Restaurant Menu in Dallas | Namak",
    description:
      "Explore Namak’s Indian restaurant menu on Greenville Avenue in Dallas, with chaat, tandoor specialties, curries, biryani, breads, and desserts.",
  },
  bar: {
    path: "/bar",
    title: "Indian Bar & Wine Menu | Namak Dallas",
    description:
      "Browse the Indian bar and wine menu at Namak in Dallas, featuring draft beer, spirits, wines by the glass, and a thoughtfully selected bottle list.",
  },
  catering: {
    path: "/catering",
    title: "Indian Catering in Dallas | Namak",
    description:
      "Plan Indian catering in Dallas with Namak for corporate events, weddings, cultural gatherings, and family celebrations across the Dallas area.",
  },
  gallery: {
    path: "/gallery",
    title: "Restaurant Gallery | Namak Dallas",
    description:
      "Explore the Namak restaurant gallery for a look at Indian dishes, drinks, hospitality, and the dining atmosphere on Greenville Avenue in Dallas.",
  },
  visit: {
    path: "/visit",
    title: "Directions & Hours | Namak Dallas",
    description:
      "Find directions, opening hours, parking guidance, and contact details for Namak Indian Restaurant & Bar on Greenville Avenue in Dallas, Texas.",
  },
  about: {
    path: "/about",
    title: "Our Story | Namak Indian Restaurant & Bar",
    description:
      "Discover the point of view behind Namak Indian Restaurant & Bar, bringing contemporary Indian cooking and warm hospitality to Greenville Avenue.",
  },
  contact: {
    path: "/contact",
    title: "Contact Namak | Dallas",
    description:
      "Contact Namak Indian Restaurant & Bar in Dallas with questions about dining, hours, directions, reservations, accessibility, or your upcoming visit.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy | Namak Indian Restaurant & Bar",
    description:
      "Read how Namak Indian Restaurant & Bar handles catering inquiries, website data, map interactions, analytics, and visitor privacy in Dallas.",
  },
  accessibility: {
    path: "/accessibility",
    title: "Accessibility | Namak Indian Restaurant & Bar",
    description:
      "Read Namak’s commitment to an accessible restaurant website with keyboard support, visible focus, clear structure, and assistance by phone today.",
  },
} as const;

export type PublicPageSeoKey = keyof typeof publicPageSeo;

export function createPageMetadata(key: PublicPageSeoKey): Metadata {
  const entry = publicPageSeo[key];
  return {
    title: { absolute: entry.title },
    description: entry.description,
    alternates: { canonical: entry.path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: entry.title,
      description: entry.description,
      url: entry.path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name} in Dallas`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: ["/twitter-image"],
    },
  };
}

export type FaqEntry = { question: string; answer: string };

export function createBreadcrumbSchema(
  name: string,
  path: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${site.domain}${path}`,
      },
    ],
  };
}

export function createFaqSchema(faqs: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function createRestaurantSchema(
  openingHoursSpecification: readonly Record<string, unknown>[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.domain}/#restaurant`,
    name: site.name,
    url: site.domain,
    logo: `${site.domain}/icon.svg`,
    image: `${site.domain}/opengraph-image`,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    servesCuisine: "Indian",
    openingHoursSpecification,
    sameAs: [site.social.instagram, site.social.facebook],
    menu: `${site.domain}/menu`,
    hasMap: site.directionsUrl,
    acceptsReservations: true,
  };
}
