import { describe, expect, it } from "vitest";
import { foodMenuItems } from "@/content/menu";
import { buildCateringPayload, getCateringFormConfiguration } from "./submit";
import { parseCateringInquiry } from "./schema";

const now = new Date("2026-08-09T18:00:00-05:00");

function validForm() {
  const form = new FormData();
  form.set("fullName", "Priya Shah");
  form.set("email", "priya@example.com");
  form.set("phone", "+1 (214) 555-0100");
  form.set("eventType", "engagement-ring-ceremony");
  form.set("specificFunction", "Roka Ceremony");
  form.set("eventDate", "2026-09-20");
  form.set("eventLocation", "Dallas, TX");
  form.set("guestCount", "150");
  form.set("mealPreference", "mixed");
  form.set("startedAt", String(now.getTime() - 20_000));
  form.append("menuItemIds", foodMenuItems[0].id);
  return form;
}

describe("catering inquiry schema", () => {
  it("validates and normalizes a complete inquiry", () => {
    const parsed = parseCateringInquiry(validForm(), now);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.email).toBe("priya@example.com");
    expect(
      buildCateringPayload(parsed.data, now).food.selectedMenuItems,
    ).toEqual([{ id: foodMenuItems[0].id, name: foodMenuItems[0].name }]);
  });

  it.each([
    ["email", "not-an-email", "email"],
    ["eventDate", "2026-08-08", "eventDate"],
    ["guestCount", "0", "guestCount"],
    ["website", "spam.example", "form"],
  ])("rejects invalid %s values", (field, invalid, expectedError) => {
    const form = validForm();
    form.set(field, invalid);
    const parsed = parseCateringInquiry(form, now);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.errors).toHaveProperty(expectedError);
  });

  it("rejects unknown, bar, and more than ten menu IDs", () => {
    const form = validForm();
    form.delete("menuItemIds");
    for (let index = 0; index < 11; index += 1)
      form.append("menuItemIds", foodMenuItems[index].id);
    let parsed = parseCateringInquiry(form, now);
    expect(parsed.success).toBe(false);
    form.delete("menuItemIds");
    form.append("menuItemIds", "bar-whiskey-macallan-12-years");
    parsed = parseCateringInquiry(form, now);
    expect(parsed.success).toBe(false);
  });

  it("defaults safely to disabled mode", () => {
    expect(getCateringFormConfiguration({})).toEqual({
      mode: "disabled",
      endpoint: undefined,
      externalUrl: undefined,
    });
  });
});
