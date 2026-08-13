import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import type { ImageRecord } from "@/media/types";

export type MenuImageStageSurface = "dry" | "main" | "bread";

export function MenuImageStage({
  media,
  surface,
}: {
  media: ImageRecord;
  surface: MenuImageStageSurface;
}) {
  return (
    <div
      className="menu-food-image menu-image-stage"
      data-menu-image-stage
      data-stage-surface={surface}
    >
      <ResponsiveImage media={media} priority={false} />
    </div>
  );
}
