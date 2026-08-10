import type { CateringSubmissionPayload } from "@/lib/catering/types";

export async function sendCateringWebhook(
  endpoint: string,
  payload: CateringSubmissionPayload,
  bearerToken?: string,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(bearerToken ? { authorization: `Bearer ${bearerToken}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}
