import {
  specialHours,
  weeklyHours,
  type DayName,
  type HoursPeriod,
  type SpecialHours,
} from "@/content/hours";
import { site } from "@/config/site";
const days: DayName[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const minutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};
export function isWithinPeriods(minute: number, periods: HoursPeriod[]) {
  return periods.some(
    ({ open, close }) => minute >= minutes(open) && minute < minutes(close),
  );
}
export function getOpenStatus(
  date = new Date(),
  overrides: SpecialHours[] = specialHours,
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  const day = part("weekday") as DayName;
  const dateKey = `${part("year")}-${part("month")}-${part("day")}`;
  const override = overrides.find((item) => item.date === dateKey);
  const periods = override ? (override.periods ?? []) : weeklyHours[day];
  const current = Number(part("hour")) * 60 + Number(part("minute"));
  return {
    isOpen: isWithinPeriods(current, periods),
    label: isWithinPeriods(current, periods) ? "Open now" : "Closed now",
    day,
    dateKey,
  };
}
export { days };
