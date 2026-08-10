"use client";

import { useState } from "react";
import Image from "next/image";
import type { FoodProcessingRecord } from "@/media/food-processing-config";
import { getImageRecord } from "@/media/manifest";
import { publicMenuMediaPlacements } from "@/content/menu-media";
import processingReport from "../../../docs/food-media-processing-report.json";

const filters = [
  "All",
  "Missing from public menu",
  "Approved and visible",
  "Review",
  "Hold",
  "Duplicate warning",
  "Ivory Coupe",
  "Charcoal Kadhai",
  "Bread Basket",
] as const;

export function MediaReviewGrid({
  records,
}: {
  records: FoodProcessingRecord[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const publicImageIds = new Set(
    publicMenuMediaPlacements.map((placement) => placement.imageId),
  );
  const duplicateIds = new Set(
    processingReport.nearDuplicates.flatMap(([left, right]) => [left, right]),
  );
  const visible = records.filter((record) => {
    if (filter === "All") return true;
    if (filter === "Missing from public menu")
      return (
        record.status === "approved" &&
        record.itemId !== null &&
        record.uses.includes("menu-feature") &&
        !publicImageIds.has(record.imageId)
      );
    if (filter === "Approved and visible")
      return record.status === "approved" && publicImageIds.has(record.imageId);
    if (filter === "Duplicate warning") return duplicateIds.has(record.imageId);
    if (["Review", "Hold"].includes(filter))
      return record.status === filter.toLowerCase();
    if (["Ivory Coupe", "Charcoal Kadhai", "Bread Basket"].includes(filter))
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
          const reportRecord = processingReport.records.find(
            (entry) => entry.imageId === record.imageId,
          );
          const base = `/media/review/menu/${record.imageId}`;
          return (
            <article className="media-review-card" key={record.imageId}>
              <div className="review-comparison">
                {[
                  ["Original source", `${base}-original.webp`],
                  ["Previous processing", `${base}-current.webp`],
                  ["Enhanced master", media.source],
                  ["Desktop menu crop", `${base}-menu.webp`],
                  ["Mobile menu crop", `${base}-mobile.webp`],
                ].map(([label, source]) => (
                  <figure key={label}>
                    <div className="review-comparison-image">
                      <Image
                        src={source}
                        alt=""
                        fill
                        sizes="(max-width: 760px) 100vw, 28vw"
                      />
                    </div>
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
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
                    <dt>Public</dt>
                    <dd>{publicImageIds.has(record.imageId) ? "Yes" : "No"}</dd>
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
                    <dt>Enhancement</dt>
                    <dd>
                      B {record.brightness.toFixed(3)} · S{" "}
                      {record.saturation.toFixed(3)} · C{" "}
                      {record.contrast.toFixed(3)} · γ {record.gamma.toFixed(2)}{" "}
                      · sharpen {record.sharpenSigma.toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt>Duplicate</dt>
                    <dd>
                      {duplicateIds.has(record.imageId)
                        ? "Review warning"
                        : "None"}
                    </dd>
                  </div>
                  <div>
                    <dt>Quality</dt>
                    <dd>
                      {reportRecord
                        ? `${reportRecord.before.meanLuminance} → ${reportRecord.after.meanLuminance} luminance`
                        : "Pending preparation"}
                    </dd>
                  </div>
                  <div>
                    <dt>Notes</dt>
                    <dd>
                      {record.enhancementNotes} {record.notes}
                    </dd>
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
