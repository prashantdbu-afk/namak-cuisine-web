import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileActions } from "@/components/site/MobileActions";
import { site } from "@/config/site";
import { isProductionDeployment } from "@/config/publication";
import { getOpeningHoursSpecification } from "@/content/hours";
import {
  Analytics,
  GoogleTagManagerNoScript,
} from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { createRestaurantSchema } from "@/lib/seo";
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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = createRestaurantSchema(getOpeningHoursSpecification());
  return (
    <html lang="en">
      <body className={geist.variable}>
        <GoogleTagManagerNoScript />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActions />
        <JsonLd data={jsonLd} />
        <Analytics />
      </body>
    </html>
  );
}
