import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { getMapConfiguration } from "@/config/map";
import { RestaurantMap } from "@/components/site/RestaurantMap";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getApprovedVenueImage, venuePlacements } from "@/content/venue-media";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Visit",
  description:
    "Hours, address, phone, and directions for Namak Indian Restaurant & Bar in Dallas.",
  alternates: { canonical: "/visit" },
};
export default function Visit() {
  return (
    <InteriorPage
      eyebrow="Visit Namak"
      title="We’ll meet you on Greenville."
      intro="Everything verified for planning your visit is collected below."
    >
      <section
        className="visit-photos section"
        aria-label="Exterior and entrance"
      >
        {venuePlacements.visit.map((imageId) => (
          <MediaFrame aspectRatio={3 / 2} key={imageId}>
            <ResponsiveImage media={getApprovedVenueImage(imageId)} />
          </MediaFrame>
        ))}
      </section>
      <section className="visit-page section">
        <RestaurantMap configuration={getMapConfiguration()} />
      </section>
    </InteriorPage>
  );
}
