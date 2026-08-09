export type ReservationMode = "call" | "external" | "native";
export type ContactFormMode = "disabled" | "external" | "native";
export const integrations = {
  reservation: {
    mode: "call" as ReservationMode,
    externalUrl: undefined as string | undefined,
  },
  ordering: { url: undefined as string | undefined },
  contactForm: {
    mode: "disabled" as ContactFormMode,
    externalUrl: undefined as string | undefined,
  },
  features: { bar: true, reviews: false, heroVideo: false },
} as const;
