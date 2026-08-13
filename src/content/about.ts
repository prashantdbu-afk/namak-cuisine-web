export type AboutSection = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  imageId: string;
  imageKind: "venue" | "food";
  imagePosition: "left" | "right";
  editorialLabel?: string;
  link?: { href: "/menu" | "/bar" | "/catering" | "/visit"; label: string };
  tone?: "light" | "dark";
};

export const aboutHero = {
  eyebrow: "Our Story",
  heading: "Rooted in Indian flavor. Made for today.",
  introduction:
    "Namak brings the depth, color, and warmth of Indian cooking to a modern table on Greenville Avenue in Dallas. From tandoor-fired specialties and layered curries to aromatic biryani, Indian breads, vegetarian favorites, and distinctive drinks, every part of the experience is designed to be shared.",
  imageId: "venue-architecture-01",
  editorialLabel: "The Namak experience",
} as const;

export const aboutSections: readonly AboutSection[] = [
  {
    id: "passion",
    eyebrow: "Our Passion",
    heading: "Where tradition meets fresh ideas.",
    body: "We respect the techniques that give Indian cooking its character—the heat of the tandoor, the patience of a slow simmer, the fragrance of spice, and the comfort of bread at the table. We also believe tradition should feel alive, expressive, and at home in the present. That balance guides the way we cook, present each dish, and welcome our guests.",
    imageId: "food-hyderabadi-chicken-dum-biryani",
    imageKind: "food",
    imagePosition: "right",
    editorialLabel: "Tandoor and craft",
    link: { href: "/menu", label: "Explore the Menu" },
  },
  {
    id: "hospitality",
    eyebrow: "Hospitality",
    heading: "A table made for sharing.",
    body: "A memorable meal is about more than what arrives on the plate. It is the welcome at the door, the energy of the dining room, a drink shared at the bar, and the time people make for one another. Namak is meant to feel polished without feeling distant—a place for family dinners, date nights, celebrations, and evenings that last a little longer.",
    imageId: "venue-seating-03",
    imageKind: "venue",
    imagePosition: "left",
    editorialLabel: "A table for sharing",
  },
  {
    id: "dallas",
    eyebrow: "Greenville Avenue · Dallas",
    heading: "Indian dining in the heart of Dallas.",
    body: "Located at 5500 Greenville Ave #600, Namak welcomes Dallas for lunch, dinner, and later Friday and Saturday evenings. Guests can explore vegetarian and non-vegetarian dishes, tandoor selections, curries, biryani, Indian breads, desserts, cocktails, beer, and wine.",
    imageId: "venue-bar-wide-03",
    imageKind: "venue",
    imagePosition: "right",
    editorialLabel: "Bar and evening rhythm",
    link: { href: "/bar", label: "Explore the Bar" },
    tone: "dark",
  },
  {
    id: "catering",
    eyebrow: "Catering & Events",
    heading: "Bring Namak to your gathering.",
    body: "Namak also helps guests begin planning corporate meals, birthdays, engagements, weddings, cultural celebrations, religious gatherings, and family occasions. Share your event details, estimated guest count, and vegetarian, non-vegetarian, or mixed menu preference, and our team will continue the conversation with you.",
    imageId: "venue-entrance-exterior-02",
    imageKind: "venue",
    imagePosition: "left",
    editorialLabel: "Greenville Avenue",
    link: { href: "/catering", label: "Plan Catering" },
  },
] as const;

export const aboutClosing = {
  heading: "Find your place at the table.",
  actions: [
    { href: "/menu", label: "Explore the Menu" },
    { href: "/catering", label: "Plan Catering" },
    { href: "/visit", label: "Visit Namak" },
  ],
} as const;
