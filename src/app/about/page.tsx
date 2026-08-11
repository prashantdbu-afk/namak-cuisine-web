import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { about } from "@/content/about";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getApprovedVenueImage, venuePlacements } from "@/content/venue-media";
export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about the point of view behind Namak Indian Restaurant & Bar.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <InteriorPage
      eyebrow={about.eyebrow}
      title={about.title}
      intro={about.body}
    >
      <section className="venue-story section" aria-label="Inside Namak">
        {venuePlacements.about.map((imageId, index) => (
          <figure key={imageId}>
            <MediaFrame aspectRatio={index === 0 ? 3 / 2 : 4 / 3}>
              <ResponsiveImage media={getApprovedVenueImage(imageId)} />
            </MediaFrame>
            <figcaption>{getApprovedVenueImage(imageId).alt}</figcaption>
          </figure>
        ))}
      </section>
    </InteriorPage>
  );
}
