import { SCHEDULE } from "../data/schedule";

export function getScheduleByDate(date: string) {
  return SCHEDULE.filter((x) => x.date === date);
}

function toYYYYMMDD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * when: "today" | "tomorrow" | "YYYY-MM-DD"
 * Returns: { date, lessons }
 */
export function getSchedule(when: string) {
  let date = when;

  if (when === "today" || when === "tomorrow") {
    const now = new Date(); // dùng giờ local của máy bạn (VN là OK)
    if (when === "tomorrow") now.setDate(now.getDate() + 1);
    date = toYYYYMMDD(now);
  }

  const lessons = getScheduleByDate(date);
  return { date, lessons };
}