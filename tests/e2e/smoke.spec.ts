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

test("homepage venue preview uses equal 4:3 cards and dedicated captions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const cards = page.locator(".gallery-grid .gallery-card");
  await expect(cards).toHaveCount(3);
  const presentation = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const frame = element.querySelector(".gallery-card-media");
      const image = element.querySelector("img");
      const caption = element.querySelector("figcaption");
      const box = element.getBoundingClientRect();
      const frameBox = frame?.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        ratio: frameBox ? frameBox.width / frameBox.height : 0,
        caption: caption?.textContent?.trim(),
        alt: image?.getAttribute("alt"),
        fit: image ? getComputedStyle(image).objectFit : "missing",
      };
    }),
  );

  expect(new Set(presentation.map(({ width }) => Math.round(width))).size).toBe(
    1,
  );
  expect(
    new Set(presentation.map(({ height }) => Math.round(height))).size,
  ).toBe(1);
  for (const card of presentation) {
    expect(card.ratio).toBeCloseTo(4 / 3, 2);
    expect(card.fit).toBe("cover");
    expect(card.caption).toBeTruthy();
    expect(card.caption).not.toBe(card.alt);
  }
});

test("homepage hero serves placement-sized sources without stretching", async ({
  browser,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Runs explicit DPR contexts once.",
  );

  for (const scenario of [
    { width: 1440, height: 1000, dpr: 1 },
    { width: 1440, height: 1000, dpr: 2 },
    { width: 1920, height: 1080, dpr: 1 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      deviceScaleFactor: scenario.dpr,
    });
    const heroPage = await context.newPage();
    await heroPage.addInitScript(() => {
      (window as Window & { __heroLayoutShift?: number }).__heroLayoutShift = 0;
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) {
            (
              window as Window & { __heroLayoutShift?: number }
            ).__heroLayoutShift! += shift.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await heroPage.goto("/");

    const primary = heroPage.locator(".hero-venue-primary");
    const supports = heroPage.locator(".hero-food-support");
    await expect(primary.locator("img")).toHaveJSProperty("complete", true);
    await expect(supports).toHaveCount(2);
    await expect(supports.nth(0).locator("img")).toHaveJSProperty(
      "complete",
      true,
    );
    await expect(supports.nth(1).locator("img")).toHaveJSProperty(
      "complete",
      true,
    );

    const delivery = await heroPage
      .locator(".hero-media-grid")
      .evaluate((grid) => {
        const readFrame = (frame: Element) => {
          const frameBox = frame.getBoundingClientRect();
          const image = frame.querySelector("img") as HTMLImageElement;
          const imageBox = image.getBoundingClientRect();
          const source = new URL(image.currentSrc);
          return {
            frameWidth: frameBox.width,
            frameHeight: frameBox.height,
            imageWidth: imageBox.width,
            imageHeight: imageBox.height,
            requestedWidth: Number(source.searchParams.get("w")),
            requestedQuality: Number(source.searchParams.get("q")),
            fit: getComputedStyle(image).objectFit,
          };
        };
        return {
          gridWidth: grid.getBoundingClientRect().width,
          primary: readFrame(grid.querySelector(".hero-venue-primary")!),
          supporting: [...grid.querySelectorAll(".hero-food-support")].map(
            readFrame,
          ),
        };
      });

    expect(delivery.gridWidth).toBeLessThanOrEqual(861);
    expect(
      delivery.primary.frameWidth / delivery.primary.frameHeight,
    ).toBeCloseTo(16 / 10, 2);
    expect(delivery.primary.imageWidth).toBeCloseTo(
      delivery.primary.frameWidth,
      0,
    );
    expect(delivery.primary.imageHeight).toBeCloseTo(
      delivery.primary.frameHeight,
      0,
    );
    expect(delivery.primary.fit).toBe("cover");
    expect(delivery.primary.requestedWidth).toBeGreaterThan(210);
    expect(delivery.primary.requestedWidth).toBeGreaterThanOrEqual(
      delivery.primary.frameWidth * scenario.dpr * 0.9,
    );
    expect(delivery.primary.requestedQuality).toBe(90);
    for (const support of delivery.supporting) {
      expect(support.frameWidth / support.frameHeight).toBeCloseTo(5 / 3, 2);
      expect(support.imageWidth).toBeCloseTo(support.frameWidth, 0);
      expect(support.imageHeight).toBeCloseTo(support.frameHeight, 0);
      expect(support.fit).toBe("cover");
      expect(support.requestedWidth).toBeGreaterThan(210);
      expect(support.requestedWidth).toBeGreaterThanOrEqual(
        support.frameWidth * scenario.dpr * 0.9,
      );
      expect(support.requestedQuality).toBe(85);
    }
    await heroPage.waitForTimeout(500);
    expect(
      await heroPage.evaluate(
        () =>
          (window as Window & { __heroLayoutShift?: number })
            .__heroLayoutShift ?? 0,
      ),
    ).toBeLessThanOrEqual(0.1);
    expect(
      await heroPage.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(0);
    await context.close();
  }
});

test("mobile hero keeps the venue first and food supports readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const primary = page.locator(".hero-venue-primary");
  const supports = page.locator(".hero-food-support");
  await expect(primary).toBeVisible();
  await expect(supports).toHaveCount(2);
  const layout = await page.locator(".hero-media-grid").evaluate((grid) => {
    const primaryBox = grid
      .querySelector(".hero-venue-primary")!
      .getBoundingClientRect();
    const supportBoxes = [...grid.querySelectorAll(".hero-food-support")].map(
      (element) => element.getBoundingClientRect(),
    );
    return {
      primaryHeight: primaryBox.height,
      supportsShareRow:
        Math.round(supportBoxes[0].top) === Math.round(supportBoxes[1].top),
    };
  });
  expect(layout.primaryHeight).toBeLessThan(844);
  expect(layout.supportsShareRow).toBe(true);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(0);
});

test("gallery grid adapts from three to two to one column without overflow", async ({
  page,
}) => {
  for (const [width, expectedColumns] of [
    [1440, 3],
    [768, 2],
    [390, 1],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/gallery");
    const cards = page.locator("#restaurant .gallery-card");
    await expect(cards).toHaveCount(6);
    const layout = await cards.evaluateAll((elements) => {
      const rows = new Set(
        elements.map((element) =>
          Math.round(element.getBoundingClientRect().top),
        ),
      );
      const firstFrame = elements[0]?.querySelector(".gallery-card-media");
      const firstFrameBox = firstFrame?.getBoundingClientRect();
      return {
        columns: Math.round(elements.length / rows.size),
        ratio: firstFrameBox ? firstFrameBox.width / firstFrameBox.height : 0,
      };
    });
    expect(layout.columns).toBe(expectedColumns);
    expect(layout.ratio).toBeCloseTo(4 / 3, 2);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(0);
  }
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
  const restoredPhotographs = [
    "Jhol Momo",
    "Tandoori Chicken",
    "Bhutte Ke Kebab",
    "Burrata Chaat",
    "Chapli Smash Burger",
    "Cheese Naan",
    "Bhatti Da Kukarh",
    "Lamb Seekh Kebab",
    "Garlic Naan",
    "Hara Bhara Kebab",
    "Hyderabadi Chicken Dum Biryani",
    "Chicken Korma",
    "Chicken Tikka Masala",
    "Chicken Vindaloo",
    "Prawn Mango Curry",
    "Coriander Prawns",
    "Raw Mango Salad",
    "Saag Burrata",
    "Tandoori Paneer Makhani",
    "Tandoori Roti",
    "Veg Dum Biryani",
    "Pindi Chole",
  ];
  for (const name of restoredPhotographs) {
    const article = main.locator(".priced-menu-item", { hasText: name });
    await expect(article).toBeVisible();
    await expect(article.locator(".menu-price").first()).toBeVisible();
    await expect(article.locator(".menu-food-image img")).toHaveCount(1);
  }
  await expect(
    main.locator('[data-image-id="food-jhol-momo-non-veg"]'),
  ).toHaveCount(1);
  await expect(
    main.locator('[data-image-id="food-tandoori-full"]'),
  ).toHaveCount(1);
  await expect(
    main.locator('[data-image-id="food-bharwan-paneer-tikka"]'),
  ).toHaveCount(1);
  await expect(
    main.locator('[data-image-id="food-bhutte-ke-kebab"]'),
  ).toHaveCount(1);
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
  const presentation = await image.evaluate((element) => {
    const imageElement = element.querySelector("img");
    const frame = element.getBoundingClientRect();
    return {
      ratio: frame.width / frame.height,
      fit: imageElement ? getComputedStyle(imageElement).objectFit : "missing",
      complete:
        imageElement instanceof HTMLImageElement
          ? imageElement.complete && imageElement.naturalWidth > 0
          : false,
    };
  });
  expect(presentation.ratio).toBeCloseTo(5 / 3, 1);
  expect(presentation.fit).toBe("cover");
  expect(presentation.complete).toBe(true);
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
  await expect(main.locator(".bar-category-feature")).toHaveCount(0);
  await expect(main.locator(".priced-menu-item img")).toHaveCount(0);
  await expect(main).not.toContainText(/pexels\.com|images\.pexels/i);
  for (const id of ["bar-draft-beer", "bar-whiskey", "bar-gin"]) {
    await expect(page.locator(`#${id} .eyebrow`)).toHaveText("NAMAK BAR MENU");
  }
  await expect(page.locator("#bar-wines-by-the-glass .eyebrow")).toHaveText(
    "WINES BY THE GLASS",
  );
  for (const id of ["bar-bubbles", "bar-white", "bar-red"]) {
    await expect(page.locator(`#${id} .eyebrow`)).toHaveText("WINE LIST");
  }
});

test("internal review routes and assets return 404", async ({ page }) => {
  for (const path of [
    "/media-review",
    "/media-review/plating",
    "/media-review/menu-completeness",
    "/media-review/venue",
    "/stock-review/bar",
    "/media/review/menu/food-butter-chicken-original.webp",
    "/media/review/venue/venue-kitchen-wide-01-natural.webp",
  ]) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(404);
  }
});
test("visit shows verified information", async ({ page }) => {
  await page.route("**/api/map/embed", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Map test frame</title>",
    }),
  );
  await page.goto("/visit");
  await expect(page.locator("main address")).toContainText(
    "5500 Greenville Ave",
  );
  await expect(page.locator("main").getByText("214-730-0047")).toBeVisible();
  const directions = page.getByRole("link", { name: "Get Directions" });
  await expect(directions).toHaveAttribute(
    "href",
    "https://www.google.com/maps/dir/?api=1&destination=5500+Greenville+Ave+%23600%2C+Dallas%2C+TX+75206",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  const interactiveMap = page.getByRole("button", {
    name: "View Interactive Map",
  });
  if (await interactiveMap.isVisible()) {
    await interactiveMap.click();
    await expect(page.locator("iframe")).toHaveCount(1);
  }
  await expect(page.locator("main")).not.toContainText(
    /Reveal location details|map unavailable|⌖/i,
  );
});

test("visit fallback has touch-safe controls and no horizontal overflow", async ({
  page,
}) => {
  await page.goto("/visit");
  const controls = page.locator(
    ".location-actions a, .location-actions button",
  );
  for (let index = 0; index < (await controls.count()); index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("privacy explains deliberate interactive map loading", async ({
  page,
}) => {
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "Google Maps" }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(
    "loads only after you choose “View Interactive Map.”",
  );
});

test("visit remains useful without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/visit", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main address")).toContainText(
    "5500 Greenville Ave #600, Dallas, TX 75206",
  );
  await expect(
    page.getByRole("link", { name: "Get Directions" }),
  ).toBeVisible();
  await expect(
    page.locator("main").getByText("Sunday–Thursday", { exact: true }),
  ).toBeVisible();
  await context.close();
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
  await page.goto("/", { waitUntil: "load" });
  // Observe briefly after load without depending on absolute network silence;
  // Next image optimization can keep first-party requests active in slower CI.
  await page.waitForTimeout(1_000);
  expect(unexpected).toEqual([]);
});

test("catering navigation, route, copy, and media are public and source-clean", async ({
  page,
  request,
}) => {
  await page.goto("/catering");
  await expect(page).toHaveTitle(/Indian Catering in Dallas/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://namakcuisine.com/catering",
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Bring Namak to your gathering.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Corporate & Office" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Weddings & Celebrations" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Cultural, Religious & Family Gatherings",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A menu shaped around your event." }),
  ).toBeVisible();
  await expect(page.locator(".catering-process li")).toHaveCount(3);
  await expect(page.locator(".catering-page img")).toHaveCount(4);
  await expect(page.locator(".catering-page")).not.toContainText(
    /pexels\.com|unsplash\.com/,
  );
  await expect(page.locator(".catering-page")).not.toContainText(
    /DoorDash|Grubhub|Toast|Uber Eats/i,
  );
  await expect(page.getByText("Gather", { exact: true })).toHaveCount(0);
  const redirect = await request.get("/private-dining", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/catering");
});

test("catering launch page hides the future form and uses phone actions", async ({
  page,
}) => {
  await page.goto("/catering");
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator(".catering-inquiry-form")).toHaveCount(0);
  await expect(page.locator(".catering-menu-selector")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /submit|send/i })).toHaveCount(
    0,
  );
  await expect(page.getByText("Start a Catering Inquiry")).toHaveCount(0);
  await expect(
    page.getByText("Online inquiries are being prepared."),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Call Our Team" }),
  ).toHaveAttribute("href", "tel:+12147300047");
  await expect(
    page.getByRole("link", { name: "View the Menu" }),
  ).toHaveAttribute("href", "/menu");
  await expect(
    page.getByRole("heading", { name: "Let’s talk about your gathering." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Call 214-730-0047" }),
  ).toHaveAttribute("href", "tel:+12147300047");
  await expect(page.locator(".catering-process li")).toHaveText([
    /Call and tell us about your event/,
    /Share your date, guest count, location, and menu preferences/,
    /Our team discusses availability, menu options, service details, and catering pricing with you/,
  ]);
});

test("catering is usable on mobile without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catering");
  await expect(page.locator(".catering-form-section")).toHaveCount(0);
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
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
      ),
  );
  expect(undersizedTargets).toEqual([]);
});

test("gallery launch copy and public categories exclude empty Kitchen", async ({
  page,
}) => {
  await page.goto("/gallery");
  await expect(page).toHaveTitle(
    "Restaurant Gallery | Namak Indian Restaurant & Bar Dallas",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://namakcuisine.com/gallery",
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Come for the flavor. Stay for the warmth.",
    }),
  ).toBeVisible();
  await expect(page.locator(".gallery-filters a")).toHaveText([
    "Restaurant",
    "Bar",
    "Exterior",
    "Food",
  ]);
  for (const id of ["restaurant", "bar", "exterior", "food"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#kitchen")).toHaveCount(0);
  await expect(
    page.getByText(/photography in review|being reviewed/i),
  ).toHaveCount(0);
});

test("launch routes contain no customer-facing development language", async ({
  page,
}) => {
  const publicRoutes = [
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
  const developmentLanguage =
    /photography in review|being reviewed|owner approval|pending approval|review-only|production-ready|configuration required|online inquiries are being prepared|coming soon|Phase 1/i;

  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText(developmentLanguage);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test("homepage and footer expose Catering and no public Gather label", async ({
  page,
}) => {
  await page.goto("/");
  if ((page.viewportSize()?.width ?? 1000) <= 760)
    await page.locator(".menu-toggle").click();
  await expect(
    page.getByRole("heading", { name: "Bring Namak to your next gathering." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore Catering" }),
  ).toHaveAttribute("href", "/catering");
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Catering" }),
  ).toHaveAttribute("href", "/catering");
  await expect(
    page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link", { name: "Catering" }),
  ).toHaveAttribute("href", "/catering");
  await expect(page.getByText("Gather", { exact: true })).toHaveCount(0);
});

test("Our Story has complete SEO, narrative, media, and internal links", async ({
  page,
}) => {
  await page.goto("/about");

  await expect(page).toHaveTitle(
    "Our Story | Modern Indian Restaurant in Dallas | Namak",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Discover Namak on Greenville Avenue in Dallas, where Indian flavors, tandoor cooking, curries, biryani, distinctive drinks, warm hospitality, and catering come together.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://namakcuisine.com/about",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator(".story-section")).toHaveCount(4);
  for (const href of ["/menu", "/bar", "/catering", "/visit"]) {
    await expect(
      page.locator(`.about-page a[href="${href}"]`).first(),
    ).toBeVisible();
  }

  const captions = await page
    .locator(".story-media figcaption")
    .allTextContents();
  const alts = await page
    .locator(".story-media img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("alt")));
  expect(captions).toHaveLength(5);
  expect(captions.every((caption) => caption.split(/\s+/).length <= 6)).toBe(
    true,
  );
  expect(captions.some((caption) => alts.includes(caption))).toBe(false);
  await expect(page.getByText("OWNER_REVIEW_REQUIRED")).toHaveCount(0);
  await expect(
    page.getByText(/family-owned|award-winning|authentic/i),
  ).toHaveCount(0);

  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent!)),
    );
  expect(
    structuredData.some((entry) =>
      entry["@graph"]?.some(
        (node: { "@type"?: string }) => node["@type"] === "BreadcrumbList",
      ),
    ),
  ).toBe(true);
  expect(
    structuredData.some((entry) =>
      entry["@graph"]?.some(
        (node: { "@type"?: string }) => node["@type"] === "AboutPage",
      ),
    ),
  ).toBe(true);
});

test("Our Story remains readable and tap-friendly on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  for (const section of await page.locator(".about-page section").all()) {
    await section.scrollIntoViewIfNeeded();
  }
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  for (const link of await page
    .locator(".about-page .button, .about-page .text-link")
    .all()) {
    const box = await link.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("approved venue photography appears without broken images or overflow", async ({
  page,
}) => {
  for (const path of ["/", "/bar", "/about", "/gallery", "/visit"]) {
    await page.goto(path);
    await expect(page.locator("html")).not.toHaveClass(/overflow/);
    const media = page.locator(
      'img[src*="media%2Fvenue"], img[srcset*="media%2Fvenue"], img[src*="/media/venue/"]',
    );
    expect(await media.count()).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const sources = await media.evaluateAll((images) =>
      images.map(
        (image) =>
          (image as HTMLImageElement).currentSrc ||
          (image as HTMLImageElement).src,
      ),
    );
    for (const source of sources)
      expect((await page.request.get(source)).ok()).toBe(true);
  }
});
