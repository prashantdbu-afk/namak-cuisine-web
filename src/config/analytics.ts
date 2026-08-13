export type AnalyticsProvider = "google" | "disabled";

export type AnalyticsEnvironment = {
  VERCEL_ENV?: string;
  NEXT_PUBLIC_ANALYTICS_PROVIDER?: string;
  NEXT_PUBLIC_ANALYTICS_ID?: string;
  NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED?: string;
};

export type AnalyticsConfig = {
  enabled: boolean;
  provider: AnalyticsProvider;
  measurementId: string | null;
  firstPartyEnabled: boolean;
};

export function getAnalyticsConfig(
  env: AnalyticsEnvironment = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED:
      process.env.NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED,
  },
): AnalyticsConfig {
  const provider = env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  const measurementId = env.NEXT_PUBLIC_ANALYTICS_ID?.trim() || null;
  const isGoogle = provider === "google";

  return {
    enabled:
      env.VERCEL_ENV === "production" && isGoogle && measurementId !== null,
    provider: isGoogle ? "google" : "disabled",
    measurementId,
    firstPartyEnabled:
      env.VERCEL_ENV === "production" &&
      env.NEXT_PUBLIC_NAMAK_ANALYTICS_ENABLED === "true",
  };
}
