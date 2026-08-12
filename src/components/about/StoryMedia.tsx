import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getApprovedVenueImage } from "@/content/venue-media";
import { getImageRecord } from "@/media/manifest";

export function StoryMedia({
  imageId,
  imageKind,
  editorialLabel,
  priority = false,
}: {
  imageId: string;
  imageKind: "venue" | "food";
  editorialLabel?: string;
  priority?: boolean;
}) {
  const media =
    imageKind === "venue"
      ? getApprovedVenueImage(imageId)
      : getImageRecord(imageId);

  return (
    <figure className="story-media">
      <MediaFrame aspectRatio={4 / 3} className="story-media-frame">
        <ResponsiveImage
          media={media}
          priority={priority}
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </MediaFrame>
      {editorialLabel ? <figcaption>{editorialLabel}</figcaption> : null}
    </figure>
  );
}
