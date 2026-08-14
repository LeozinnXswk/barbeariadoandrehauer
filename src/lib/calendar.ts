export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM(:SS)
  durationMinutes?: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Local (America/Sao_Paulo = UTC-3) -> UTC timestamps for calendar apps
const toUtcStamps = (e: CalendarEvent) => {
  const [h, m] = e.time.split(":").map(Number);
  const start = new Date(`${e.date}T${pad(h)}:${pad(m || 0)}:00-03:00`);
  const end = new Date(start.getTime() + (e.durationMinutes ?? 40) * 60000);
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00Z`;
  return { start: fmt(start), end: fmt(end) };
};

export const googleCalendarUrl = (e: CalendarEvent) => {
  const { start, end } = toUtcStamps(e);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    details: e.description ?? "",
    location: e.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const icsBody = (events: CalendarEvent[]) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Barbearia Andre//Agenda//PT-BR",
    "CALSCALE:GREGORIAN",
  ];
  events.forEach((e, i) => {
    const { start, end } = toUtcStamps(e);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${start}-${i}@barbeariaandre`,
      `DTSTAMP:${start}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${e.title}`,
      `DESCRIPTION:${(e.description ?? "").replace(/\n/g, "\\n")}`,
      `LOCATION:${e.location ?? ""}`,
      // Lembretes que tocam no celular do barbeiro
      "BEGIN:VALARM",
      "TRIGGER:-PT60M",
      "ACTION:DISPLAY",
      `DESCRIPTION:Em 1 hora: ${e.title}`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      `DESCRIPTION:Em 15 minutos: ${e.title}`,
      "END:VALARM",
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

export const downloadIcs = (events: CalendarEvent[], filename = "agenda.ics") => {
  const blob = new Blob([icsBody(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const BARBERSHOP_ADDRESS =
  "R. Prof. João Soares Barcelos, 1147 - Loja 01 - Hauer, Curitiba - PR, 81630-060";