import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getApprovedVenueImage } from "@/content/venue-media";
import { getImageRecord } from "@/media/manifest";

export type VenueGalleryCardProps = {
  imageId: string;
  caption?: string;
  aspectRatio?: number;
  priority?: boolean;
  source?: "venue" | "general";
  className?: string;
};

export function VenueGalleryCard({
  imageId,
  caption,
  aspectRatio = 4 / 3,
  priority = false,
  source = "venue",
  className = "",
}: VenueGalleryCardProps) {
  const media =
    source === "venue"
      ? getApprovedVenueImage(imageId)
      : getImageRecord(imageId);
  const visibleCaption = caption ?? media.displayCaption;

  if (!visibleCaption)
    throw new Error(`Gallery media requires a display caption: ${imageId}`);

  return (
    <figure
      className={`gallery-card ${className}`.trim()}
      data-image-id={imageId}
      data-gallery-aspect-ratio={aspectRatio === 4 / 3 ? "4:3" : aspectRatio}
    >
      <MediaFrame aspectRatio={aspectRatio} className="gallery-card-media">
        <ResponsiveImage media={media} priority={priority} />
      </MediaFrame>
      <figcaption>{visibleCaption}</figcaption>
    </figure>
  );
}
