export type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
export type HoursPeriod = { open: string; close: string };
export type SpecialHours = { date: string; periods: HoursPeriod[] | null };
export const weeklyHours: Record<DayName, HoursPeriod[]> = {
  Sunday: [{ open: "11:00", close: "22:00" }],
  Monday: [{ open: "11:00", close: "22:00" }],
  Tuesday: [{ open: "11:00", close: "22:00" }],
  Wednesday: [{ open: "11:00", close: "22:00" }],
  Thursday: [{ open: "11:00", close: "22:00" }],
  Friday: [{ open: "11:00", close: "24:00" }],
  Saturday: [{ open: "11:00", close: "24:00" }],
};
export const specialHours: SpecialHours[] = [];
export const hoursDisplay = [
  { days: "Sunday–Thursday", hours: "11:00 AM–10:00 PM" },
  { days: "Friday–Saturday", hours: "11:00 AM–12:00 AM" },
] as const;

export const schemaDayUrls: Record<DayName, string> = {
  Sunday: "https://schema.org/Sunday",
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
};

export function getOpeningHoursSpecification() {
  return Object.entries(weeklyHours).flatMap(([day, periods]) =>
    periods.map((period) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: schemaDayUrls[day as DayName],
      opens: period.open,
      closes: period.close === "24:00" ? "00:00" : period.close,
    })),
  );
}
