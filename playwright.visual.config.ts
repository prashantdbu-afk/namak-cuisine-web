import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 120_000,
  workers: 1,
  webServer: {
    command: "pnpm build && pnpm start",
    env: {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY:
        "visual-test-placeholder-not-a-real-key",
    },
    url: "http://127.0.0.1:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
});
