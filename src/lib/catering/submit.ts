import { eventTypeLabel, mealPreferenceLabel } from "@/content/catering";
import { foodMenuItems } from "@/content/menu";
import { sendCateringWebhook } from "@/lib/catering/providers/webhook";
import type {
  CateringFormMode,
  CateringInquiry,
  CateringSubmissionPayload,
} from "@/lib/catering/types";

export type CateringFormConfiguration = {
  mode: CateringFormMode;
  endpoint?: string;
  externalUrl?: string;
};

export function getCateringFormConfiguration(
  env: Partial<NodeJS.ProcessEnv> = process.env,
): CateringFormConfiguration {
  const requested = env.CATERING_FORM_MODE;
  const mode: CateringFormMode =
    requested === "webhook" || requested === "external"
      ? requested
      : "disabled";
  return {
    mode,
    endpoint: env.CATERING_FORM_ENDPOINT,
    externalUrl:
      env.NEXT_PUBLIC_CATERING_FORM_EXTERNAL_URL ??
      env.CATERING_FORM_EXTERNAL_URL,
  };
}

export function buildCateringPayload(
  inquiry: CateringInquiry,
  submittedAt = new Date(),
): CateringSubmissionPayload {
  const categoryLabel = eventTypeLabel(inquiry.eventType);
  const preferenceLabel = mealPreferenceLabel(inquiry.mealPreference);
  if (!categoryLabel || !preferenceLabel)
    throw new Error("Validated catering labels could not be resolved.");
  return {
    inquiryType: "catering",
    restaurant: "Namak Indian Restaurant & Bar",
    submittedAt: submittedAt.toISOString(),
    sourcePage: "/catering",
    contact: {
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
    },
    event: {
      categoryValue: inquiry.eventType,
      categoryLabel,
      specificFunction: inquiry.specificFunction,
      date: inquiry.eventDate,
      location: inquiry.eventLocation,
      guestCount: inquiry.guestCount,
    },
    food: {
      preferenceValue: inquiry.mealPreference,
      preferenceLabel,
      needsMenuHelp: inquiry.needsMenuHelp,
      selectedMenuItems: inquiry.menuItemIds.map((id) => {
        const item = foodMenuItems.find((candidate) => candidate.id === id);
        if (!item)
          throw new Error("Validated menu item could not be resolved.");
        return { id: item.id, name: item.name };
      }),
    },
    notes: inquiry.notes,
  };
}

const recentSubmissions = new Map<string, number>();
export function passesCateringRateLimit(key: string, now = Date.now()) {
  const previous = recentSubmissions.get(key);
  if (previous && now - previous < 15_000) return false;
  recentSubmissions.set(key, now);
  if (recentSubmissions.size > 500) {
    for (const [candidate, timestamp] of recentSubmissions)
      if (now - timestamp > 3_600_000) recentSubmissions.delete(candidate);
  }
  return true;
}

export async function submitCateringInquiry(inquiry: CateringInquiry) {
  const configuration = getCateringFormConfiguration();
  if (configuration.mode !== "webhook" || !configuration.endpoint)
    throw new Error("Catering webhook is not configured.");
  const rateKey = `${inquiry.email}:${inquiry.phone}`;
  if (!passesCateringRateLimit(rateKey))
    throw new Error("Duplicate catering inquiry blocked.");
  await sendCateringWebhook(
    configuration.endpoint,
    buildCateringPayload(inquiry),
    process.env.CATERING_FORM_BEARER_TOKEN,
  );
}
