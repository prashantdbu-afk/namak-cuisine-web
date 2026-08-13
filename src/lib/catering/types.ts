export type CateringEventType =
  | "corporate-office"
  | "birthday-sweet-sixteen"
  | "anniversary"
  | "engagement-ring-ceremony"
  | "wedding-reception"
  | "pre-wedding"
  | "baby-shower"
  | "child-ceremony"
  | "housewarming"
  | "religious-spiritual"
  | "festival-cultural"
  | "graduation-education"
  | "family-social"
  | "community-fundraiser"
  | "memorial-prayer"
  | "other";

export type CateringMealPreference = "vegetarian" | "non-vegetarian" | "mixed";

export type CateringInquiry = {
  fullName: string;
  email: string;
  phone: string;
  eventType: CateringEventType;
  specificFunction: string | null;
  eventDate: string;
  eventLocation: string | null;
  guestCount: number;
  mealPreference: CateringMealPreference;
  needsMenuHelp: boolean;
  menuItemIds: string[];
  notes: string | null;
  website: string;
  startedAt: number;
};

export type CateringFormMode = "disabled" | "webhook" | "external";

export type CateringFieldErrors = Partial<
  Record<keyof CateringInquiry | "form", string>
>;

export type CateringFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: CateringFieldErrors;
  values?: Record<string, string | string[]>;
};

export type CateringSubmissionPayload = {
  inquiryType: "catering";
  restaurant: "Namak Indian Restaurant & Bar";
  submittedAt: string;
  sourcePage: "/catering";
  contact: { fullName: string; email: string; phone: string };
  event: {
    categoryValue: CateringEventType;
    categoryLabel: string;
    specificFunction: string | null;
    date: string;
    location: string | null;
    guestCount: number;
  };
  food: {
    preferenceValue: CateringMealPreference;
    preferenceLabel: string;
    needsMenuHelp: boolean;
    selectedMenuItems: Array<{ id: string; name: string }>;
  };
  notes: string | null;
};
