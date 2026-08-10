import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { analyticsEvents, isValidGa4Id, isValidGtmId } from "@/lib/analytics";
import { navigation, site } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Marketing Dashboard | Namak Internal" },
  description: "Development-only SEO and marketing readiness dashboard.",
  robots: { index: false, follow: false, noarchive: true },
};

function Status({ ready }: { ready: boolean }) {
  return (
    <span className={ready ? "dashboard-ready" : "dashboard-pending"}>
      {ready ? "Configured" : "Action needed"}
    </span>
  );
}

export default function MarketingDashboard() {
  if (process.env.VERCEL_ENV === "production") notFound();
  const gaReady = isValidGa4Id(process.env.NEXT_PUBLIC_GA4_ID);
  const gtmReady = isValidGtmId(process.env.NEXT_PUBLIC_GTM_ID);
  const searchConsoleReady = Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  );
  return (
    <div className="marketing-dashboard">
      <header>
        <p className="eyebrow">Development only · noindex</p>
        <h1>Marketing readiness.</h1>
        <p>
          A concise operational view of Namak’s search, analytics, local
          listing, and conversion foundations.
        </p>
      </header>
      <section aria-labelledby="configuration-title">
        <h2 id="configuration-title">Configuration</h2>
        <div className="dashboard-grid">
          <article>
            <h3>Google Analytics 4</h3>
            <Status ready={gaReady} />
            <p>Environment key: NEXT_PUBLIC_GA4_ID</p>
          </article>
          <article>
            <h3>Google Tag Manager</h3>
            <Status ready={gtmReady} />
            <p>Optional environment key: NEXT_PUBLIC_GTM_ID</p>
          </article>
          <article>
            <h3>Google Search Console</h3>
            <Status ready={searchConsoleReady} />
            <p>Verification meta tag plus DNS and sitemap submission.</p>
          </article>
        </div>
      </section>
      <section aria-labelledby="technical-title">
        <h2 id="technical-title">Technical SEO</h2>
        <ul className="dashboard-link-list">
          <li>
            <a href="/sitemap.xml">Open sitemap.xml</a>
          </li>
          <li>
            <a href="/robots.txt">Open robots.txt</a>
          </li>
          <li>Restaurant schema: sitewide</li>
          <li>Breadcrumb schema: all interior public pages</li>
          <li>FAQ schema: Visit and Catering</li>
        </ul>
      </section>
      <section aria-labelledby="events-title">
        <h2 id="events-title">Analytics events</h2>
        <ul className="dashboard-event-list">
          {analyticsEvents.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="links-title">
        <h2 id="links-title">Public routes and social links</h2>
        <div className="dashboard-columns">
          <nav aria-label="Dashboard public routes">
            <Link href="/">Home</Link>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact">Contact</Link>
          </nav>
          <div>
            <a href={site.social.instagram}>Instagram</a>
            <a href={site.social.facebook}>Facebook</a>
            <a href={site.directionsUrl}>Google Maps directions</a>
          </div>
        </div>
      </section>
      <section aria-labelledby="manual-title">
        <h2 id="manual-title">Manual launch work</h2>
        <ul>
          <li>Confirm GA4 property and optional GTM container ownership.</li>
          <li>Verify Search Console by DNS and submit the sitemap.</li>
          <li>
            Complete Google Business Profile and directory consistency checks.
          </li>
          <li>
            Review Maps, reservation, social, hours, and review workflows before
            launch.
          </li>
        </ul>
      </section>
      <section aria-labelledby="business-title">
        <h2 id="business-title">Google Business checklist</h2>
        <ul>
          {[
            "Website, menu, bar, and catering URLs",
            "Address, phone, regular hours, and special hours",
            "Primary and secondary categories",
            "Business description and service attributes",
            "Exterior, interior, food, bar, and catering photos",
            "Reservation and social links",
          ].map((item) => (
            <li key={item}>□ {item}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="directory-title">
        <h2 id="directory-title">Directory consistency checklist</h2>
        <p>Confirm name, address, phone, website, and hours on:</p>
        <ul className="dashboard-event-list">
          {[
            "Google",
            "Apple",
            "Bing",
            "Yelp",
            "DoorDash",
            "Uber Eats",
            "Grubhub",
            "OpenTable",
            "Facebook",
            "Instagram",
            "MapQuest",
            "Restaurant Guru",
            "Roadtrippers",
          ].map((directory) => (
            <li key={directory}>{directory}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
