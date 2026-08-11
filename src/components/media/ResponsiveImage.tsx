import Image from "next/image";
import { resolveImage } from "@/media/resolve-media";
import type { ImageRecord } from "@/media/types";

export type ResponsiveImageProps = {
  media: ImageRecord;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 75 | 85 | 90;
  fetchPriority?: "high" | "low" | "auto";
  objectFit?: "cover" | "contain";
  objectPosition?: string;
};

export function ResponsiveImage({
  media,
  className,
  priority,
  sizes,
  quality,
  fetchPriority,
  objectFit = "cover",
  objectPosition,
}: ResponsiveImageProps) {
  if (!media.width || !media.height || !media.aspectRatio)
    throw new Error(`Media ${media.id} requires stable dimensions.`);
  if (!media.decorative && !media.alt.trim())
    throw new Error(`Meaningful media ${media.id} requires alt text.`);
  const position =
    objectPosition ??
    (media.focalPoint
      ? `${media.focalPoint.x <= 1 ? media.focalPoint.x * 100 : media.focalPoint.x}% ${media.focalPoint.y <= 1 ? media.focalPoint.y * 100 : media.focalPoint.y}%`
      : "50% 50%");
  const shouldPrioritize = priority ?? media.priority === true;
  return (
    <Image
      className={className}
      src={resolveImage(media)}
      width={media.width}
      height={media.height}
      alt={media.decorative ? "" : media.alt}
      sizes={sizes ?? media.sizes}
      quality={quality}
      priority={shouldPrioritize}
      loading={shouldPrioritize ? "eager" : "lazy"}
      fetchPriority={fetchPriority}
      style={{ objectFit, objectPosition: position }}
    />
  );
}
