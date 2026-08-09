import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 120_000,
  workers: 1,
  webServer: {
    command: "pnpm start",
    env: { VERCEL_ENV: "preview" },
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
});
