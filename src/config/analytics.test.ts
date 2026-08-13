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
      firstPartyEnabled: false,
    });
  });

  it("enables first-party collection independently only in production", () => {
    expect(
      getAnalyticsConfig({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED: "true",
      }),
    ).toEqual({
      enabled: false,
      provider: "disabled",
      measurementId: null,
      firstPartyEnabled: true,
    });
    expect(
      getAnalyticsConfig({
        VERCEL_ENV: "preview",
        NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED: "true",
      }).firstPartyEnabled,
    ).toBe(false);
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
