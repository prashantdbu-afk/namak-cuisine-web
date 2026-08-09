"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MenuCategory, MenuItem } from "@/content/menu";
import { formatPrice } from "@/content/menu";

export function MenuExperience({
  categories,
  items,
  activeMenu,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  activeMenu: "food" | "bar";
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
            <p className="eyebrow dark">
              {activeMenu === "food" ? "Namak menu" : "WINE LIST"}
            </p>
            <h2 id={`${category.id}-heading`}>{category.name}</h2>
            <ul>
              {matchingItems
                .filter((entry) => entry.categoryId === category.id)
                .map((entry) => (
                  <li key={entry.id}>
                    <article className="priced-menu-item">
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
                ))}
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
