import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { galleryImageIds } from "@/content/menu-media";
import { getImageRecord } from "@/media/manifest";
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
  );
}
