"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import {
  MenuImageStage,
  type MenuImageStageSurface,
} from "@/components/menu/MenuImageStage";
import type { MenuMediaPlacement } from "@/content/menu-media";
import type { BarCategoryMedia } from "@/content/bar-media";
import type { MenuCategory, MenuItem } from "@/content/menu";
import { formatPrice } from "@/content/menu";
import { getMenuSectionEyebrow } from "@/content/menu-eyebrow";
import { getImageRecord } from "@/media/manifest";

function getMenuImageStageSurface(
  category: MenuCategory,
): MenuImageStageSurface {
  if (category.name === "INDIAN BREADS") return "bread";
  if (
    ["SOUPS", "VEG ENTREES", "NON-VEG ENTREES", "BIRYANI AND PULAO"].includes(
      category.name,
    )
  ) {
    return "main";
  }
  return "dry";
}

export function MenuExperience({
  categories,
  items,
  activeMenu,
  placements = [],
  categoryMedia = [],
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  activeMenu: "food" | "bar";
  placements?: MenuMediaPlacement[];
  categoryMedia?: BarCategoryMedia[];
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingItems = useMemo(
    () =>
      normalizedQuery
        ? items.filter((item) =>
            [item.name, item.description ?? "", ...(item.searchAliases ?? [])]
              .join(" ")
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          )
        : items,
    [items, normalizedQuery],
  );
  const visibleCategories = categories.filter((category) =>
    matchingItems.some((item) => item.categoryId === category.id),
  );

  return (
    <div className="menu-experience">
      <div className="menu-tools section">
        <nav className="menu-switcher" aria-label="Choose a menu">
          <Link
            aria-current={activeMenu === "food" ? "page" : undefined}
            href="/menu"
          >
            Food Menu
          </Link>
          <Link
            aria-current={activeMenu === "bar" ? "page" : undefined}
            href="/bar"
          >
            Bar &amp; Wine
          </Link>
        </nav>
        <div className="menu-search">
          <label htmlFor={`${activeMenu}-menu-search`}>
            Search {activeMenu === "food" ? "dishes" : "drinks and wine"}
          </label>
          <div>
            <input
              id={`${activeMenu}-menu-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                activeMenu === "food"
                  ? "Search by dish or description"
                  : "Search the bar and wine list"
              }
              autoComplete="off"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                Clear search
              </button>
            )}
          </div>
        </div>
        <nav className="category-nav" aria-label="Menu categories">
          {categories.map((category) => (
            <a key={category.id} href={`#${category.id}`}>
              {category.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="menu-sections section" aria-live="polite">
        {visibleCategories.map((category) => (
          <section
            id={category.id}
            key={category.id}
            aria-labelledby={`${category.id}-heading`}
          >
            {categoryMedia
              .filter((feature) => feature.categoryId === category.id)
              .map((feature) => (
                <figure
                  className="bar-category-feature"
                  data-category-image-id={feature.imageId}
                  key={feature.imageId}
                >
                  <MediaFrame aspectRatio={5 / 3}>
                    <ResponsiveImage
                      media={getImageRecord(feature.imageId)}
                      priority={false}
                      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 62vw, 760px"
                    />
                  </MediaFrame>
                  <figcaption className="visually-hidden">
                    {feature.label} editorial category image
                  </figcaption>
                </figure>
              ))}
            <p className="eyebrow dark">
              {getMenuSectionEyebrow(activeMenu, category)}
            </p>
            <h2 id={`${category.id}-heading`}>{category.name}</h2>
            <ul>
              {matchingItems
                .filter((entry) => entry.categoryId === category.id)
                .map((entry) => {
                  const placement = placements.find(
                    (candidate) => candidate.itemId === entry.id,
                  );
                  return (
                    <li key={entry.id}>
                      <article
                        className={`priced-menu-item${placement ? " has-menu-image" : ""}`}
                        data-menu-item-id={entry.id}
                        data-image-id={placement?.imageId}
                        data-background-family={placement?.backgroundFamily}
                        data-presentation-tier={placement?.presentationTier}
                      >
                        {placement && (
                          <MenuImageStage
                            media={getImageRecord(placement.imageId)}
                            surface={getMenuImageStageSurface(category)}
                          />
                        )}
                        <div className="menu-item-copy">
                          <h3>{entry.name}</h3>
                          {entry.description && <p>{entry.description}</p>}
                        </div>
                        {entry.priceCents !== null && (
                          <span className="menu-price">
                            {formatPrice(entry.priceCents)}
                          </span>
                        )}
                        {entry.variants && (
                          <ul
                            className="menu-variants"
                            aria-label={`${entry.name} sizes`}
                          >
                            {entry.variants.map((choice) => (
                              <li key={choice.label}>
                                <span>{choice.label}</span>
                                <span className="menu-price">
                                  {formatPrice(choice.priceCents)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
        {matchingItems.length === 0 && (
          <div className="menu-empty">
            <h2>No menu items match “{query}”.</h2>
            <p>Try another name or return to the full menu.</p>
            <button
              className="button button-dark"
              type="button"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </div>
        )}
        <p className="menu-disclaimer">
          Menu items, prices, and availability are subject to change.
        </p>
      </div>
    </div>
  );
}
