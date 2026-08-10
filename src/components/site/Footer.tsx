import Link from "next/link";
import { navigation, site } from "@/config/site";
import { hoursDisplay } from "@/content/hours";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-brand-lockup">
            <div className="footer-mark" aria-hidden="true">
              N
            </div>
            <p className="footer-label">Namak · Dallas</p>
          </div>
          <h2>
            Come hungry.
            <br />
            <em>Leave glowing.</em>
          </h2>
          <p className="footer-intro">
            Modern Indian dining, warm hospitality, and a table made for
            sharing.
          </p>
          <div className="social-links">
            <a
              href={site.social.instagram}
              aria-label="Follow Namak on Instagram"
              data-analytics-event="social_click"
              data-analytics-placement="footer-instagram"
            >
              Instagram ↗
            </a>
            <a
              href={site.social.facebook}
              aria-label="Follow Namak on Facebook"
              data-analytics-event="social_click"
              data-analytics-placement="footer-facebook"
            >
              Facebook ↗
            </a>
          </div>
        </div>
        <nav className="footer-explore" aria-label="Footer navigation">
          <h3>Explore</h3>
          {navigation.map((x) => (
            <Link key={x.href} href={x.href}>
              {x.label}
            </Link>
          ))}
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-visit">
          <h3>Visit</h3>
          <address>
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </address>
          <a
            className="footer-phone"
            href={site.phoneHref}
            data-analytics-event="call_click"
            data-analytics-placement="footer"
          >
            {site.phone}
          </a>
          <div className="footer-hours">
            {hoursDisplay.map((x) => (
              <p key={x.days}>
                <span>{x.days}</span>
                <span>{x.hours}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-secondary">
        <p>© {new Date().getFullYear()} Namak Indian Restaurant &amp; Bar</p>
        <nav aria-label="Legal and utility links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/accessibility">Accessibility</Link>
          <a href="#main">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
