/** React Query hooks over Supabase. All reads use the publishable key. */
import { useQuery } from '@tanstack/react-query';

import { USE_MOCK } from './devFlags';
import {
  MOCK_CINEMAS,
  MOCK_FILMS_BY_CINEMA,
  MOCK_SCRAPE,
  mockFilmById,
} from './mockData';
import { supabase } from './supabase';
import type {
  Cinema,
  FilmStatus,
  FilmWithScreenings,
  Language,
  ScrapeLog,
} from './types';

/** A film's language (each language variant is its own film row now). */
export function filmLanguage(film: { language: Language }): Language {
  return film.language;
}

export function hasEnglish(film: { language: Language }): boolean {
  return film.language === 'english';
}

/**
 * Which title to show. English/Western films lead with their English name
 * (Japanese kept as a small secondary, since that's what's on the cinema
 * signage); Japanese films keep their Japanese name.
 */
export function displayTitle(film: {
  title: string;
  title_original: string | null;
  language: Language;
}): { primary: string; secondary: string | null } {
  if (film.language === 'english' && film.title_original) {
    const primary = film.title_original.trim();
    const secondary = film.title && film.title !== primary ? film.title : null;
    return { primary, secondary };
  }
  return { primary: film.title, secondary: null };
}

export const cinemasKey = ['cinemas'] as const;

export function useCinemas() {
  return useQuery({
    queryKey: cinemasKey,
    queryFn: async (): Promise<Cinema[]> => {
      if (USE_MOCK) return MOCK_CINEMAS;
      const { data, error } = await supabase
        .from('cinemas')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type CinemaFilms = {
  now_showing: FilmWithScreenings[];
  upcoming: FilmWithScreenings[];
};

export function cinemaFilmsKey(cinemaId: string) {
  return ['films', cinemaId] as const;
}

export function useCinemaFilms(cinemaId: string | undefined) {
  return useQuery({
    enabled: !!cinemaId,
    queryKey: cinemaFilmsKey(cinemaId ?? ''),
    queryFn: async (): Promise<CinemaFilms> => {
      let films: FilmWithScreenings[];
      if (USE_MOCK) {
        const m = MOCK_FILMS_BY_CINEMA[cinemaId ?? ''] ?? { now_showing: [], upcoming: [] };
        films = [...m.now_showing, ...m.upcoming];
      } else {
        const { data, error } = await supabase
          .from('films')
          .select('*, screenings(*)')
          .eq('cinema_id', cinemaId);
        if (error) throw error;
        films = (data ?? []) as FilmWithScreenings[];
      }

      // English-first ordering: films with any English screening float to top,
      // then by title. Within a film, screenings are sorted by date.
      const sortFilms = (list: FilmWithScreenings[]) =>
        list
          .map((f) => ({
            ...f,
            screenings: [...f.screenings].sort((a, b) =>
              a.date.localeCompare(b.date),
            ),
          }))
          .sort((a, b) => {
            const ae = hasEnglish(a) ? 0 : 1;
            const be = hasEnglish(b) ? 0 : 1;
            if (ae !== be) return ae - be;
            return a.title.localeCompare(b.title);
          });

      const byStatus = (status: FilmStatus) =>
        sortFilms(films.filter((f) => f.status === status));

      return {
        now_showing: byStatus('now_showing'),
        upcoming: byStatus('upcoming'),
      };
    },
  });
}

export function useFilm(filmId: string | undefined) {
  return useQuery({
    enabled: !!filmId,
    queryKey: ['film', filmId],
    queryFn: async (): Promise<FilmWithScreenings | null> => {
      if (USE_MOCK) return mockFilmById(filmId);
      const { data, error } = await supabase
        .from('films')
        .select('*, screenings(*)')
        .eq('id', filmId)
        .single();
      if (error) throw error;
      if (!data) return null;
      const film = data as FilmWithScreenings;
      film.screenings = [...film.screenings].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      return film;
    },
  });
}

/** Most recent successful scrape across all cinemas — for the Settings "About" row. */
export function useLatestScrape() {
  return useQuery({
    queryKey: ['latestScrape'],
    queryFn: async (): Promise<ScrapeLog | null> => {
      if (USE_MOCK) return MOCK_SCRAPE;
      const { data, error } = await supabase
        .from('scrape_log')
        .select('*')
        .eq('status', 'success')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });
}

/** Most recent successful scrape for a cinema — powers "Updated …" + stale banner. */
export function useLastScrape(cinemaId: string | undefined) {
  return useQuery({
    enabled: !!cinemaId,
    queryKey: ['lastScrape', cinemaId],
    queryFn: async (): Promise<ScrapeLog | null> => {
      if (USE_MOCK) return MOCK_SCRAPE;
      const { data, error } = await supabase
        .from('scrape_log')
        .select('*')
        .eq('cinema_id', cinemaId)
        .eq('status', 'success')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });
}
