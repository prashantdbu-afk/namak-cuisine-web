import Link from "next/link";
import { integrations } from "@/config/integrations";
import { site } from "@/config/site";
import { announcement, approvedReviews, gallery } from "@/content/home";
import { hoursDisplay } from "@/content/hours";
import { publishedMenuItems } from "@/content/menu";
import { MapPreview } from "@/components/site/MapPreview";
import { OpenStatus } from "@/components/site/OpenStatus";

const featuredDishNames = [
  "Bharwan Paneer Tikka",
  "Butter Chicken",
  "Burrata Bomb",
  "Dal Makhani",
];

const featuredDishes = featuredDishNames.map((name) => {
  const dish = publishedMenuItems.find((item) => item.displayName === name);
  if (!dish) throw new Error(`Published menu item not found: ${name}`);
  return dish;
});

export function HomePage() {
  return (
    <>
      {announcement.enabled && (
        <div className="announcement">{announcement.text}</div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Namak · Indian Restaurant &amp; Bar</p>
          <h1>Modern Indian dining, made for sharing.</h1>
          <p className="hero-lede">
            Tandoor specialties, layered curries, distinctive cocktails, and
            warm hospitality on Greenville Avenue.
          </p>
          <div className="button-row">
            <Link className="button" href="/menu">
              Explore menu
            </Link>
            <a className="button button-quiet" href={site.phoneHref}>
              Call to reserve
            </a>
          </div>
        </div>
        <div
          className="hero-media media-placeholder media-hero"
          aria-hidden="true"
        >
          <span>Food, color, and the table at Namak</span>
        </div>
      </section>

      <section className="welcome-strip" aria-label="Visit at a glance">
        <OpenStatus />
        <div>
          <span className="strip-label">Find us</span>
          <strong>{site.address.street}</strong>
        </div>
        <div>
          <span className="strip-label">Hours today</span>
          <strong>{hoursDisplay[0].hours}</strong>
        </div>
        <a className="text-link" href={site.directionsUrl}>
          Get directions <span aria-hidden>↗</span>
        </a>
      </section>

      <section className="dishes section">
        <div className="section-head">
          <div>
            <p className="eyebrow">From the menu</p>
            <h2>Signature dishes, ready for the table.</h2>
          </div>
          <Link className="text-link" href="/menu">
            View the full menu <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="dish-grid">
          {featuredDishes.map((dish, index) => (
            <article className="dish-card" key={dish.id}>
              <span className="dish-number" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{dish.displayName}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="experience section">
        <div className="experience-copy">
          <p className="eyebrow">The Namak experience</p>
          <h2>Contemporary Indian hospitality, grounded in warmth.</h2>
          <p className="lead">
            Come for a generous meal and settle into the evening. Our dining
            room brings together expressive cooking, considered service, and the
            ease of sharing a table.
          </p>
          <Link className="button button-quiet" href="/about">
            Our story
          </Link>
        </div>
        <div className="media-placeholder media-editorial" aria-hidden="true">
          <span>Interior &amp; hospitality</span>
        </div>
      </section>

      {integrations.features.bar && (
        <section className="bar section">
          <div>
            <p className="eyebrow">Friday &amp; Saturday evenings</p>
            <h2>Cocktails, conversation, and a longer evening.</h2>
            <p>
              Distinctive pours and a relaxed bar rhythm carry the table into
              the night, with Namak open until midnight Friday and Saturday.
            </p>
            <Link className="button button-light" href="/bar">
              Explore the bar
            </Link>
          </div>
          <div className="media-placeholder media-cocktail" aria-hidden="true">
            <span>Cocktails after dark</span>
          </div>
        </section>
      )}

      <section className="gallery section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Around the restaurant</p>
            <h2>Food, hospitality, and the room between.</h2>
          </div>
          <Link className="text-link" href="/gallery">
            View gallery <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="gallery-grid">
          {gallery.map((label, index) => (
            <figure key={label} className={`gallery-shot shot-${index + 1}`}>
              <div className="media-placeholder" aria-hidden />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {integrations.features.reviews && approvedReviews.length > 0 && (
        <section aria-label="Guest reviews">
          {approvedReviews.map((review) => (
            <blockquote key={review.quote}>
              {review.quote}
              <cite>{review.source}</cite>
            </blockquote>
          ))}
        </section>
      )}

      <section className="visit section">
        <div className="visit-copy">
          <p className="eyebrow">Visit Namak</p>
          <h2>Your table on Greenville Avenue.</h2>
          <OpenStatus />
          <address>
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </address>
          <a className="text-link" href={site.phoneHref}>
            {site.phone}
          </a>
        </div>
        <div className="hours">
          {hoursDisplay.map((entry) => (
            <div key={entry.days}>
              <strong>{entry.days}</strong>
              <span>{entry.hours}</span>
            </div>
          ))}
          <a className="button" href={site.directionsUrl}>
            Get directions
          </a>
        </div>
        <MapPreview />
      </section>
    </>
  );
}
