import { cateringEventOptions, cateringMealOptions } from "@/content/catering";
import { foodMenuItems } from "@/content/menu";
import type {
  CateringFieldErrors,
  CateringInquiry,
} from "@/lib/catering/types";

const eventTypes = new Set(cateringEventOptions.map((option) => option.value));
const mealPreferences = new Set(
  cateringMealOptions.map((option) => option.value),
);
const publishedFoodIds = new Set(foodMenuItems.map((item) => item.id));

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: string) {
  return value.length ? value : null;
}

export function chicagoToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function parseCateringInquiry(
  formData: FormData,
  now = new Date(),
):
  | { success: true; data: CateringInquiry }
  | { success: false; errors: CateringFieldErrors } {
  const errors: CateringFieldErrors = {};
  const fullName = text(formData, "fullName");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone").replace(/\s+/g, " ");
  const eventType = text(formData, "eventType");
  const specificFunction = text(formData, "specificFunction");
  const eventDate = text(formData, "eventDate");
  const eventLocation = text(formData, "eventLocation");
  const guestCountText = text(formData, "guestCount");
  const mealPreference = text(formData, "mealPreference");
  const needsMenuHelp = formData.get("needsMenuHelp") === "true";
  const website = text(formData, "website");
  const notes = text(formData, "notes");
  const startedAt = Number(text(formData, "startedAt"));
  const menuItemIds = [
    ...new Set(
      formData
        .getAll("menuItemIds")
        .filter((value): value is string => typeof value === "string"),
    ),
  ];
  const guestCount = Number(guestCountText);

  if (fullName.length < 2 || fullName.length > 80)
    errors.fullName = "Enter a name between 2 and 80 characters.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (phone.length < 7 || phone.length > 25 || !/^[+()\d\s.-]+$/.test(phone))
    errors.phone = "Enter a valid phone number.";
  if (!eventTypes.has(eventType as never))
    errors.eventType = "Choose an event category.";
  if (specificFunction.length > 100)
    errors.specificFunction = "Use 100 characters or fewer.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || eventDate < chicagoToday(now))
    errors.eventDate = "Choose today or a future date.";
  if (eventLocation.length > 150)
    errors.eventLocation = "Use 150 characters or fewer.";
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10_000)
    errors.guestCount = "Enter a whole number from 1 to 10,000.";
  if (!mealPreferences.has(mealPreference as never))
    errors.mealPreference = "Choose a food preference.";
  if (menuItemIds.length > 10)
    errors.menuItemIds = "Choose no more than 10 menu items.";
  if (menuItemIds.some((id) => !publishedFoodIds.has(id)))
    errors.menuItemIds = "One or more selected menu items are unavailable.";
  if (notes.length > 1000) errors.notes = "Use 1,000 characters or fewer.";
  if (website) errors.form = "We could not process this submission.";
  if (!Number.isFinite(startedAt) || now.getTime() - startedAt < 1500)
    errors.form = "Please take a moment to review your inquiry and try again.";

  if (Object.keys(errors).length) return { success: false, errors };
  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      eventType: eventType as CateringInquiry["eventType"],
      specificFunction: nullable(specificFunction),
      eventDate,
      eventLocation: nullable(eventLocation),
      guestCount,
      mealPreference: mealPreference as CateringInquiry["mealPreference"],
      needsMenuHelp,
      menuItemIds,
      notes: nullable(notes),
      website,
      startedAt,
    },
  };
}
