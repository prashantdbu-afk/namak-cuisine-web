import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getImageRecord } from "@/media/manifest";
import { integrations } from "@/config/integrations";
import { site } from "@/config/site";
import { announcement, approvedReviews } from "@/content/home";
import { hoursDisplay } from "@/content/hours";
import { foodMenuItems } from "@/content/menu";
import { RestaurantMap } from "@/components/site/RestaurantMap";
import { OpenStatus } from "@/components/site/OpenStatus";
import { getMapConfiguration } from "@/config/map";
import { homepageFoodFeatures } from "@/content/menu-media";
import { CateringCelebrationMotif } from "@/components/catering/CateringCelebrationMotif";
import { getApprovedVenueImage, venuePlacements } from "@/content/venue-media";
import { VenueGalleryCard } from "@/components/gallery/VenueGalleryCard";

const featuredDishes = homepageFoodFeatures.map((feature) => {
  const dish = foodMenuItems.find((item) => item.name === feature.name);
  if (!dish) throw new Error(`Published menu item not found: ${feature.name}`);
  return { dish, imageId: feature.imageId };
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
        <div className="hero-media hero-food-mosaic">
          <MediaFrame aspectRatio={5 / 4} className="hero-food-primary">
            <ResponsiveImage
              media={getImageRecord(homepageFoodFeatures[1].imageId)}
              priority
            />
          </MediaFrame>
          <MediaFrame aspectRatio={1} className="hero-food-secondary">
            <ResponsiveImage
              media={getImageRecord(homepageFoodFeatures[0].imageId)}
            />
          </MediaFrame>
          <MediaFrame aspectRatio={1} className="hero-food-tertiary">
            <ResponsiveImage
              media={getImageRecord(homepageFoodFeatures[3].imageId)}
            />
          </MediaFrame>
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
          {featuredDishes.map(({ dish, imageId }, index) => (
            <article className="dish-card" key={dish.id}>
              <MediaFrame aspectRatio={4 / 3} className="dish-card-media">
                <ResponsiveImage media={getImageRecord(imageId)} />
              </MediaFrame>
              <span className="dish-number" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{dish.name}</h3>
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
        <MediaFrame aspectRatio={4 / 3} className="media-editorial">
          <ResponsiveImage
            media={getApprovedVenueImage(venuePlacements.homepageExperience)}
          />
        </MediaFrame>
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
          <MediaFrame aspectRatio={5 / 3} className="home-bar-image">
            <ResponsiveImage
              media={getApprovedVenueImage(venuePlacements.homepageBar)}
            />
          </MediaFrame>
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
          {venuePlacements.homepageGallery.map((imageId) => (
            <VenueGalleryCard
              key={imageId}
              imageId={imageId}
              className="venue-preview-card"
            />
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

      <section className="home-catering section">
        <CateringCelebrationMotif />
        <div>
          <p className="eyebrow">Catering &amp; Events</p>
          <h2>Bring Namak to your next gathering.</h2>
          <p>
            From office events and milestone celebrations to wedding functions
            and cultural gatherings, tell us about your plans and the menu
            experience you have in mind.
          </p>
        </div>
        <div className="button-row">
          <Link className="button" href="/catering">
            Explore Catering
          </Link>
          <a className="button button-quiet" href={site.phoneHref}>
            Call Our Team
          </a>
        </div>
      </section>

      <section className="visit section">
        <div className="visit-copy">
          <p className="eyebrow">Visit Namak</p>
          <h2>Your table on Greenville Avenue.</h2>
        </div>
        <RestaurantMap configuration={getMapConfiguration()} />
      </section>
    </>
  );
}
