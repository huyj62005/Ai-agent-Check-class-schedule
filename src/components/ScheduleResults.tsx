import React from "react";

export type Lesson = {
  date: string;   // YYYY-MM-DD
  start: string;  // "07:30"
  end: string;    // "09:10"
  subject: string;
  teacher: string;
  room: string;
};

export function ScheduleResults({
  title,
  lessons,
}: {
  title: string;
  lessons: Lesson[];
}) {
  return (
    <div
      style={{
        marginTop: 12,
        borderLeft: "6px solid #34d399",
        background: "#0b1220",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>

      {lessons.length === 0 ? (
        <div style={{ opacity: 0.85 }}>Không có buổi học.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ opacity: 0.9 }}>
              <th style={{ textAlign: "left", padding: "8px 6px" }}>Thời gian</th>
              <th style={{ textAlign: "left", padding: "8px 6px" }}>Tên môn học</th>
              <th style={{ textAlign: "left", padding: "8px 6px" }}>Giáo viên</th>
              <th style={{ textAlign: "left", padding: "8px 6px" }}>Phòng học</th>

            </tr>
          </thead>
          <tbody>
            {lessons.map((x, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <td style={{ padding: "8px 6px" }}>{x.start}–{x.end}</td>
                <td style={{ padding: "8px 6px" }}>{x.subject}</td>
                <td style={{ padding: "8px 6px" }}>{x.teacher}</td>
                <td style={{ padding: "8px 6px" }}>{x.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}