import { useState } from 'react';

import {
  CalendarConsentSheet,
  grantCalendarConsent,
  hasCalendarConsent,
} from '@/components/CalendarConsent';
import { googleCalendarUrl } from '@/lib/calendar';
import { formatShortDate } from '@/lib/format';
import { displayTitle } from '@/lib/queries';
import type { FilmWithScreenings, ShowTime } from '@/lib/types';

/** Inline "Add to Google Calendar" button — appears once a time is picked. */
export function AddToCalendar({
  film,
  cinemaName,
  date,
  time,
}: {
  film: FilmWithScreenings;
  cinemaName: string | undefined;
  date: string;
  time: ShowTime;
}) {
  const [consentOpen, setConsentOpen] = useState(false);
  const { primary } = displayTitle(film);

  const langTag =
    time.language === 'english' ? ' (ENG)' : time.language === 'japanese' ? ' (日本語)' : '';
  const calUrl = googleCalendarUrl({
    title: `${primary}${time.language === 'english' ? ' (ENG)' : ''}`,
    date,
    time: time.time,
    durationMin: film.duration_min,
    location: cinemaName,
    details: film.source_url ?? undefined,
  });

  return (
    <div className="cal-inline">
      <a
        className="cal-btn"
        href={calUrl}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          // First use: show the privacy explainer instead of navigating.
          if (hasCalendarConsent()) return;
          e.preventDefault();
          setConsentOpen(true);
        }}
      >
        <iconify-icon icon="solar:calendar-add-linear" />
        <span>Add to Google Calendar</span>
      </a>
      <div className="cal-caption">
        {formatShortDate(date)} · {time.time} · {primary}
        {langTag}
      </div>

      {consentOpen && (
        <CalendarConsentSheet
          onCancel={() => setConsentOpen(false)}
          onConfirm={() => {
            grantCalendarConsent();
            setConsentOpen(false);
            window.open(calUrl, '_blank', 'noopener');
          }}
        />
      )}
    </div>
  );
}
