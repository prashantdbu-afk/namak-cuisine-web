import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { isMediaReviewAvailable } from "@/config/publication";
import { getImageRecord } from "@/media/manifest";
import { venueProcessingConfig } from "@/media/venue-processing-config";

export const metadata: Metadata = {
  title: "Venue media review",
  robots: { index: false, follow: false },
};

export default async function VenueMediaReview({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  if (!isMediaReviewAvailable()) notFound();
  const filters = await searchParams;
  const records = venueProcessingConfig.filter(
    (record) =>
      (!filters.category || record.category === filters.category) &&
      (!filters.status || record.status === filters.status),
  );
  const categories = [
    ...new Set(venueProcessingConfig.map((record) => record.category)),
  ];
  return (
    <main className="venue-review-page">
      <header className="interior-hero">
        <div>
          <p className="eyebrow">Internal · noindex</p>
          <h1>Venue media review.</h1>
          <p>
            All 43 supplied photographs, including review, hold, and reshoot
            decisions. This route is unavailable in production by default.
          </p>
        </div>
      </header>
      <nav className="gallery-filters" aria-label="Venue review filters">
        <Link href="/media-review/venue">All</Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/media-review/venue?category=${category}`}
          >
            {category}
          </Link>
        ))}
        {["approved", "review", "hold", "reject"].map((status) => (
          <Link key={status} href={`/media-review/venue?status=${status}`}>
            {status}
          </Link>
        ))}
      </nav>
      <section className="venue-review-grid">
        {records.map((record) => {
          const media = getImageRecord(record.imageId);
          return (
            <article className="venue-review-card" key={record.imageId}>
              <MediaFrame aspectRatio={4 / 3}>
                <ResponsiveImage media={media} />
              </MediaFrame>
              <div>
                <p className="eyebrow">
                  {record.status} · {record.category}
                </p>
                <h2>{record.imageId}</h2>
                <p>{record.sourceFilename}</p>
                <dl>
                  <div>
                    <dt>Quality</dt>
                    <dd>{record.qualityScore}/5</dd>
                  </div>
                  <div>
                    <dt>People</dt>
                    <dd>{record.peopleApproval}</dd>
                  </div>
                  <div>
                    <dt>Sensitive</dt>
                    <dd>
                      {record.sensitiveInformationFound
                        ? record.sensitiveInformationNotes
                        : "None found"}
                    </dd>
                  </div>
                  <div>
                    <dt>Uses</dt>
                    <dd>{record.uses.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Decision</dt>
                    <dd>{record.reviewNotes}</dd>
                  </div>
                  <div>
                    <dt>Reshoot</dt>
                    <dd>{record.visualAudit.reshootRecommendation}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
