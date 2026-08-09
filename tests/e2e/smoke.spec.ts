import { test, expect } from "@playwright/test";
test("homepage presents primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /modern indian dining, made for sharing/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /explore menu/i }).first(),
  ).toHaveAttribute("href", "/menu");
});
test("food menu is searchable, priced, and source-clean", async ({ page }) => {
  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { name: "Built in layers." }),
  ).toBeVisible();
  const main = page.locator("main");
  await expect(main.getByText("Bharwan Paneer Tikka")).toBeVisible();
  const search = main.getByRole("searchbox", { name: "Search dishes" });
  await search.fill("butter CHICKEN");
  await expect(main.getByText("Butter Chicken")).toBeVisible();
  await expect(main.getByText("Bharwan Paneer Tikka")).toBeHidden();
  await main.getByRole("button", { name: "Clear search" }).click();
  await expect(main.getByText("Bharwan Paneer Tikka")).toBeVisible();
  await expect(main.getByText("Buratta Bomb")).toBeVisible();
  await expect(main.getByText("$6.50").first()).toBeVisible();
  await expect(main).toContainText("$22");
  await expect(main).not.toContainText(
    /\bToast\b|Grubhub|DoorDash|Uber Eats|owner approval|placeholder|details forthcoming|source confidence/i,
  );
  await expect(main.getByRole("link", { name: "Bar & Wine" })).toHaveAttribute(
    "href",
    "/bar",
  );
  const formerlyMissing = [
    "Bhutte Ke Kebab",
    "Burrata Chaat",
    "Chapli Smash Burger",
    "Cheese Naan",
    "Bhatti Da Kukarh",
    "Lamb Seekh Kebab",
    "Garlic Naan",
    "Hara Bhara Kebab",
    "Chicken Korma",
    "Chicken Tikka Masala",
    "Prawn Mango Curry",
    "Raw Mango Salad",
    "Tandoori Roti",
    "Veg Dum Biryani",
  ];
  for (const name of formerlyMissing) {
    const article = main.locator(".priced-menu-item", { hasText: name });
    await expect(article.locator("img")).toHaveCount(1);
  }
  await expect(
    main.locator('[data-image-id="food-jhol-momo-non-veg"]'),
  ).toContainText("Jhol Momo");
  await expect(
    main.locator('[data-image-id="food-tandoori-full"]'),
  ).toContainText("Tandoori Chicken");
});

test("food image cards preserve responsive minimums, prices, and overflow", async ({
  page,
}) => {
  await page.goto("/menu");
  const card = page.locator(".has-menu-image").first();
  const image = card.locator(".menu-food-image");
  const width = await image.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  expect(width).toBeGreaterThanOrEqual(112);
  await expect(card.locator(".menu-price").first()).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
test("bar menu search and beer variants work", async ({ page }) => {
  await page.goto("/bar");
  const main = page.locator("main");
  await expect(main.getByText("Taj Mahal")).toBeVisible();
  await expect(main.getByText("330ml")).toBeVisible();
  await expect(main.getByText("650ml")).toBeVisible();
  const search = main.getByRole("searchbox", {
    name: "Search drinks and wine",
  });
  await search.fill("Ramirana");
  await expect(main.getByText("Ramirana Syrah Blend, Chile")).toBeVisible();
  await expect(main.getByText("Taj Mahal")).toBeHidden();
  await expect(main.getByRole("link", { name: "Food Menu" })).toHaveAttribute(
    "href",
    "/menu",
  );
  await search.fill("");
  await expect(main.locator(".bar-category-feature")).toHaveCount(11);
  await expect(main.locator(".priced-menu-item img")).toHaveCount(0);
  await expect(main).not.toContainText(/pexels\.com|images\.pexels/i);
});

test("bar stock review is private, noindex, and compares all candidates", async ({
  page,
}) => {
  await page.goto("/stock-review/bar");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator(".stock-review-slot")).toHaveCount(12);
  await expect(page.locator(".stock-candidate")).toHaveCount(36);
  await expect(page.getByText("Recommended", { exact: true })).toHaveCount(12);
});
test("media review is private, noindex, and contains every supplied record", async ({
  page,
}) => {
  await page.goto("/media-review");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator(".media-review-card")).toHaveCount(45);
  await expect(
    page.getByText("Unidentified dessert", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Missing from public menu" }).click();
  await expect(page.locator(".media-review-card")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(
    /DoorDash|Grubhub|Toast|Uber Eats/i,
  );
});
test("visit shows verified information", async ({ page }) => {
  await page.goto("/visit");
  await expect(page.locator("main address")).toContainText(
    "5500 Greenville Ave",
  );
  await expect(page.locator("main").getByText("214-730-0047")).toBeVisible();
});
test("mobile menu and actions are accessible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await expect(toggle).toHaveAccessibleName("Menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("navigation", { name: "Quick actions" }),
  ).toBeVisible();
});
test("the initial page makes no unexpected third-party requests", async ({
  page,
}) => {
  const unexpected: string[] = [];
  page.on("request", (request) => {
    const host = new URL(request.url()).hostname;
    if (!["127.0.0.1", "localhost"].includes(host))
      unexpected.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(unexpected).toEqual([]);
});
