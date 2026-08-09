export const announcement = { enabled: true, text: "Now welcoming Dallas for lunch, dinner, and late Friday–Saturday evenings." };
export const signatureDishes = [
  { name: "Ember", note: "A study in char, warmth, and deep spice.", tone: "ember" },
  { name: "Garden", note: "Bright herbs and layered seasonal color.", tone: "garden" },
  { name: "Silk", note: "Slow-built richness with an elegant finish.", tone: "silk" },
] as const; // OWNER_REVIEW_REQUIRED: conceptual placeholders, not confirmed menu items.
export const gallery = ["The pass", "At the table", "After dark"] as const; // OWNER_REVIEW_REQUIRED: local placeholder art.
export const approvedReviews: ReadonlyArray<{ quote: string; source: string }> = [];
