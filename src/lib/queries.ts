/** React Query hooks over Supabase (or bundled mock data). */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addMockCinema, getMockCinemas, MOCK_FILMS, mockScrapeLog } from './mock';
import { supabase, USE_MOCK } from './supabase';
import type { Cinema, FilmStatus, FilmWithScreenings, Language, ScrapeLog, ShowTime } from './types';

// ── Derivations ──────────────────────────────────────────────────────

/** A film's headline language: English if any screening is English. */
export function filmLanguage(film: FilmWithScreenings): Language {
  if (film.screenings.some((s) => s.language === 'english')) return 'english';
  if (film.screenings.some((s) => s.language === 'japanese')) return 'japanese';
  return 'unknown';
}

export function hasEnglish(film: FilmWithScreenings): boolean {
  return filmLanguage(film) === 'english';
}

/**
 * Which title to show. English/Western films lead with their English name
 * (Japanese kept as a small secondary — that's what's on the cinema signage);
 * Japanese films keep their Japanese name.
 */
export function displayTitle(film: FilmWithScreenings): {
  primary: string;
  secondary: string | null;
} {
  if (hasEnglish(film) && film.title_original) {
    const primary = film.title_original.trim();
    const secondary = film.title && film.title !== primary ? film.title : null;
    return { primary, secondary };
  }
  return { primary: film.title, secondary: null };
}

/** Distinct screening dates for a film, ascending. */
export function screeningDates(film: FilmWithScreenings): string[] {
  return [...new Set(film.screenings.map((s) => s.date))].sort();
}

/** All show times on one date (languages merged), sorted by time. */
export function timesOn(film: FilmWithScreenings, date: string): ShowTime[] {
  const out: ShowTime[] = [];
  for (const s of film.screenings) {
    if (s.date !== date) continue;
    for (const time of s.times) out.push({ time, language: s.language });
  }
  return out.sort((a, b) => a.time.localeCompare(b.time));
}

function sortFilms(list: FilmWithScreenings[]): FilmWithScreenings[] {
  // English films float to the top, then by title.
  return [...list].sort((a, b) => {
    const ae = hasEnglish(a) ? 0 : 1;
    const be = hasEnglish(b) ? 0 : 1;
    if (ae !== be) return ae - be;
    return displayTitle(a).primary.localeCompare(displayTitle(b).primary);
  });
}

// ── Queries ──────────────────────────────────────────────────────────

export function useCinemas() {
  return useQuery({
    queryKey: ['cinemas'],
    queryFn: async (): Promise<Cinema[]> => {
      if (USE_MOCK) return getMockCinemas();
      const { data, error } = await supabase
        .from('cinemas')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type CinemaFilms = Record<FilmStatus, FilmWithScreenings[]>;

export function useCinemaFilms(cinemaId: string | undefined) {
  return useQuery({
    enabled: !!cinemaId,
    queryKey: ['films', cinemaId],
    queryFn: async (): Promise<CinemaFilms> => {
      let films: FilmWithScreenings[];
      if (USE_MOCK) {
        films = MOCK_FILMS.filter((f) => f.cinema_id === cinemaId);
      } else {
        const { data, error } = await supabase
          .from('films')
          .select('*, screenings(*)')
          .eq('cinema_id', cinemaId);
        if (error) throw error;
        films = (data ?? []) as FilmWithScreenings[];
      }
      return {
        now_showing: sortFilms(films.filter((f) => f.status === 'now_showing')),
        upcoming: sortFilms(films.filter((f) => f.status === 'upcoming')),
      };
    },
  });
}

export function useFilm(filmId: string | undefined) {
  return useQuery({
    enabled: !!filmId,
    queryKey: ['film', filmId],
    queryFn: async (): Promise<FilmWithScreenings | null> => {
      if (USE_MOCK) return MOCK_FILMS.find((f) => f.id === filmId) ?? null;
      const { data, error } = await supabase
        .from('films')
        .select('*, screenings(*)')
        .eq('id', filmId)
        .maybeSingle();
      if (error) throw error;
      return (data as FilmWithScreenings) ?? null;
    },
  });
}

/** Most recent successful scrape for a cinema — the "Updated …" tab label. */
export function useLastScrape(cinemaId: string | undefined) {
  return useQuery({
    enabled: !!cinemaId,
    queryKey: ['lastScrape', cinemaId],
    queryFn: async (): Promise<ScrapeLog | null> => {
      if (USE_MOCK) return mockScrapeLog(cinemaId ?? null);
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

/** Most recent successful scrape overall — Settings "Last scrape" row. */
export function useLatestScrape() {
  return useQuery({
    queryKey: ['latestScrape'],
    queryFn: async (): Promise<ScrapeLog | null> => {
      if (USE_MOCK) return getMockCinemas().length ? mockScrapeLog(null) : null;
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

// ── Manage-cinema function calls ─────────────────────────────────────

export interface ValidateResult {
  ok: boolean;
  slug: string;
  name: string;
  films: number;
}

export async function validateCinemaUrl(url: string): Promise<ValidateResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const m = url.match(/aeoncinema\.com\/wm\/([a-z0-9_-]+)/i);
    if (!m) throw new Error('Could not read a cinema slug from that URL.');
    const slug = m[1].toLowerCase();
    if (getMockCinemas().some((c) => c.id === slug)) {
      throw new Error('That cinema is already added.');
    }
    const pretty = slug.charAt(0).toUpperCase() + slug.slice(1);
    const sampleCount = MOCK_FILMS.filter((f) => f.cinema_id === slug).length;
    return { ok: true, slug, name: `AEON Cinema ${pretty}`, films: sampleCount || 9 };
  }
  const { data, error } = await supabase.functions.invoke('manage-cinema', {
    body: { action: 'validate', url },
  });
  if (error) {
    // Edge functions return { error } bodies with non-2xx codes.
    const body = await (error as any).context?.json?.().catch(() => null);
    throw new Error(body?.error ?? error.message);
  }
  return data as ValidateResult;
}

export function useAddCinema() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, name }: { url: string; name: string }) => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        const slug = url.match(/aeoncinema\.com\/wm\/([a-z0-9_-]+)/i)?.[1]?.toLowerCase();
        if (!slug) throw new Error('Could not read a cinema slug from that URL.');
        addMockCinema(slug, name);
        return { ok: true };
      }
      const { data, error } = await supabase.functions.invoke('manage-cinema', {
        body: { action: 'add', url, name },
      });
      if (error) {
        const body = await (error as any).context?.json?.().catch(() => null);
        throw new Error(body?.error ?? error.message);
      }
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['cinemas'] });
      void qc.invalidateQueries({ queryKey: ['films'] });
    },
  });
}
