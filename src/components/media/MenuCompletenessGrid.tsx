import Image from "next/image";
import { formatPrice, menuItems } from "@/content/menu";
import {
  getMenuImagePresentationTier,
  publicMenuMediaPlacements,
} from "@/content/menu-media";
import { foodProcessingConfig } from "@/media/food-processing-config";
import { getImageRecord } from "@/media/manifest";

const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
const publicImageIds = new Set(
  publicMenuMediaPlacements.map((placement) => placement.imageId),
);

export function MenuCompletenessGrid() {
  const foodRecords = foodProcessingConfig.filter((record) =>
    record.imageId.startsWith("food-"),
  );

  return (
    <div className="menu-completeness-grid">
      {foodRecords.map((record) => {
        const item = record.itemId
          ? menuItemById.get(record.itemId)
          : undefined;
        const media = getImageRecord(record.imageId);
        const visible = publicImageIds.has(record.imageId);
        const tier = getMenuImagePresentationTier(record);
        const heldReason = !visible
          ? record.itemId === null
            ? record.notes
            : media.rightsStatus !== "approved"
              ? "Media rights are not approved."
              : !media.productionReady
                ? "Media is not technically production ready."
                : "The mapped menu item could not be confirmed."
          : null;

        return (
          <article
            className="menu-completeness-card"
            data-visible={visible ? "yes" : "no"}
            key={record.imageId}
          >
            <div className="menu-completeness-images">
              <figure>
                <div className="menu-completeness-image">
                  <Image
                    src={`/media/review/menu/${record.imageId}-original.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, 22vw"
                  />
                </div>
                <figcaption>Owner source</figcaption>
              </figure>
              <figure>
                <div className="menu-completeness-image final-rendering">
                  {visible ? (
                    <Image
                      src={media.source}
                      alt=""
                      fill
                      sizes="(max-width: 760px) 100vw, 22vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: `${media.focalPoint?.x ? media.focalPoint.x * 100 : 50}% ${media.focalPoint?.y ? media.focalPoint.y * 100 : 50}%`,
                      }}
                    />
                  ) : (
                    <span>Held from menu</span>
                  )}
                </div>
                <figcaption>Final menu rendering</figcaption>
              </figure>
            </div>
            <div className="menu-completeness-copy">
              <p className="eyebrow dark">
                {visible ? `Visible · ${tier}` : "Held"}
              </p>
              <h2>{item?.name ?? record.publicName}</h2>
              {item?.description && <p>{item.description}</p>}
              {item?.priceCents !== null && item?.priceCents !== undefined && (
                <strong>{formatPrice(item.priceCents)}</strong>
              )}
              <dl>
                <div>
                  <dt>Source</dt>
                  <dd>{record.sourceFilename}</dd>
                </div>
                <div>
                  <dt>Image ID</dt>
                  <dd>{record.imageId}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{record.category}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{visible ? "Public menu" : heldReason}</dd>
                </div>
              </dl>
            </div>
          </article>
        );
      })}
    </div>
  );
}
