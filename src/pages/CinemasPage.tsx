import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ComingSoonCard, FilmCard } from '@/components/FilmCard';
import { formatTimestampDate } from '@/lib/format';
import { useCinemaFilms, useCinemas, useLastScrape } from '@/lib/queries';
import type { Cinema } from '@/lib/types';

function shortName(name: string): string {
  return name.replace(/^AEON Cinema /, 'AEON ').replace(/^TOHO Cinemas /, 'TOHO ');
}

function CinemaTab({
  cinema,
  active,
  onSelect,
}: {
  cinema: Cinema;
  active: boolean;
  onSelect: () => void;
}) {
  const scrapeQ = useLastScrape(cinema.id);
  const updated = scrapeQ.data ? formatTimestampDate(scrapeQ.data.started_at) : '—';
  return (
    <button className={`cinema-tab${active ? ' active' : ''}`} onClick={onSelect}>
      <span>{shortName(cinema.name)}</span>
      <span className="updated">Updated {updated}</span>
    </button>
  );
}

export function CinemasPage() {
  const navigate = useNavigate();
  const cinemasQ = useCinemas();
  const cinemas = cinemasQ.data ?? [];

  const [selectedId, setSelectedId] = useState<string | undefined>();
  useEffect(() => {
    if (!cinemas.length) return;
    if (!selectedId || !cinemas.some((c) => c.id === selectedId)) {
      setSelectedId(cinemas[0].id);
    }
  }, [cinemas, selectedId]);

  const filmsQ = useCinemaFilms(selectedId);
  const [comingSoonOpen, setComingSoonOpen] = useState(true);

  if (cinemasQ.isLoading) {
    return (
      <div className="centered">
        <div className="spinner" />
      </div>
    );
  }

  if (!cinemas.length) {
    return (
      <div className="centered">
        <button className="empty-add" onClick={() => navigate('/add')} aria-label="Add a cinema">
          <iconify-icon icon="solar:add-circle-linear" />
        </button>
        <div className="empty-headline">Add a cinema to get movies</div>
        <div className="empty-sub">
          Paste a cinema schedule link — films, showtimes and ENG/日本語 tags show up here.
        </div>
      </div>
    );
  }

  const films = filmsQ.data;
  const selectedCinema = cinemas.find((c) => c.id === selectedId);

  return (
    <>
      <div className="cinema-tabs">
        {cinemas.map((c) => (
          <CinemaTab
            key={c.id}
            cinema={c}
            active={c.id === selectedId}
            onSelect={() => setSelectedId(c.id)}
          />
        ))}
        <button className="add-cinema-btn" onClick={() => navigate('/add')} aria-label="Add cinema">
          <iconify-icon icon="solar:add-circle-linear" />
        </button>
      </div>

      <div className="scroll">
        {filmsQ.isLoading && (
          <div className="centered">
            <div className="spinner" />
          </div>
        )}
        {filmsQ.isError && <div className="error-text">Couldn't load films. Pull down or retry later.</div>}

        {films && (
          <>
            <div className="section-title">Now Showing</div>
            {films.now_showing.length === 0 && (
              <div className="empty-sub">Nothing on the schedule right now.</div>
            )}
            {films.now_showing.map((f) => (
              <FilmCard key={f.id} film={f} cinemaName={selectedCinema?.name} />
            ))}

            {films.upcoming.length > 0 && (
              <>
                <button className="section-toggle" onClick={() => setComingSoonOpen((o) => !o)}>
                  <span className="section-title">Coming Soon</span>
                  <iconify-icon
                    icon={comingSoonOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                  />
                </button>
                {comingSoonOpen &&
                  films.upcoming.map((f) => <ComingSoonCard key={f.id} film={f} />)}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
