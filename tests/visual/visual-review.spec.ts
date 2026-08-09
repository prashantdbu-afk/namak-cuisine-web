import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const outputDirectory = path.resolve("visual-review");
const routes = [
  ["home", "/"],
  ["menu", "/menu"],
  ["bar", "/bar"],
  ["about", "/about"],
  ["gallery", "/gallery"],
  ["private-dining", "/private-dining"],
  ["visit", "/visit"],
  ["contact", "/contact"],
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
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

test.beforeAll(async () => {
  await mkdir(outputDirectory, { recursive: true });
});

test("captures every review route and viewport", async ({ page }) => {
  for (const [viewportName, viewport] of viewports) {
    await page.setViewportSize(viewport);
    for (const [routeName, route] of routes) {
      await page.goto(route);
      await revealPage(page);
      const pageWidth = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client);
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
                element.getAttribute("aria-label") ?? element.innerText.trim(),
            )
            .filter((label) => label !== "Skip to content"),
        );
        expect(undersizedTargets).toEqual([]);
      }
      await page.screenshot({
        path: path.join(outputDirectory, `${routeName}--${viewportName}.png`),
        fullPage: true,
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
