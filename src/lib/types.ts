/** Domain types — mirror the Supabase schema (supabase/migrations). */

export type CinemaId = 'utazu' | 'ayagawa' | (string & {});
export type Language = 'english' | 'japanese' | 'unknown';
export type FilmStatus = 'now_showing' | 'upcoming';

export type Cinema = {
  id: CinemaId;
  name: string;
  url_mobile: string;
  display_order: number;
};

export type Screening = {
  id: string;
  film_id: string;
  date: string; // 'YYYY-MM-DD'
  times: string[]; // ['10:00', '13:30']
  language: Language;
  screen: string | null;
};

export type Film = {
  id: string;
  cinema_id: CinemaId;
  title: string;
  title_original: string | null;
  description: string | null;
  cast: string[];
  poster_url: string | null;
  status: FilmStatus;
  language: Language;
  run_from: string | null;
  run_to: string | null;
  source_url: string | null;
  first_seen_at: string;
  last_scraped_at: string;
};

/** A film with its screenings joined — the shape the UI renders. */
export type FilmWithScreenings = Film & {
  screenings: Screening[];
};

export type ScrapeLog = {
  id: string;
  cinema_id: CinemaId | null;
  started_at: string;
  finished_at: string | null;
  status: 'success' | 'error' | null;
  error_msg: string | null;
};
