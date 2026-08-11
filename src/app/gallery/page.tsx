import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { galleryImageIds } from "@/content/menu-media";
import { getImageRecord } from "@/media/manifest";
import {
  getApprovedVenueImage,
  venueGallerySections,
} from "@/content/venue-media";
export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual preview of the Namak experience in Dallas.",
  alternates: { canonical: "/gallery" },
};
export default function Gallery() {
  return (
    <InteriorPage
      eyebrow="The gallery"
      title="Atmosphere, in fragments."
      intro="Light, color, fire, and the quiet details that shape an evening at Namak."
    >
      <nav className="gallery-filters" aria-label="Gallery sections">
        {[
          ...venueGallerySections,
          { id: "food", label: "Food", imageIds: galleryImageIds },
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-disabled={section.imageIds.length === 0 || undefined}
          >
            {section.label}
            {section.imageIds.length === 0 ? " · photography in review" : ""}
          </a>
        ))}
      </nav>
      {[
        ...venueGallerySections,
        { id: "food", label: "Food", imageIds: galleryImageIds },
      ].map((section) => (
        <section
          className="gallery-section section"
          id={section.id}
          key={section.id}
        >
          <div className="section-head">
            <div>
              <p className="eyebrow">The gallery</p>
              <h2>{section.label}</h2>
            </div>
          </div>
          {section.imageIds.length === 0 ? (
            <p className="gallery-review-note">
              Kitchen photography is being reviewed. We will publish it only
              when it meets the same quality and privacy standard as the rest of
              the gallery.
            </p>
          ) : (
            <div className="gallery-page">
              {section.imageIds.map((imageId, i) => {
                const media =
                  section.id === "food"
                    ? getImageRecord(imageId)
                    : getApprovedVenueImage(imageId);
                return (
                  <figure
                    key={imageId}
                    className={`gallery-shot shot-${(i % 3) + 1}`}
                  >
                    <MediaFrame aspectRatio={i % 3 === 1 ? 4 / 5 : 3 / 2}>
                      <ResponsiveImage media={media} />
                    </MediaFrame>
                    <figcaption>{media.alt}</figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </InteriorPage>
  );
}
