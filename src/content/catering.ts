import { foodMenuItems, menuCategories } from "@/content/menu";
import type {
  CateringEventType,
  CateringMealPreference,
} from "@/lib/catering/types";

export const cateringEventOptions: ReadonlyArray<{
  value: CateringEventType;
  label: string;
}> = [
  { value: "corporate-office", label: "Corporate / Office Event" },
  {
    value: "birthday-sweet-sixteen",
    label: "Birthday / Sweet 16 / Milestone Birthday",
  },
  { value: "anniversary", label: "Anniversary Celebration" },
  {
    value: "engagement-ring-ceremony",
    label: "Engagement / Roka / Ring Ceremony",
  },
  { value: "wedding-reception", label: "Wedding / Reception" },
  {
    value: "pre-wedding",
    label: "Pre-Wedding Function — Mehndi, Sangeet, Haldi, Pithi or Garba",
  },
  { value: "baby-shower", label: "Baby Shower / Godh Bharai" },
  {
    value: "child-ceremony",
    label: "Child Ceremony — Namkaran, Annaprashan, Mundan or First Birthday",
  },
  { value: "housewarming", label: "Housewarming / Griha Pravesh" },
  {
    value: "religious-spiritual",
    label:
      "Religious / Spiritual Gathering — Puja, Katha, Bhajan, Kirtan or Jagrata",
  },
  {
    value: "festival-cultural",
    label:
      "Festival / Cultural Event — Diwali, Navratri, Holi, Eid, Vaisakhi, Onam or Pongal",
  },
  {
    value: "graduation-education",
    label: "Graduation / School / College Event",
  },
  { value: "family-social", label: "Family / Social Gathering" },
  {
    value: "community-fundraiser",
    label: "Community Event / Fundraiser",
  },
  { value: "memorial-prayer", label: "Memorial / Prayer Gathering" },
  { value: "other", label: "Other" },
];

export const cateringMealOptions: ReadonlyArray<{
  value: CateringMealPreference;
  label: string;
}> = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
  { value: "mixed", label: "Mixed" },
];

export const cateringMenuGroups = menuCategories
  .filter((category) => category.kind === "food")
  .map((category) => ({
    id: category.id,
    name: category.name,
    items: foodMenuItems
      .filter((item) => item.categoryId === category.id)
      .map(({ id, name }) => ({ id, name })),
  }))
  .filter((group) => group.items.length > 0);

export const cateringMediaIds = {
  hero: "catering-stock-hero",
  corporate: "catering-stock-corporate",
  celebrations: "catering-stock-celebrations",
  culturalFamily: "catering-stock-cultural-family",
} as const;

export const cateringEventCards = [
  {
    title: "Corporate & Office",
    copy: "Office lunches, team celebrations, client gatherings, meetings, and company events.",
    imageId: cateringMediaIds.corporate,
  },
  {
    title: "Weddings & Celebrations",
    copy: "Engagements, ring ceremonies, birthdays, Sweet 16 celebrations, receptions, pre-wedding functions, and milestone occasions.",
    imageId: cateringMediaIds.celebrations,
  },
  {
    title: "Cultural, Religious & Family Gatherings",
    copy: "Puja, katha, festivals, community gatherings, housewarmings, child ceremonies, and family occasions.",
    imageId: cateringMediaIds.culturalFamily,
  },
] as const;

export const eventTypeLabel = (value: CateringEventType) =>
  cateringEventOptions.find((option) => option.value === value)?.label;

export const mealPreferenceLabel = (value: CateringMealPreference) =>
  cateringMealOptions.find((option) => option.value === value)?.label;
