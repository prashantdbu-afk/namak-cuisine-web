"use server";

import { parseCateringInquiry } from "@/lib/catering/schema";
import {
  getCateringFormConfiguration,
  submitCateringInquiry,
} from "@/lib/catering/submit";
import type { CateringFormState } from "@/lib/catering/types";

function retainedValues(formData: FormData) {
  const values: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "website" || key === "startedAt" || typeof value !== "string")
      continue;
    if (key === "menuItemIds") {
      const existing = values[key];
      values[key] = Array.isArray(existing) ? [...existing, value] : [value];
    } else values[key] = value;
  }
  return values;
}

export async function sendCateringInquiry(
  _previousState: CateringFormState,
  formData: FormData,
): Promise<CateringFormState> {
  const values = retainedValues(formData);
  if (JSON.stringify(values).length > 25_000)
    return {
      status: "error",
      message: "We could not send your inquiry.",
      errors: { form: "The inquiry is too large. Please shorten your notes." },
      values,
    };

  const parsed = parseCateringInquiry(formData);
  if (!parsed.success)
    return {
      status: "error",
      message: "We could not send your inquiry.",
      errors: parsed.errors,
      values,
    };

  const configuration = getCateringFormConfiguration();
  if (configuration.mode !== "webhook" || !configuration.endpoint)
    return {
      status: "error",
      message: "We could not send your inquiry.",
      errors: {
        form: "Online inquiries are not configured yet. Please call Namak directly at 214-730-0047.",
      },
      values,
    };

  try {
    await submitCateringInquiry(parsed.data);
    return {
      status: "success",
      message: "Thank you. Your catering inquiry has been received.",
    };
  } catch {
    return {
      status: "error",
      message: "We could not send your inquiry.",
      errors: {
        form: "Please review the highlighted fields or call Namak directly at 214-730-0047.",
      },
      values,
    };
  }
}
