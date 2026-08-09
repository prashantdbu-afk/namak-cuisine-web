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
test("menu is searchable, price-free, and source-clean", async ({ page }) => {
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
  await expect(main).not.toContainText("$");
  await expect(main).not.toContainText(
    /Toast|Grubhub|DoorDash|Uber Eats|owner approval|placeholder|details forthcoming|source confidence/i,
  );
  await expect(main.locator("img")).toHaveCount(0);
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
