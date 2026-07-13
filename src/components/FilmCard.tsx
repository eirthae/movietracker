import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DateChips, TimeChips } from '@/components/ScreeningPicker';
import { Poster } from '@/components/Poster';
import { formatRun, todayJst } from '@/lib/format';
import { displayTitle, filmLanguage, screeningDates, timesOn } from '@/lib/queries';
import type { FilmWithScreenings, ShowTime } from '@/lib/types';

function metaLine(film: FilmWithScreenings): string | null {
  const run = formatRun(film.run_from, film.run_to, film.status);
  const genres = film.genres.length ? film.genres.join(', ') : null;
  if (run && genres) return `${run} · ${genres}`;
  return run ?? genres;
}

/** Full card for Now Showing: info block + inline screenings picker. */
export function FilmCard({ film }: { film: FilmWithScreenings }) {
  const navigate = useNavigate();
  const { primary, secondary } = displayTitle(film);
  const dates = useMemo(() => screeningDates(film), [film]);
  const today = todayJst();
  const defaultDate = dates.find((d) => d >= today) ?? dates[dates.length - 1] ?? null;

  const [open, setOpen] = useState(true);
  const [date, setDate] = useState<string | null>(defaultDate);
  const times = date ? timesOn(film, date) : [];

  const goToDetail = (t?: ShowTime) => {
    const params = t && date ? `?date=${date}&time=${t.time}&lang=${t.language}` : '';
    navigate(`/film/${film.id}${params}`);
  };

  return (
    <article className="card">
      <button className="card-main" onClick={() => goToDetail()}>
        <Poster url={film.poster_url} alt={primary} language={filmLanguage(film)} size="md" />
        <div className="film-info">
          <div className="film-title">{primary}</div>
          {secondary && <div className="film-sub">{secondary}</div>}
          {metaLine(film) && <div className="film-meta">{metaLine(film)}</div>}
          {film.description && <div className="film-desc">{film.description}</div>}
          {film.cast.length > 0 && <div className="film-cast">Cast: {film.cast.join(', ')}</div>}
        </div>
      </button>

      {dates.length > 0 && (
        <div className="screenings-block">
          <button className="screenings-toggle" onClick={() => setOpen((o) => !o)}>
            <iconify-icon
              icon={open ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
            />
            <span>Screenings</span>
          </button>
          {open && (
            <>
              <DateChips dates={dates} selected={date} onSelect={setDate} />
              <TimeChips times={times} onSelect={(t) => goToDetail(t)} />
            </>
          )}
        </div>
      )}
    </article>
  );
}

/** Compact card for Coming Soon. */
export function ComingSoonCard({ film }: { film: FilmWithScreenings }) {
  const navigate = useNavigate();
  const { primary } = displayTitle(film);

  return (
    <button className="card" onClick={() => navigate(`/film/${film.id}`)}>
      <div className="card-main">
        <Poster url={film.poster_url} alt={primary} language={filmLanguage(film)} size="sm" />
        <div className="film-info">
          <div className="film-title">{primary}</div>
          {metaLine(film) && <div className="film-meta">{metaLine(film)}</div>}
          {film.description && <div className="film-desc two-lines">{film.description}</div>}
        </div>
      </div>
    </button>
  );
}
