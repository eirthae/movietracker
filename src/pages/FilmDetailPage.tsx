import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  CalendarConsentSheet,
  grantCalendarConsent,
  hasCalendarConsent,
} from '@/components/CalendarConsent';
import { DateChips, TimeChips } from '@/components/ScreeningPicker';
import { Poster } from '@/components/Poster';
import { googleCalendarUrl } from '@/lib/calendar';
import { formatRun, formatShortDate, todayJst } from '@/lib/format';
import {
  displayTitle,
  filmLanguage,
  screeningDates,
  timesOn,
  useCinemas,
  useFilm,
} from '@/lib/queries';
import type { ShowTime } from '@/lib/types';

export function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const filmQ = useFilm(id);
  const film = filmQ.data;
  const cinemasQ = useCinemas();
  const cinema = cinemasQ.data?.find((c) => c.id === film?.cinema_id);

  const dates = useMemo(() => (film ? screeningDates(film) : []), [film]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<ShowTime | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  // Initial selection: from query params (card time-chip tap), else the next
  // upcoming date + its first time.
  useEffect(() => {
    if (!film || date) return;
    const today = todayJst();
    const qDate = search.get('date');
    const initialDate =
      (qDate && dates.includes(qDate) && qDate) ||
      dates.find((d) => d >= today) ||
      dates[dates.length - 1] ||
      null;
    if (!initialDate) return;
    setDate(initialDate);

    const times = timesOn(film, initialDate);
    const qTime = search.get('time');
    const qLang = search.get('lang');
    const fromQuery = times.find((t) => t.time === qTime && (!qLang || t.language === qLang));
    setTime(fromQuery ?? times[0] ?? null);
  }, [film, dates, date, search]);

  const selectDate = (d: string) => {
    setDate(d);
    setTime(film ? (timesOn(film, d)[0] ?? null) : null);
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (filmQ.isLoading) {
    return (
      <div className="centered">
        <div className="spinner" />
      </div>
    );
  }

  if (!film) {
    return (
      <>
        <button className="back-head" onClick={goBack}>
          <iconify-icon icon="solar:arrow-left-linear" />
          <span>Back</span>
        </button>
        <div className="centered">
          <div className="empty-title">Film not found</div>
          <div className="empty-sub">It may have left the schedule on the last refresh.</div>
        </div>
      </>
    );
  }

  const { primary, secondary } = displayTitle(film);
  const times = date ? timesOn(film, date) : [];
  const run = formatRun(film.run_from, film.run_to, film.status);
  const meta = [run, film.genres.length ? film.genres.join(', ') : null]
    .filter(Boolean)
    .join(' · ');

  const calUrl =
    date && time
      ? googleCalendarUrl({
          title: `${primary}${time.language === 'english' ? ' (ENG)' : ''}`,
          date,
          time: time.time,
          durationMin: film.duration_min,
          location: cinema?.name,
          details: film.source_url ?? undefined,
        })
      : null;

  const langTag = time?.language === 'english' ? ' (ENG)' : time?.language === 'japanese' ? ' (日本)' : '';

  return (
    <>
      <button className="back-head" onClick={goBack}>
        <iconify-icon icon="solar:arrow-left-linear" />
        <span>Back</span>
      </button>

      <div className="scroll" style={{ paddingTop: 4, gap: 14 }}>
        <Poster url={film.poster_url} alt={primary} language={filmLanguage(film)} size="full" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="film-title" style={{ fontSize: 20 }}>
            {primary}
          </div>
          {secondary && <div className="film-sub" style={{ fontSize: 14 }}>{secondary}</div>}
          {meta && <div className="film-meta">{meta}</div>}
        </div>

        {film.description && (
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>{film.description}</div>
        )}

        {film.cast.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="cast-label">Cast</div>
            <div style={{ fontSize: 13 }}>{film.cast.join(' · ')}</div>
          </div>
        )}

        <div className="divider-row">
          <span className="label">Screenings</span>
          <span className="line" />
        </div>

        {dates.length ? (
          <>
            <DateChips dates={dates} selected={date} onSelect={selectDate} size="lg" />
            <TimeChips times={times} size="lg" selected={time} onSelect={setTime} />
          </>
        ) : (
          <div className="empty-sub">No screening times published yet.</div>
        )}

        {film.source_url && (
          <a className="aeon-link" href={film.source_url} target="_blank" rel="noreferrer">
            <span>View on AEON website</span>
            <iconify-icon icon="solar:square-top-up-linear" />
          </a>
        )}
      </div>

      <div className="cal-footer">
        <a
          className="cal-btn"
          href={calUrl ?? undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!calUrl}
          onClick={(e) => {
            // First use: show the privacy explainer instead of navigating.
            if (!calUrl || hasCalendarConsent()) return;
            e.preventDefault();
            setConsentOpen(true);
          }}
        >
          <iconify-icon icon="solar:calendar-add-linear" />
          <span>Add to Google Calendar</span>
        </a>
        <div className="cal-caption">
          {date && time
            ? `${formatShortDate(date)} · ${time.time} · ${primary}${langTag}`
            : 'Pick a date and time above'}
        </div>
      </div>

      {consentOpen && (
        <CalendarConsentSheet
          onCancel={() => setConsentOpen(false)}
          onConfirm={() => {
            grantCalendarConsent();
            setConsentOpen(false);
            if (calUrl) window.open(calUrl, '_blank', 'noopener');
          }}
        />
      )}
    </>
  );
}
