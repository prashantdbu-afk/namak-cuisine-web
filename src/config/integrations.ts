export type ReservationMode = "call" | "external" | "native";
export const integrations = {
  reservation: { mode: "call" as ReservationMode, externalUrl: undefined as string | undefined },
  ordering: { url: undefined as string | undefined },
  contactForm: { enabled: false, endpoint: process.env.CONTACT_FORM_ENDPOINT },
  features: { bar: true, reviews: false },
} as const;
