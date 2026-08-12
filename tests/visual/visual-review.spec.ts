import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

const outputDirectory = path.resolve("visual-review");
const routes = [
  ["home", "/"],
  ["menu", "/menu"],
  ["bar", "/bar"],
  ["about", "/about"],
  ["gallery", "/gallery"],
  ["catering", "/catering"],
  ["visit", "/visit"],
  ["contact", "/contact"],
  ["media-review", "/media-review"],
  ["plating-review", "/media-review/plating"],
  ["menu-completeness", "/media-review/menu-completeness"],
  ["stock-review-bar", "/stock-review/bar"],
] as const;
const viewports = [
  ["desktop-1440x1000", { width: 1440, height: 1000 }],
  ["laptop-1280x800", { width: 1280, height: 800 }],
  ["mobile-390x844", { width: 390, height: 844 }],
  ["large-mobile-430x932", { width: 430, height: 932 }],
] as const;

async function revealPage(page: Page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function waitForImages(locator: Locator) {
  await expect
    .poll(() =>
      locator
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
}

test.beforeAll(async () => {
  await mkdir(outputDirectory, { recursive: true });
});

test("captures every review route and viewport", async ({ page }) => {
  test.setTimeout(240_000);
  for (const [viewportName, viewport] of viewports) {
    await page.setViewportSize(viewport);
    for (const [routeName, route] of routes) {
      await page.goto(route);
      if (routeName !== "plating-review") await revealPage(page);
      const pageWidth = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(
        pageWidth.scroll,
        `${routeName} at ${viewportName}`,
      ).toBeLessThanOrEqual(pageWidth.client);
      if (viewport.width <= 430) {
        const undersizedTargets = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("a, button, input")]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                rect.width > 0 &&
                rect.height > 0 &&
                (rect.width < 44 || rect.height < 44)
              );
            })
            .map(
              (element) =>
                element.getAttribute("aria-label") ||
                element.innerText.trim() ||
                `${element.tagName.toLowerCase()}[name="${element.getAttribute("name") ?? ""}"]`,
            )
            .filter((label) => label !== "Skip to content"),
        );
        expect(
          undersizedTargets,
          `${routeName} touch targets at ${viewportName}`,
        ).toEqual([]);
      }
      await page.screenshot({
        path: path.join(outputDirectory, `${routeName}--${viewportName}.png`),
        fullPage: routeName !== "plating-review",
        animations: "disabled",
      });
    }
  }
});

test("captures homepage review sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await revealPage(page);

  const sections = [
    ["hero", ".hero"],
    ["signature-menu", ".dishes"],
    ["bar", ".bar"],
    ["gallery", ".gallery"],
    ["visit", ".visit"],
    ["footer", ".footer"],
  ] as const;
  for (const [name, selector] of sections) {
    await page.locator(selector).screenshot({
      path: path.join(outputDirectory, `home-section--${name}.png`),
      animations: "disabled",
    });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".visit").scrollIntoViewIfNeeded();
  await page.locator(".visit").screenshot({
    path: path.join(outputDirectory, "home-section--visit-mobile.png"),
    animations: "disabled",
  });
});

test("captures homepage venue progression and Our Story deliverables", async ({
  page,
}) => {
  for (const [viewportName, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ] as const) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({
      content:
        ".site-header, .mobile-actions, .skip-link { display: none !important; }",
    });
    await revealPage(page);
    for (const [name, selector] of [
      ["hero", ".hero"],
      ["experience", ".experience"],
      ["bar", ".bar"],
      ["gallery", ".gallery"],
    ] as const) {
      const section = page.locator(selector);
      await waitForImages(section);
      await section.screenshot({
        path: path.join(
          outputDirectory,
          `homepage-placement-after--${name}--${viewportName}.png`,
        ),
        animations: "disabled",
      });
    }

    await page.goto("/about");
    await page.addStyleTag({
      content:
        ".site-header, .mobile-actions, .skip-link { display: none !important; }",
    });
    await revealPage(page);
    await page.screenshot({
      path: path.join(
        outputDirectory,
        `our-story-after--complete--${viewportName}.png`,
      ),
      fullPage: true,
      animations: "disabled",
    });
    for (const [name, selector] of [
      ["hero", ".about-hero"],
      ["passion", "#passion"],
      ["hospitality", "#hospitality"],
      ["dallas", "#dallas"],
      ["catering", "#catering"],
      ["cta", ".story-cta"],
    ] as const) {
      const section = page.locator(selector);
      await waitForImages(section);
      await section.screenshot({
        path: path.join(
          outputDirectory,
          `our-story-after--${name}--${viewportName}.png`,
        ),
        animations: "disabled",
      });
    }
  }
});

test("captures homepage hero fidelity at required viewports", async ({
  browser,
}) => {
  for (const scenario of [
    { name: "desktop-1440", width: 1440, height: 1000, dpr: 1 },
    { name: "desktop-1920", width: 1920, height: 1080, dpr: 1 },
    { name: "desktop-1440-dpr2", width: 1440, height: 1000, dpr: 2 },
    { name: "mobile-390", width: 390, height: 844, dpr: 1 },
    { name: "mobile-430", width: 430, height: 932, dpr: 1 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      deviceScaleFactor: scenario.dpr,
    });
    const heroPage = await context.newPage();
    await heroPage.goto("/");
    await heroPage.addStyleTag({
      content:
        ".site-header, .mobile-actions, .skip-link { display: none !important; }",
    });
    const hero = heroPage.locator(".hero");
    await waitForImages(hero);
    await hero.screenshot({
      path: path.join(
        outputDirectory,
        `homepage-hero-after--${scenario.name}.png`,
      ),
      animations: "disabled",
    });
    await context.close();
  }
});

test("captures aligned venue galleries at key breakpoints", async ({
  page,
}) => {
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["laptop", { width: 1280, height: 800 }],
    ["tablet", { width: 768, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ] as const) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({
      content:
        "header, .mobile-actions, .skip-link { display: none !important; }",
    });
    const preview = page.locator(".gallery");
    await preview.scrollIntoViewIfNeeded();
    await waitForImages(preview);
    await preview.screenshot({
      path: path.join(outputDirectory, `gallery-home-preview--${name}.png`),
      animations: "disabled",
    });
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/gallery");
  await page.addStyleTag({
    content:
      "header, .mobile-actions, .skip-link { display: none !important; }",
  });
  for (const id of ["restaurant", "bar", "exterior", "food"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await waitForImages(section);
    await section.screenshot({
      path: path.join(outputDirectory, `gallery-section--desktop--${id}.png`),
      animations: "disabled",
    });
  }

  await page.goto("/gallery");
  await page.addStyleTag({
    content:
      "header, .mobile-actions, .skip-link { display: none !important; }",
  });
  await page.locator("#restaurant .gallery-card").evaluateAll((cards) => {
    cards.slice(2).forEach((card) => card.remove());
    cards[0]?.parentElement?.classList.add("gallery-count-2");
  });
  await page.locator("#restaurant").screenshot({
    path: path.join(outputDirectory, "gallery-section--desktop--two-card.png"),
    animations: "disabled",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/gallery");
  await page.addStyleTag({
    content:
      "header, .mobile-actions, .skip-link { display: none !important; }",
  });
  await revealPage(page);
  await page.screenshot({
    path: path.join(outputDirectory, "gallery-complete--mobile.png"),
    fullPage: true,
    animations: "disabled",
  });
});

test("captures the refined footer and homepage transition", async ({
  page,
}) => {
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["tablet", { width: 768, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ] as const) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({
      content:
        ".site-header, .mobile-actions, .skip-link { display: none !important; }",
    });
    await page.locator(".footer").screenshot({
      path: path.join(outputDirectory, `home-footer--${name}.png`),
      animations: "disabled",
    });
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".visit").screenshot({
    path: path.join(outputDirectory, "home-footer--transition-desktop.png"),
    animations: "disabled",
  });
});

test("captures Catering and Events desktop and mobile states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/catering");
  await revealPage(page);
  await page.screenshot({
    path: path.join(outputDirectory, "catering--desktop-full.png"),
    fullPage: true,
    animations: "disabled",
  });
  for (const [name, selector] of [
    ["hero", ".catering-hero"],
    ["event-cards", ".catering-events"],
    ["menu-preference", ".catering-preferences"],
    ["process", ".catering-process"],
    ["form-empty", ".catering-form-section"],
    ["event-category", ".catering-field:has(#eventType)"],
    ["menu-selector", ".menu-interest-field"],
    ["disabled-provider", ".catering-disabled-fallback"],
    ["final-cta", ".catering-final-cta"],
  ] as const) {
    await page.locator(selector).screenshot({
      path: path.join(outputDirectory, `catering--desktop-${name}.png`),
      animations: "disabled",
    });
  }

  await page.goto("/catering?form-preview=error");
  await page.locator(".catering-form-card").screenshot({
    path: path.join(outputDirectory, "catering--desktop-validation-error.png"),
    animations: "disabled",
  });
  await page.goto("/catering?form-preview=success");
  await page.locator(".catering-form-card").screenshot({
    path: path.join(outputDirectory, "catering--desktop-success.png"),
    animations: "disabled",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catering");
  await revealPage(page);
  await page.screenshot({
    path: path.join(outputDirectory, "catering--mobile-full.png"),
    fullPage: true,
    animations: "disabled",
  });
  for (const [name, selector] of [
    ["hero", ".catering-hero"],
    ["event-cards", ".catering-events"],
    ["food-preference", ".meal-preference"],
    ["event-category", ".catering-field:has(#eventType)"],
    ["menu-selector", ".menu-interest-field"],
    ["submit", ".catering-submit-area"],
  ] as const) {
    await page.locator(selector).screenshot({
      path: path.join(outputDirectory, `catering--mobile-${name}.png`),
      animations: "disabled",
    });
  }
  await page.goto("/catering?form-preview=error");
  await page.locator(".catering-form-card").screenshot({
    path: path.join(outputDirectory, "catering--mobile-validation-error.png"),
    animations: "disabled",
  });
  await page.goto("/catering?form-preview=success");
  await page.locator(".catering-form-card").screenshot({
    path: path.join(outputDirectory, "catering--mobile-success.png"),
    animations: "disabled",
  });
});

test("captures visit map states", async ({ page }) => {
  await page.route("**/api/map/embed", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><style>html{background:#dfe8e3}</style><title>Map test frame</title>",
    }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/visit");
  const card = page.locator(".location-card");
  await card.screenshot({
    path: path.join(outputDirectory, "visit--desktop-no-key-fallback.png"),
    animations: "disabled",
  });
  await page.getByRole("button", { name: "View Interactive Map" }).click();
  await card.screenshot({
    path: path.join(outputDirectory, "visit--interactive-map.png"),
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Return to map preview" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await card.screenshot({
    path: path.join(outputDirectory, "visit--mobile-no-key-fallback.png"),
    animations: "disabled",
  });
});

test("captures menu search and mobile states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/menu");
  const search = page.getByRole("searchbox", { name: "Search dishes" });

  await search.fill("Butter");
  await expect(
    page.getByRole("heading", { name: "Butter Chicken" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(outputDirectory, "menu-state--search-results.png"),
    fullPage: true,
    animations: "disabled",
  });

  await search.fill("zzzz");
  await expect(page.getByText("No menu items match “zzzz”.")).toBeVisible();
  await page.screenshot({
    path: path.join(outputDirectory, "menu-state--no-results.png"),
    fullPage: true,
    animations: "disabled",
  });

  await search.fill("");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(
      outputDirectory,
      "menu-state--mobile-category-and-menu.png",
    ),
    fullPage: true,
    animations: "disabled",
  });
});

test("captures photographed menu categories for owner review", async ({
  page,
}) => {
  const desktopCategories = [
    "food-amuse-bouche",
    "food-soups",
    "food-embers-veg",
    "food-embers-non-veg",
    "food-veg-entrees",
    "food-non-veg-entrees",
    "food-indian-breads",
    "food-biryani-and-pulao",
  ];
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/menu");
  for (const id of desktopCategories) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await section.screenshot({
      path: path.join(outputDirectory, `menu-category--desktop--${id}.png`),
      animations: "disabled",
    });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    "food-amuse-bouche",
    "food-soups",
    "food-embers-veg",
    "food-non-veg-entrees",
    "food-indian-breads",
  ]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await section.screenshot({
      path: path.join(outputDirectory, `menu-category--mobile--${id}.png`),
      animations: "disabled",
    });
  }
});

test("captures plating compliance before and after evidence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/media-review/plating");
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await page
    .locator(".plating-review-card")
    .first()
    .screenshot({
      path: path.join(
        outputDirectory,
        "plating-before--mixed-vessel-reject.png",
      ),
      animations: "disabled",
    });
  await page.goto("/menu");
  await page.locator("#food-embers-veg").screenshot({
    path: path.join(
      outputDirectory,
      "plating-after--compliant-and-text-only.png",
    ),
    animations: "disabled",
  });
});
