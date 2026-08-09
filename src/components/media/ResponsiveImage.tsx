import Image from "next/image";
import { resolveImage } from "@/media/resolve-media";
import type { ImageRecord } from "@/media/types";

export function ResponsiveImage({
  media,
  className,
}: {
  media: ImageRecord;
  className?: string;
}) {
  if (!media.width || !media.height || !media.aspectRatio)
    throw new Error(`Media ${media.id} requires stable dimensions.`);
  if (!media.decorative && !media.alt.trim())
    throw new Error(`Meaningful media ${media.id} requires alt text.`);
  const position = media.focalPoint
    ? `${media.focalPoint.x}% ${media.focalPoint.y}%`
    : "50% 50%";
  return (
    <Image
      className={className}
      src={resolveImage(media)}
      width={media.width}
      height={media.height}
      alt={media.decorative ? "" : media.alt}
      sizes={media.sizes}
      priority={media.priority === true}
      loading={media.priority ? "eager" : "lazy"}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
}
