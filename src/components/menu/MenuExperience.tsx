"use client";

import { useMemo, useState } from "react";
import type { MenuCategory, PublicMenuItem } from "@/content/menu";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getImageRecord } from "@/media/manifest";

export function MenuExperience({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: PublicMenuItem[];
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingItems = useMemo(
    () =>
      normalizedQuery
        ? items.filter((item) =>
            item.displayName.toLocaleLowerCase().includes(normalizedQuery),
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
        <div className="menu-search">
          <label htmlFor="menu-search">Search dishes</label>
          <div>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by dish name"
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
            <p className="eyebrow dark">Namak menu</p>
            <h2 id={`${category.id}-heading`}>{category.name}</h2>
            <ul>
              {matchingItems
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <li key={item.id}>
                    <article
                      className={
                        item.image ? "menu-item-with-image" : undefined
                      }
                    >
                      {item.image && (
                        <MediaFrame
                          aspectRatio={4 / 3}
                          className="menu-thumbnail"
                        >
                          <ResponsiveImage
                            media={getImageRecord(item.image.mediaId)}
                          />
                        </MediaFrame>
                      )}
                      <div>
                        <h3>{item.displayName}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                    </article>
                  </li>
                ))}
            </ul>
          </section>
        ))}
        {matchingItems.length === 0 && (
          <div className="menu-empty">
            <h2>No dishes match “{query}”.</h2>
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
      </div>
    </div>
  );
}
