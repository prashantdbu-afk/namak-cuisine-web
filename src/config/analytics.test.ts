import { describe, expect, it } from "vitest";
import { getAnalyticsConfig } from "./analytics";

const productionGoogleEnv = {
  VERCEL_ENV: "production",
  NEXT_PUBLIC_ANALYTICS_PROVIDER: "google",
  NEXT_PUBLIC_ANALYTICS_ID: "G-YYFJJQGY6T",
};

describe("analytics configuration", () => {
  it("enables Google Analytics in production using the environment ID", () => {
    expect(getAnalyticsConfig(productionGoogleEnv)).toEqual({
      enabled: true,
      provider: "google",
      measurementId: "G-YYFJJQGY6T",
    });
  });

  it.each(["preview", "development", "test", undefined])(
    "does not enable Google Analytics when VERCEL_ENV is %s",
    (vercelEnvironment) => {
      expect(
        getAnalyticsConfig({
          ...productionGoogleEnv,
          VERCEL_ENV: vercelEnvironment,
        }).enabled,
      ).toBe(false);
    },
  );

  it("does not enable analytics without the Google provider and measurement ID", () => {
    expect(
      getAnalyticsConfig({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_ANALYTICS_PROVIDER: "disabled",
      }).enabled,
    ).toBe(false);
  });
});
