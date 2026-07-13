/**
 * "Add to Google Calendar" without any API or OAuth: Google Calendar's event
 * template URL pre-fills a new event when opened, and the user saves it into
 * their own calendar. Times are sent with ctz=Asia/Tokyo so the event lands
 * on the JST screening time regardless of the device timezone.
 */

const pad = (n: number) => String(n).padStart(2, '0');

export interface CalendarEvent {
  title: string;
  date: string; // 'YYYY-MM-DD' (JST)
  time: string; // 'HH:mm' (JST)
  durationMin?: number | null; // defaults to 120
  location?: string;
  details?: string;
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const duration = ev.durationMin && ev.durationMin > 0 ? ev.durationMin : 120;
  const [h, m] = ev.time.split(':').map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + duration;

  const startDay = ev.date.replaceAll('-', '');
  // End may roll past midnight — advance the day with UTC arithmetic (no TZ drift).
  const end = new Date(
    Date.UTC(Number(ev.date.slice(0, 4)), Number(ev.date.slice(5, 7)) - 1, Number(ev.date.slice(8, 10))),
  );
  end.setUTCDate(end.getUTCDate() + Math.floor(endMin / 1440));
  const endDay = `${end.getUTCFullYear()}${pad(end.getUTCMonth() + 1)}${pad(end.getUTCDate())}`;

  const stamp = (day: string, mins: number) =>
    `${day}T${pad(Math.floor((mins % 1440) / 60))}${pad(mins % 60)}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${stamp(startDay, startMin)}/${stamp(endDay, endMin)}`,
    ctz: 'Asia/Tokyo',
  });
  if (ev.location) params.set('location', ev.location);
  if (ev.details) params.set('details', ev.details);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
