import type { Metadata } from "next";
import Link from "next/link";
import { CateringCelebrationMotif } from "@/components/catering/CateringCelebrationMotif";
import { CateringInquiryForm } from "@/components/catering/CateringInquiryForm";
import { RevealOnScroll } from "@/components/catering/RevealOnScroll";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import {
  cateringEventCards,
  cateringMediaIds,
  cateringMealOptions,
} from "@/content/catering";
import { site } from "@/config/site";
import { getCateringFormConfiguration } from "@/lib/catering/submit";
import { getImageRecord } from "@/media/manifest";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { FaqSection } from "@/components/seo/FaqSection";
import { cateringFaqs } from "@/content/faqs";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("catering");

export default async function CateringPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const preview =
    process.env.VERCEL_ENV !== "production" &&
    (query["form-preview"] === "success" || query["form-preview"] === "error")
      ? query["form-preview"]
      : undefined;
  const form = getCateringFormConfiguration();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Indian catering and event inquiries",
    provider: {
      "@type": "Restaurant",
      name: site.name,
      url: site.domain,
    },
    url: `${site.domain}/catering`,
  };
  return (
    <div className="catering-page">
      <PageBreadcrumb name="Catering" path="/catering" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="catering-hero">
        <CateringCelebrationMotif className="motif-hero" />
        <RevealOnScroll className="catering-hero-copy">
          <p className="eyebrow">Catering &amp; Events</p>
          <h1>Bring Namak to your gathering.</h1>
          <p className="lead">
            From office lunches and milestone celebrations to weddings, cultural
            functions, and family gatherings, share a few details and our team
            will help you explore the Indian catering experience you have in
            mind for your Dallas-area event.
          </p>
          <div className="button-row">
            <a className="button" href="#catering-inquiry">
              Start a Catering Inquiry
            </a>
            <a
              className="button button-quiet"
              href={site.phoneHref}
              data-analytics-event="call_click"
              data-analytics-placement="catering-hero"
            >
              Call Our Team
            </a>
          </div>
          <p className="catering-support-line">
            Vegetarian, non-vegetarian, and mixed menu preferences welcome.
          </p>
        </RevealOnScroll>
        <RevealOnScroll className="catering-hero-media" delay={70}>
          <MediaFrame aspectRatio={16 / 10}>
            <ResponsiveImage
              media={getImageRecord(cateringMediaIds.hero)}
              priority
            />
          </MediaFrame>
        </RevealOnScroll>
      </section>

      <section
        className="catering-events section"
        aria-labelledby="event-types-title"
      >
        <div className="section-head catering-section-head">
          <div>
            <p className="eyebrow">Occasions of every kind</p>
            <h2 id="event-types-title">Room for every kind of occasion.</h2>
          </div>
          <p>
            Share the shape of your event and we’ll begin the conversation from
            there.
          </p>
        </div>
        <div className="catering-event-grid">
          {cateringEventCards.map((card, index) => (
            <RevealOnScroll key={card.title} delay={index * 65}>
              <article className="catering-event-card">
                <MediaFrame aspectRatio={4 / 3}>
                  <ResponsiveImage media={getImageRecord(card.imageId)} />
                </MediaFrame>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section
        className="catering-preferences"
        aria-labelledby="preference-title"
      >
        <CateringCelebrationMotif />
        <div className="catering-preference-copy">
          <p className="eyebrow">Menu preferences</p>
          <h2 id="preference-title">A menu shaped around your event.</h2>
          <p>
            Tell us whether you are interested in a vegetarian, non-vegetarian,
            or mixed menu. You may also select a few dishes from the current
            Namak menu to help our team understand your preferences.
          </p>
        </div>
        <div className="catering-preference-grid">
          {cateringMealOptions.map((option, index) => (
            <RevealOnScroll key={option.value} delay={index * 65}>
              <article>
                <span aria-hidden="true">
                  {index === 0 ? "◇" : index === 1 ? "△" : "○"}
                </span>
                <h3>{option.label}</h3>
                <p>Choose this preference in the inquiry form below.</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section
        className="catering-process section"
        aria-labelledby="process-title"
      >
        <div className="catering-process-intro">
          <p className="eyebrow">Simple from the start</p>
          <h2 id="process-title">Three steps to begin.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <h3>Tell us about the event.</h3>
          </li>
          <li>
            <span>02</span>
            <h3>Share your guest count and menu preferences.</h3>
          </li>
          <li>
            <span>03</span>
            <h3>
              The Namak team contacts you to discuss options, availability,
              service details, and catering pricing.
            </h3>
          </li>
        </ol>
      </section>

      <section
        className="catering-form-section section"
        id="catering-inquiry"
        aria-labelledby="inquiry-title"
      >
        <CateringCelebrationMotif className="motif-form" />
        <div className="catering-form-heading">
          <p className="eyebrow">Catering inquiry</p>
          <h2 id="inquiry-title">Tell us about your event.</h2>
          <p>
            Share a few details so our team can understand the occasion, guest
            count, and menu preferences.
          </p>
        </div>
        <RevealOnScroll className="catering-form-card">
          <CateringInquiryForm
            mode={form.mode}
            externalUrl={form.externalUrl}
            previewState={preview}
          />
        </RevealOnScroll>
      </section>

      <FaqSection title="Catering questions." faqs={cateringFaqs} />

      <section className="catering-final-cta">
        <CateringCelebrationMotif />
        <div>
          <p className="eyebrow">Prefer a conversation?</p>
          <h2>Call our team directly.</h2>
          <p>
            We’ll be glad to hear about your plans and help you understand the
            next step.
          </p>
        </div>
        <div className="button-row">
          <a
            className="button button-light"
            href={site.phoneHref}
            data-analytics-event="call_click"
            data-analytics-placement="catering-final"
          >
            Call {site.phone}
          </a>
          <Link className="text-link" href="/menu">
            View the current menu <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
