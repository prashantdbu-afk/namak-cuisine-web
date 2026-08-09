import { defineConfig, devices } from "@playwright/test";
const isCI = Boolean(process.env.CI);
export default defineConfig({
  testDir: "./tests/a11y",
  webServer: {
    command: isCI
      ? "pnpm start"
      : "./node_modules/.bin/next dev --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3000" },
});
