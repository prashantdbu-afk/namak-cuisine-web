import Link from "next/link";
import { navigation, site } from "@/config/site";
import { hoursDisplay } from "@/content/hours";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">N</div>
      <div>
        <p className="eyebrow">Namak · Dallas</p>
        <h2>
          Come hungry.
          <br />
          <em>Leave glowing.</em>
        </h2>
        <div className="social-links">
          <a
            href={site.social.instagram}
            aria-label="Follow Namak on Instagram"
          >
            Instagram ↗
          </a>
          <a href={site.social.facebook} aria-label="Follow Namak on Facebook">
            Facebook ↗
          </a>
        </div>
      </div>
      <div>
        <h3>Explore</h3>
        {navigation.map((x) => (
          <Link key={x.href} href={x.href}>
            {x.label}
          </Link>
        ))}
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/accessibility">Accessibility</Link>
      </div>
      <div>
        <h3>Visit</h3>
        <address>
          {site.address.street}
          <br />
          {site.address.city}, {site.address.region} {site.address.postalCode}
        </address>
        <a href={site.phoneHref}>{site.phone}</a>
        {hoursDisplay.map((x) => (
          <p key={x.days}>
            {x.days}
            <br />
            {x.hours}
          </p>
        ))}
      </div>
    </footer>
  );
}
