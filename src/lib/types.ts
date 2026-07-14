/** Domain types — mirror the Supabase schema (supabase/migrations). */

export type Language = 'english' | 'japanese' | 'unknown';
export type FilmStatus = 'now_showing' | 'upcoming';

export type Cinema = {
  id: string; // 'utazu' (AEON), 'toho-032', 'parks-namba'
  chain: string; // 'aeon' | 'toho' | 'parks'
  slug: string; // chain-local code
  name: string;
  schedule_url: string;
  display_order: number;
};

export type Screening = {
  id: string;
  film_id: string;
  date: string; // 'YYYY-MM-DD' (JST)
  language: Language;
  times: string[]; // ['10:00', '13:30'] (JST)
};

export type Film = {
  id: string;
  cinema_id: string;
  source_id: string;
  title: string; // Japanese display title
  title_original: string | null; // English title when different
  description: string | null;
  poster_url: string | null;
  duration_min: number | null;
  genres: string[];
  cast: string[];
  status: FilmStatus;
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
  cinema_id: string | null;
  started_at: string;
  finished_at: string | null;
  status: 'success' | 'error' | null;
  error_msg: string | null;
};

/** One bookable slot, flattened for the pickers: a date + time + language. */
export type ShowTime = {
  time: string; // 'HH:mm'
  language: Language;
};
