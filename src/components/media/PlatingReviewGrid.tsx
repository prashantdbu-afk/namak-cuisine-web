"use client";

import { useState } from "react";
import Image from "next/image";
import { publicMenuMediaPlacements } from "@/content/menu-media";
import type { FoodProcessingRecord } from "@/media/food-processing-config";

const filters = [
  "All",
  "Pass",
  "Temporary",
  "Reject",
  "Ivory Coupe",
  "Charcoal Kadhai",
  "Bread Basket",
  "Currently Public but Noncompliant",
  "Needs Reshoot",
  "Needs Controlled Editing",
] as const;

export function PlatingReviewGrid({
  records,
}: {
  records: FoodProcessingRecord[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const publicIds = new Set(
    publicMenuMediaPlacements.map((placement) => placement.imageId),
  );
  const visible = records.filter((record) => {
    if (filter === "All") return true;
    if (["Pass", "Temporary", "Reject"].includes(filter))
      return record.visualCompliance === filter.toLowerCase();
    if (["Ivory Coupe", "Charcoal Kadhai", "Bread Basket"].includes(filter))
      return (
        record.targetPlateSystem === filter.toLowerCase().replace(" ", "-")
      );
    if (filter === "Currently Public but Noncompliant")
      return (
        publicIds.has(record.imageId) && record.visualCompliance !== "pass"
      );
    if (filter === "Needs Reshoot")
      return (
        record.visualCompliance !== "pass" &&
        record.replacementRecommendation.toLowerCase().includes("reshoot")
      );
    return (
      record.visualCompliance === "temporary" &&
      !record.replacementRecommendation.toLowerCase().includes("reshoot")
    );
  });

  return (
    <>
      <div className="review-filters" aria-label="Plating review filters">
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
      <p className="review-result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "photograph" : "photographs"}
      </p>
      {visible.length === 0 ? (
        <div className="menu-empty plating-review-empty">
          <h2>No photographs match this filter.</h2>
          <p>There are no public photographs with unresolved compliance.</p>
        </div>
      ) : (
        <div className="media-review-grid plating-review-grid">
          {visible.map((record) => (
            <article
              className="media-review-card plating-review-card"
              data-compliance={record.visualCompliance}
              data-menu-eligible={record.menuEligible}
              data-public={publicIds.has(record.imageId)}
              data-target-system={record.targetPlateSystem}
              key={record.imageId}
            >
              <div className="plating-review-image">
                <Image
                  src={`/media/review/menu/${record.imageId}-original.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 42vw"
                />
              </div>
              <div className="review-card-copy">
                <p className="eyebrow dark">
                  {record.visualCompliance} · {record.targetPlateSystem}
                </p>
                <h2>{record.publicName}</h2>
                <p>{record.sourceFilename}</p>
                <dl>
                  <div>
                    <dt>Category</dt>
                    <dd>{record.category}</dd>
                  </div>
                  <div>
                    <dt>Actual vessel</dt>
                    <dd>{record.actualVisiblePlate}</dd>
                  </div>
                  <div>
                    <dt>Background</dt>
                    <dd>{record.actualBackground}</dd>
                  </div>
                  <div>
                    <dt>Camera angle</dt>
                    <dd>{record.actualCameraAngle}</dd>
                  </div>
                  <div>
                    <dt>Lighting</dt>
                    <dd>{record.actualLightingStyle}</dd>
                  </div>
                  <div>
                    <dt>Target system</dt>
                    <dd>{record.targetPlateSystem}</dd>
                  </div>
                  <div>
                    <dt>Public menu eligible</dt>
                    <dd>
                      {record.menuEligible && record.visualCompliance === "pass"
                        ? "Yes"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt>Audit reason</dt>
                    <dd>{record.complianceReason}</dd>
                  </div>
                  <div>
                    <dt>Recommended setup</dt>
                    <dd>{record.replacementRecommendation}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
