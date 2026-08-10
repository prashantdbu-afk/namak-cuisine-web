import type { FaqEntry } from "@/lib/seo";

export const visitFaqs = [
  {
    question: "Is parking available near Namak?",
    answer:
      "Parking conditions can vary within the Greenville Avenue center. Call Namak at 214-730-0047 before your visit if you need current parking or accessibility guidance.",
  },
  {
    question: "How can I make a reservation?",
    answer:
      "Call Namak at 214-730-0047 to ask about reservations and current table availability.",
  },
  {
    question: "Does Namak offer vegetarian options?",
    answer:
      "Yes. The current menu includes vegetarian chaat, tandoor selections, entrées, breads, rice dishes, and desserts. Review the menu and speak with the team about dietary needs.",
  },
  {
    question: "Is Namak open late?",
    answer:
      "Namak is open until 10:00 PM Sunday through Thursday and until midnight on Friday and Saturday. Check the Visit page for current published hours.",
  },
] as const satisfies readonly FaqEntry[];

export const cateringFaqs = [
  {
    question: "How far in advance should I ask about catering?",
    answer:
      "Contact Namak as early as possible. Availability, preparation time, and service details depend on the event date, guest count, and menu preferences.",
  },
  {
    question: "Does Namak offer vegetarian catering?",
    answer:
      "Yes. You can request vegetarian, non-vegetarian, or mixed menu preferences when starting a catering inquiry.",
  },
  {
    question: "Can Namak cater corporate events?",
    answer:
      "Namak welcomes inquiries for office lunches, team dinners, client events, conferences, and other corporate gatherings in the Dallas area.",
  },
  {
    question: "Can I inquire about wedding catering?",
    answer:
      "Yes. Namak accepts inquiries for weddings, engagements, pre-wedding functions, receptions, anniversaries, and related family celebrations.",
  },
] as const satisfies readonly FaqEntry[];
