export type AnalyticsProvider = "google" | "disabled";

export type AnalyticsEnvironment = {
  VERCEL_ENV?: string;
  NEXT_PUBLIC_ANALYTICS_PROVIDER?: string;
  NEXT_PUBLIC_ANALYTICS_ID?: string;
};

export type AnalyticsConfig = {
  enabled: boolean;
  provider: AnalyticsProvider;
  measurementId: string | null;
};

export function getAnalyticsConfig(
  env: AnalyticsEnvironment = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
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
  };
}
