export const announcement = {
  enabled: true,
  text: "Now welcoming Dallas for lunch, dinner, and late Friday–Saturday evenings.",
};
export const sensoryMoments = [
  {
    name: "Heat",
    note: "The glow and energy of a kitchen in motion.",
    tone: "ember",
  },
  {
    name: "Color",
    note: "A table brought to life in vivid layers.",
    tone: "garden",
  },
  {
    name: "Time",
    note: "An evening allowed to unfold at its own pace.",
    tone: "silk",
  },
] as const; // OWNER_REVIEW_REQUIRED: original positioning copy, not dish names.
export const gallery = ["The pass", "At the table", "After dark"] as const; // OWNER_REVIEW_REQUIRED: local placeholder art.
export const approvedReviews: ReadonlyArray<{ quote: string; source: string }> =
  [];
