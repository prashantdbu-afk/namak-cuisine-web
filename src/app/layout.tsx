import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AnalyticsEvents } from "@/components/analytics/AnalyticsEvents";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileActions } from "@/components/site/MobileActions";
import { site } from "@/config/site";
import { isProductionDeployment } from "@/config/publication";
import { getOpeningHoursSpecification } from "@/content/hours";
import { getAnalyticsConfig } from "@/config/analytics";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
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
    description: "Modern Indian dining, made for sharing.",
    url: site.domain,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Namak Indian Restaurant & Bar — Modern Indian dining, made for sharing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: "Modern Indian dining, made for sharing.",
    images: ["/twitter-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const analytics = getAnalyticsConfig();
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
      <body className={geist.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileActions />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {analytics.enabled && analytics.measurementId ? (
          <>
            <AnalyticsEvents />
            <GoogleAnalytics gaId={analytics.measurementId} />
          </>
        ) : null}
      </body>
    </html>
  );
}
