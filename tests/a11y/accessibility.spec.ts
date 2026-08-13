import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/menu",
  "/bar",
  "/about",
  "/catering",
  "/gallery",
  "/visit",
  "/contact",
  "/privacy",
  "/accessibility",
];
const axeTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const path of routes) {
  test(`${path} has sound structure and no automated WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    const ids = await page
      .locator("[id]")
      .evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size).toBe(ids.length);
    const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("mobile navigation supports keyboard, Escape, focus return, and axe", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(axeTags).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("skip link reveals on focus and moves focus past the sticky header", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const box = await page.locator("#main").boundingBox();
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(0);
});

test("menu categories and gallery filters are keyboard operable", async ({
  page,
}) => {
  await page.goto("/menu");
  const menuCategory = page.locator(".category-nav a").first();
  const target = await menuCategory.getAttribute("href");
  await menuCategory.focus();
  await page.keyboard.press("Enter");
  expect(target).toMatch(/^#/);
  await expect(page.locator(target!)).toBeVisible();
  await page.goto("/gallery");
  const filter = page.locator(".gallery-filters a").nth(1);
  await filter.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#bar")).toBeVisible();
});

test("production state hides retained form and empty Kitchen content", async ({
  page,
}) => {
  await page.goto("/catering");
  await expect(page.locator("form, .catering-menu-selector")).toHaveCount(0);
  await page.goto("/gallery");
  await expect(page.locator("#kitchen")).toHaveCount(0);
});

test("meaningful production images have useful alt text", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const missing = await page.locator("main img").evaluateAll((images) =>
      images
        .filter((image) => !image.hasAttribute("aria-hidden"))
        .filter((image) => !image.getAttribute("alt")?.trim())
        .map((image) => image.getAttribute("src")),
    );
    expect(missing, `${route} has meaningful images without alt text`).toEqual(
      [],
    );
  }
});

test("key controls meet target size and focus remains visible", async ({
  page,
}) => {
  for (const route of ["/", "/menu", "/bar", "/gallery", "/visit"]) {
    await page.goto(route);
    const undersized = await page.locator("a, button").evaluateAll((controls) =>
      controls
        .filter((control) => {
          const rect = control.getBoundingClientRect();
          const style = getComputedStyle(control);
          return (
            (control as HTMLElement).offsetParent !== null &&
            style.display !== "none" &&
            rect.width > 0 &&
            rect.height > 0 &&
            (rect.width < 24 || rect.height < 24)
          );
        })
        .map(
          (control) =>
            control.textContent?.trim() || control.getAttribute("aria-label"),
        ),
    );
    expect(undersized, `${route} has undersized targets`).toEqual([]);
    const control = page.locator("main a, main button").first();
    if (await control.count()) {
      await control.focus();
      expect(
        await control.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        ),
      ).not.toBe("none");
    }
  }
});

test("all routes reflow at 320 CSS pixels without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `${route} overflows at 320px`,
    ).toBe(true);
  }
});

test("text spacing overrides do not clip or create horizontal overflow", async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    await page.addStyleTag({
      content: `* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }`,
    });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `${route} overflows with text spacing`,
    ).toBe(true);
  }
});

test("reduced motion removes animation, transition, and smooth scrolling", async ({
  page,
}) => {
  await page.goto("/");
  const values = await page
    .locator(".button")
    .first()
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animation: style.animationDuration,
        transition: style.transitionDuration,
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
      };
    });
  expect(values.animation).toBe("0s");
  expect(values.transition).toBe("0s");
  expect(values.scroll).toBe("auto");
});
