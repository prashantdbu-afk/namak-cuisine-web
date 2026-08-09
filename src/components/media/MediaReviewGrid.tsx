"use client";

import { useState } from "react";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import type { FoodProcessingRecord } from "@/media/food-processing-config";
import { getImageRecord } from "@/media/manifest";

const filters = [
  "All",
  "Approved",
  "Review",
  "Hold",
  "Reshoot",
  "Ivory Plate",
  "Indian Vessel",
  "Bread Basket",
  "Homepage",
  "Menu",
  "Gallery",
] as const;

export function MediaReviewGrid({
  records,
}: {
  records: FoodProcessingRecord[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = records.filter((record) => {
    if (filter === "All") return true;
    if (["Approved", "Review", "Hold", "Reshoot"].includes(filter))
      return record.status === filter.toLowerCase();
    if (["Ivory Plate", "Indian Vessel", "Bread Basket"].includes(filter))
      return record.styleFamily === filter.toLowerCase().replace(" ", "-");
    return record.uses.some((use) => use.startsWith(filter.toLowerCase()));
  });

  return (
    <>
      <div className="review-filters" aria-label="Media review filters">
        {filters.map((entry) => (
          <button
            key={entry}
            type="button"
            aria-pressed={filter === entry}
            onClick={() => setFilter(entry)}
          >
            {entry}
          </button>
        ))}
      </div>
      <div className="media-review-grid">
        {visible.map((record) => {
          const media = getImageRecord(record.imageId);
          return (
            <article className="media-review-card" key={record.imageId}>
              <MediaFrame
                aspectRatio={media.aspectRatio}
                className="review-full"
              >
                <ResponsiveImage media={media} />
              </MediaFrame>
              <div className="review-crops">
                <MediaFrame aspectRatio={4 / 3}>
                  <ResponsiveImage media={media} />
                </MediaFrame>
                <MediaFrame aspectRatio={3 / 2}>
                  <ResponsiveImage media={media} />
                </MediaFrame>
                <MediaFrame aspectRatio={4 / 5}>
                  <ResponsiveImage media={media} />
                </MediaFrame>
              </div>
              <div className="review-card-copy">
                <p className="eyebrow dark">
                  {record.status} · score {record.qualityScore}/5
                </p>
                <h2>{record.publicName}</h2>
                <dl>
                  <div>
                    <dt>Source</dt>
                    <dd>{record.sourceFilename}</dd>
                  </div>
                  <div>
                    <dt>Menu ID</dt>
                    <dd>{record.itemId ?? "Unmapped"}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{record.category}</dd>
                  </div>
                  <div>
                    <dt>Style</dt>
                    <dd>{record.styleFamily}</dd>
                  </div>
                  <div>
                    <dt>Dimensions</dt>
                    <dd>
                      {media.width} × {media.height} ·{" "}
                      {media.aspectRatio.toFixed(2)}:1
                    </dd>
                  </div>
                  <div>
                    <dt>Placements</dt>
                    <dd>{record.uses.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Rights</dt>
                    <dd>Approved</dd>
                  </div>
                  <div>
                    <dt>Notes</dt>
                    <dd>{record.notes}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
