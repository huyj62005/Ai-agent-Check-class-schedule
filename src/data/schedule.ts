// src/data/schedule.ts

export type Lesson = {
  date: string;   // YYYY-MM-DD
  start: string;  // "HH:mm"
  end: string;    // "HH:mm"
  subject: string;
  teacher: string;
  room: string;
};

/** 1 = Monday ... 7 = Sunday (ISO) */
type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type WeeklyLesson = {
  weekday: IsoWeekday;
  start: string;   // "HH:mm"
  end: string;     // "HH:mm"
  subject: string;
  teacher: string;
  room: string;
  weeks: number[]; // e.g. [25,26,...,42]
};

/**
 * IMPORTANT:
 * Đây là mốc “Thứ 2 của tuần 25”.
 * Mình đang set theo giả định: tuần 25 bắt đầu từ 2026-02-16.
 * Nếu trường bạn tuần 25 bắt đầu ngày khác, chỉ cần sửa TERM_WEEK25_MONDAY.
 */
const TERM_WEEK25_MONDAY = "2026-02-16";

/** Helpers */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const range = (from: number, to: number) => {
  const arr: number[] = [];
  for (let i = from; i <= to; i++) arr.push(i);
  return arr;
};

/**
 * Generate all lessons from weekly pattern.
 * - baseMonday: ISO date string of Monday for the first week in `weeksBase` (here: week 25)
 * - weeksBase: the "base week number" (here: 25) so week 25 => offset 0, week 26 => offset 1...
 * - excludeDates: list of YYYY-MM-DD to skip (holiday/makeup day)
 */
function buildSchedule(params: {
  baseMonday: string;
  weeksBase: number;
  weekly: WeeklyLesson[];
  excludeDates?: string[];
}): Lesson[] {
  const { baseMonday, weeksBase, weekly, excludeDates = [] } = params;

  // Parse YYYY-MM-DD safely (local date)
  const [y, m, d] = baseMonday.split("-").map(Number);
  const base = new Date(y, (m ?? 1) - 1, d ?? 1);

  const out: Lesson[] = [];

  for (const w of weekly) {
    for (const weekNo of w.weeks) {
      const weekOffset = weekNo - weeksBase; // week 25 => 0
      const daysFromBaseMonday = weekOffset * 7 + (w.weekday - 1);
      const dateObj = addDays(base, daysFromBaseMonday);
      const date = toISODate(dateObj);

      if (excludeDates.includes(date)) continue;

      out.push({
        date,
        start: w.start,
        end: w.end,
        subject: w.subject,
        teacher: w.teacher,
        room: w.room,
      });
    }
  }

  // Sort by date then time
  out.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.start.localeCompare(b.start);
  });

  return out;
}

/** Weeks 25–42 */
const WEEKS_25_42 = range(25, 42);

/**
 * Weekly pattern từ ảnh bạn gửi
 * (Offline/Blearning không ảnh hưởng schedule, nên mình không đưa vào Lesson.
 * Nếu bạn muốn thêm field "mode", mình thêm type giúp bạn.)
 */
const WEEKLY: WeeklyLesson[] = [
  // Thứ 2
  {
    weekday: 1,
    start: "08:30",
    end: "10:05",
    subject: "Phương trình vi phân và chuỗi",
    teacher: "Ninh Văn Thu",
    room: "D9-301",
    weeks: WEEKS_25_42,
  },

  // Thứ 3
  {
    weekday: 2,
    start: "10:15",
    end: "11:50",
    subject: "Kỹ năng ITSS học bằng tiếng Nhật 1",
    teacher: "Nguyễn Thị Diệp",
    room: "BI-203",
    weeks: WEEKS_25_42,
  },
  {
    weekday: 2,
    start: "12:30",
    end: "14:05",
    subject: "Kỹ năng ITSS học bằng tiếng Nhật 1",
    teacher: "Nguyễn Thị Diệp",
    room: "BI-203",
    weeks: WEEKS_25_42,
  },
  {
    weekday: 2,
    start: "14:15",
    end: "17:35",
    subject: "Phát triển phần mềm theo chuẩn kỹ năng ITSS",
    teacher: "Nguyễn Mạnh Tuấn",
    room: "D9-401",
    weeks: WEEKS_25_42,
  },

  // Thứ 4
  {
    weekday: 3,
    start: "06:45",
    end: "08:20",
    subject: "Phương trình vi phân và chuỗi (BT)",
    teacher: "Đỗ Đức Thuận",
    room: "D9-405",
    weeks: WEEKS_25_42,
  },

  // Thứ 5
  {
    weekday: 4,
    start: "06:45",
    end: "09:15",
    subject: "Tư duy công nghệ và thiết kế kỹ thuật",
    teacher: "Lương Thị Hồng Liên / Trần Anh Vũ",
    room: "D9-202",
    weeks: WEEKS_25_42,
  },
  {
    weekday: 4,
    start: "14:15",
    end: "17:35",
    subject: "Tiếng Nhật chuyên ngành 2",
    teacher: "Nguyễn Phi Lê",
    room: "BI-207",
    weeks: WEEKS_25_42,
  },

  // Thứ 6
  {
    weekday: 5,
    start: "08:30",
    end: "10:05",
    subject: "Tiếng Nhật 6",
    teacher: "Jingu Anna",
    room: "C7-219",
    weeks: WEEKS_25_42,
  },
  {
    weekday: 5,
    start: "12:30",
    end: "14:05",
    subject: "Nhập môn Trí tuệ nhân tạo",
    teacher: "Đỗ Tiến Dũng",
    room: "D9-401",
    weeks: WEEKS_25_42,
  },
];

/**
 * Nếu có tuần nghỉ/lịch bù, bạn chỉ cần add ngày vào đây để loại trừ.
 * Ví dụ: ["2026-03-09", "2026-04-30"]
 */
const EXCLUDE_DATES: string[] = [];

export const SCHEDULE: Lesson[] = buildSchedule({
  baseMonday: TERM_WEEK25_MONDAY,
  weeksBase: 25,
  weekly: WEEKLY,
  excludeDates: EXCLUDE_DATES,
});