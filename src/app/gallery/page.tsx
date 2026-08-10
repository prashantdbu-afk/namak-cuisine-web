import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { galleryImageIds } from "@/content/menu-media";
import { getImageRecord } from "@/media/manifest";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata("gallery");
export default function Gallery() {
  return (
    <>
      <PageBreadcrumb name="Gallery" path="/gallery" />
      <InteriorPage
        eyebrow="The gallery"
        title="Atmosphere, in fragments."
        intro="Light, color, fire, and the quiet details that shape an evening at Namak on Greenville Avenue in Dallas."
      >
        <section className="gallery-page section">
          {galleryImageIds.map((imageId, i) => {
            const media = getImageRecord(imageId);
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
        </section>
      </InteriorPage>
    </>
  );
}
