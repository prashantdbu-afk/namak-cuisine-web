import { defineConfig, devices } from "@playwright/test";
const isCI = Boolean(process.env.CI);
export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: isCI
      ? "pnpm start"
      : "./node_modules/.bin/next dev --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    env: {
      NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY: "test-placeholder-not-a-real-key",
    },
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://127.0.0.1:3000" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" } },
  ],
});
