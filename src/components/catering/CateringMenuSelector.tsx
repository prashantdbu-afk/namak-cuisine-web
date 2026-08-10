"use client";

import { useMemo, useState } from "react";
import { cateringMenuGroups } from "@/content/catering";

export function CateringMenuSelector({
  defaultSelected = [],
}: {
  defaultSelected?: string[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(
    defaultSelected.slice(0, 10),
  );
  const [needsHelp, setNeedsHelp] = useState(false);
  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return cateringMenuGroups;
    return cateringMenuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.name.toLowerCase().includes(needle),
        ),
      }))
      .filter((group) => group.items.length);
  }, [query]);

  function toggle(id: string) {
    setNeedsHelp(false);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((candidate) => candidate !== id)
        : current.length < 10
          ? [...current, id]
          : current,
    );
  }

  return (
    <div className="catering-menu-selector">
      <div className="menu-selector-tools">
        <label>
          <span className="sr-only">Search menu items</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu items"
          />
        </label>
        <span aria-live="polite">{selected.length} of 10 selected</span>
        <button
          type="button"
          onClick={() => setSelected([])}
          disabled={!selected.length}
        >
          Clear all
        </button>
      </div>
      <label className="menu-help-choice">
        <input
          type="checkbox"
          name="needsMenuHelp"
          value="true"
          checked={needsHelp}
          onChange={(event) => {
            setNeedsHelp(event.target.checked);
            if (event.target.checked) setSelected([]);
          }}
        />
        <span>Not sure yet — please help me choose</span>
      </label>
      <div className="menu-selector-list">
        {visibleGroups.map((group) => (
          <fieldset key={group.id}>
            <legend>{group.name}</legend>
            <div>
              {group.items.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    name="menuItemIds"
                    value={item.id}
                    checked={selected.includes(item.id)}
                    disabled={
                      !selected.includes(item.id) && selected.length >= 10
                    }
                    onChange={() => toggle(item.id)}
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {!visibleGroups.length && <p>No food-menu items match your search.</p>}
      </div>
    </div>
  );
}
