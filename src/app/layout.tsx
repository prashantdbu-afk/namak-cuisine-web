import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileActions } from "@/components/site/MobileActions";
import { site } from "@/config/site";
import { isProductionDeployment } from "@/config/publication";
import { getOpeningHoursSpecification } from "@/content/hours";
export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Namak Indian Restaurant & Bar | Modern Indian Dining in Dallas",
    template: "%s | Namak Dallas",
  },
  description:
    "Discover bold Indian cuisine, crafted cocktails, private dining, and warm hospitality at Namak on Greenville Avenue in Dallas.",
  alternates: { canonical: "/" },
  robots: { index: isProductionDeployment, follow: isProductionDeployment },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: "Namak Indian Restaurant & Bar",
    description: "Where spice becomes a story.",
    url: site.domain,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Namak Indian Restaurant & Bar — Where spice becomes a story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: "Where spice becomes a story.",
    images: ["/twitter-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    url: site.domain,
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
    openingHoursSpecification: getOpeningHoursSpecification(),
    sameAs: [site.social.instagram, site.social.facebook],
    menu: `${site.domain}/menu`,
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActions />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
