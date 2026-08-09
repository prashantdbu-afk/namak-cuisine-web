export type DayName = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
export type HoursPeriod = { open: string; close: string };
export type SpecialHours = { date: string; periods: HoursPeriod[] | null };
export const weeklyHours: Record<DayName, HoursPeriod[]> = {
  Sunday: [{ open: "11:00", close: "22:00" }], Monday: [{ open: "11:00", close: "22:00" }],
  Tuesday: [{ open: "11:00", close: "22:00" }], Wednesday: [{ open: "11:00", close: "22:00" }],
  Thursday: [{ open: "11:00", close: "22:00" }], Friday: [{ open: "11:00", close: "24:00" }],
  Saturday: [{ open: "11:00", close: "24:00" }],
};
export const specialHours: SpecialHours[] = [];
export const hoursDisplay = [
  { days: "Sunday–Thursday", hours: "11:00 AM–10:00 PM" },
  { days: "Friday–Saturday", hours: "11:00 AM–12:00 AM" },
] as const;
