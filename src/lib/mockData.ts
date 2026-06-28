// AUTO-GENERATED mock data (from real captured AEON Utazu schedule). Preview only.
import type { Cinema, FilmWithScreenings, ScrapeLog } from './types';

export const MOCK_CINEMAS: Cinema[] = [
  { id: 'utazu', name: 'AEON Cinema Utazu', url_mobile: 'https://cinema.aeoncinema.com/wm/utazu/', display_order: 0 },
  { id: 'ayagawa', name: 'AEON Cinema Ayagawa', url_mobile: 'https://cinema.aeoncinema.com/wm/ayagawa/', display_order: 1 },
];

export const MOCK_SCRAPE: ScrapeLog = { id: 'mock', cinema_id: 'utazu', started_at: '2026-06-27T21:00:00.000Z', finished_at: '2026-06-27T21:00:30.000Z', status: 'success', error_msg: null };

const UTAZU: { now_showing: FilmWithScreenings[]; upcoming: FilmWithScreenings[] } = {
  now_showing: [
  {
    "id": "utazu-1014191-english",
    "cinema_id": "utazu",
    "title": "プラダを着た悪魔２",
    "title_original": "The Devil Wears Prada2",
    "description": "Andy returns to the world of high fashion as Miranda Priestly confronts the decline of print and a rival who's a very familiar face. A sharp, stylish sequel about ambition and reinvention.",
    "cast": [
      "Anne Hathaway",
      "Meryl Streep",
      "Emily Blunt",
      "Stanley Tucci"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzNEMkY2QicvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014191-english-s0",
        "film_id": "utazu-1014191-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン2",
        "times": [
          "08:25"
        ]
      },
      {
        "id": "utazu-1014191-english-s1",
        "film_id": "utazu-1014191-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン2",
        "times": [
          "08:25"
        ]
      },
      {
        "id": "utazu-1014191-english-s2",
        "film_id": "utazu-1014191-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "13:45"
        ]
      },
      {
        "id": "utazu-1014191-english-s3",
        "film_id": "utazu-1014191-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "13:45"
        ]
      },
      {
        "id": "utazu-1014191-english-s4",
        "film_id": "utazu-1014191-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "13:45"
        ]
      },
      {
        "id": "utazu-1014191-english-s5",
        "film_id": "utazu-1014191-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "13:45"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014541-english",
    "cinema_id": "utazu",
    "title": "【午前十時の映画祭16】マンハッタン　4K",
    "title_original": "MANHATTAN",
    "description": "Woody Allen's love letter to New York, restored in 4K. A TV writer juggles tangled relationships against the black-and-white skyline of the city he adores.",
    "cast": [
      "Woody Allen",
      "Diane Keaton",
      "Mariel Hemingway"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzI3NDE0QScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014541-english-s0",
        "film_id": "utazu-1014541-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "09:00"
        ]
      },
      {
        "id": "utazu-1014541-english-s1",
        "film_id": "utazu-1014541-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "09:00"
        ]
      },
      {
        "id": "utazu-1014541-english-s2",
        "film_id": "utazu-1014541-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "09:20"
        ]
      },
      {
        "id": "utazu-1014541-english-s3",
        "film_id": "utazu-1014541-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "09:20"
        ]
      },
      {
        "id": "utazu-1014541-english-s4",
        "film_id": "utazu-1014541-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "09:20"
        ]
      },
      {
        "id": "utazu-1014541-english-s5",
        "film_id": "utazu-1014541-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン4",
        "times": [
          "09:20"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014507-english",
    "cinema_id": "utazu",
    "title": "スーパーガール",
    "title_original": "Supergirl",
    "description": "Kara Zor-El steps out of Superman's shadow to face a threat that tests the limits of her power — and her humanity.",
    "cast": [
      "Milly Alcock",
      "Matthias Schoenaerts",
      "Eve Ridley"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzQ2MjczQScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014507-english-s0",
        "film_id": "utazu-1014507-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "09:00",
          "14:00",
          "18:50"
        ]
      },
      {
        "id": "utazu-1014507-english-s1",
        "film_id": "utazu-1014507-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "09:00",
          "14:00",
          "18:50"
        ]
      },
      {
        "id": "utazu-1014507-english-s2",
        "film_id": "utazu-1014507-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "utazu-1014507-english-s3",
        "film_id": "utazu-1014507-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "utazu-1014507-english-s4",
        "film_id": "utazu-1014507-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "utazu-1014507-english-s5",
        "film_id": "utazu-1014507-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014256-english",
    "cinema_id": "utazu",
    "title": "Michael／マイケル",
    "title_original": "Michael",
    "description": "The life and music of Michael Jackson, from the Jackson 5 to global superstardom, in a sweeping musical biopic.",
    "cast": [
      "Jaafar Jackson",
      "Colman Domingo",
      "Nia Long"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzI3NEEzOCcvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014256-english-s0",
        "film_id": "utazu-1014256-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "10:00",
          "12:40",
          "15:25",
          "18:05",
          "20:45"
        ]
      },
      {
        "id": "utazu-1014256-english-s1",
        "film_id": "utazu-1014256-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "10:00",
          "12:40",
          "15:25",
          "18:05",
          "20:45"
        ]
      },
      {
        "id": "utazu-1014256-english-s2",
        "film_id": "utazu-1014256-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "utazu-1014256-english-s3",
        "film_id": "utazu-1014256-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "utazu-1014256-english-s4",
        "film_id": "utazu-1014256-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "utazu-1014256-english-s5",
        "film_id": "utazu-1014256-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014026-english",
    "cinema_id": "utazu",
    "title": "スター・ウォーズ／マンダロリアン・アンド・グローグー",
    "title_original": "The Mandalorian and Grogu",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzRBM0EyNycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014026-english-s0",
        "film_id": "utazu-1014026-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン6",
        "times": [
          "12:30"
        ]
      },
      {
        "id": "utazu-1014026-english-s1",
        "film_id": "utazu-1014026-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン6",
        "times": [
          "15:00"
        ]
      },
      {
        "id": "utazu-1014026-english-s2",
        "film_id": "utazu-1014026-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "utazu-1014026-english-s3",
        "film_id": "utazu-1014026-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "utazu-1014026-english-s4",
        "film_id": "utazu-1014026-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "utazu-1014026-english-s5",
        "film_id": "utazu-1014026-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014507-japanese",
    "cinema_id": "utazu",
    "title": "スーパーガール",
    "title_original": "Supergirl",
    "description": "Kara Zor-El steps out of Superman's shadow to face a threat that tests the limits of her power — and her humanity.",
    "cast": [
      "Milly Alcock",
      "Matthias Schoenaerts",
      "Eve Ridley"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzQ2MjczQScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014507-japanese-s0",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "11:30",
          "16:25",
          "21:15"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s1",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "11:30",
          "16:25",
          "21:15"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s2",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s3",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s4",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s5",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s6",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s7",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s8",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "utazu-1014507-japanese-s9",
        "film_id": "utazu-1014507-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014026-japanese",
    "cinema_id": "utazu",
    "title": "スター・ウォーズ／マンダロリアン・アンド・グローグー",
    "title_original": "The Mandalorian and Grogu",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzRBM0EyNycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014026-japanese-s0",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "21:05"
        ]
      },
      {
        "id": "utazu-1014026-japanese-s1",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "21:05"
        ]
      },
      {
        "id": "utazu-1014026-japanese-s2",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "utazu-1014026-japanese-s3",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "utazu-1014026-japanese-s4",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "utazu-1014026-japanese-s5",
        "film_id": "utazu-1014026-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014397-japanese",
    "cinema_id": "utazu",
    "title": "映画「それいけ！アンパンマン　パンタンと約束の星」",
    "title_original": "Anpanman Pantan to Yakusoku no",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzM3Mjc0QScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014397-japanese-s0",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン5",
        "times": [
          "08:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s1",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s2",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "11:45"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s3",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s4",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン5",
        "times": [
          "08:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s5",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s6",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "11:45"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s7",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s8",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s9",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s10",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s11",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s12",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s13",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s14",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s15",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s16",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s17",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s18",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "utazu-1014397-japanese-s19",
        "film_id": "utazu-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014166-japanese",
    "cinema_id": "utazu",
    "title": "ザ・スーパーマリオギャラクシー・ムービー",
    "title_original": "The Super Mario Galaxy Movie",
    "description": "Mario and friends blast across the galaxy in a dazzling animated adventure to save the Mushroom Kingdom from a cosmic threat.",
    "cast": [
      "Chris Pratt",
      "Anya Taylor-Joy",
      "Jack Black",
      "Charlie Day"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzJCMkEzMycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-06-28",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014166-japanese-s0",
        "film_id": "utazu-1014166-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "08:50"
        ]
      },
      {
        "id": "utazu-1014166-japanese-s1",
        "film_id": "utazu-1014166-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "13:30"
        ]
      },
      {
        "id": "utazu-1014166-japanese-s2",
        "film_id": "utazu-1014166-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "08:50"
        ]
      },
      {
        "id": "utazu-1014166-japanese-s3",
        "film_id": "utazu-1014166-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "13:30"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014257-japanese",
    "cinema_id": "utazu",
    "title": "新劇場版☆ケロロ軍曹 復活して速攻地球滅亡の危機であります！",
    "title_original": "SGT FROG",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzQ0NDE0RScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014257-japanese-s0",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "08:50",
          "11:10",
          "15:45"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s1",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:50"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s2",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "08:50",
          "11:10",
          "15:45"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s3",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:50"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s4",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "11:25",
          "16:15",
          "18:35"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s5",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:55"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s6",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "11:25",
          "16:15",
          "18:35"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s7",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:55"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s8",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "11:25",
          "16:15",
          "18:35"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s9",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:55"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s10",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "11:25",
          "16:15",
          "18:35"
        ]
      },
      {
        "id": "utazu-1014257-japanese-s11",
        "film_id": "utazu-1014257-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "20:55"
        ]
      }
    ]
  }
],
  upcoming: [
  {
    "id": "utazu-1014418-japanese",
    "cinema_id": "utazu",
    "title": "免許返納!?",
    "title_original": "Menkyo Henno",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzMzMzA0QScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "upcoming",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-27",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014418-japanese-s0",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "09:15"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s1",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "11:10",
          "13:40"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s2",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "09:15"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s3",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "11:10",
          "13:40"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s4",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "09:25",
          "11:55",
          "15:55"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s5",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s6",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "09:25",
          "11:55",
          "15:55"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s7",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s8",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "09:25",
          "11:55",
          "15:55"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s9",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s10",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "09:25",
          "11:55",
          "15:55"
        ]
      },
      {
        "id": "utazu-1014418-japanese-s11",
        "film_id": "utazu-1014418-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "14:00"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014469-japanese",
    "cinema_id": "utazu",
    "title": "黒牢城",
    "title_original": "Kokurojo",
    "description": "戦国の世、幽閉された武将と軍師が、城内で起こる不可解な事件の謎に挑む歴史ミステリー。",
    "cast": [
      "佐藤健",
      "岡田准一"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzJFNDYzMCcvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "upcoming",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-27",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014469-japanese-s0",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s1",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "14:40",
          "20:15"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s2",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:45"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s3",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s4",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "14:40",
          "20:15"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s5",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:45"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s6",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "09:35"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s7",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:30",
          "20:25"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s8",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:55"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s9",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "09:35"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s10",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:30",
          "20:25"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s11",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:55"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s12",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "09:35"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s13",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:30",
          "20:25"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s14",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:55"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s15",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "09:35"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s16",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:30",
          "20:25"
        ]
      },
      {
        "id": "utazu-1014469-japanese-s17",
        "film_id": "utazu-1014469-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "17:55"
        ]
      }
    ]
  },
  {
    "id": "utazu-1014452-japanese",
    "cinema_id": "utazu",
    "title": "ブルーイ in シネマ みちしるべ",
    "title_original": "Bluey in Cinema The Sign",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzRBMkUyRScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "upcoming",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/utazu/",
    "first_seen_at": "2026-06-27",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "utazu-1014452-japanese-s0",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:15"
        ]
      },
      {
        "id": "utazu-1014452-japanese-s1",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "13:15"
        ]
      },
      {
        "id": "utazu-1014452-japanese-s2",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "12:35"
        ]
      },
      {
        "id": "utazu-1014452-japanese-s3",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "12:35"
        ]
      },
      {
        "id": "utazu-1014452-japanese-s4",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "12:35"
        ]
      },
      {
        "id": "utazu-1014452-japanese-s5",
        "film_id": "utazu-1014452-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "12:35"
        ]
      }
    ]
  }
],
};
const AYAGAWA: { now_showing: FilmWithScreenings[]; upcoming: FilmWithScreenings[] } = {
  now_showing: [
  {
    "id": "ayagawa-1014507-english",
    "cinema_id": "ayagawa",
    "title": "スーパーガール",
    "title_original": "Supergirl",
    "description": "Kara Zor-El steps out of Superman's shadow to face a threat that tests the limits of her power — and her humanity.",
    "cast": [
      "Milly Alcock",
      "Matthias Schoenaerts",
      "Eve Ridley"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzQ2MjczQScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014507-english-s0",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "09:00",
          "14:00",
          "18:50"
        ]
      },
      {
        "id": "ayagawa-1014507-english-s1",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "09:00",
          "14:00",
          "18:50"
        ]
      },
      {
        "id": "ayagawa-1014507-english-s2",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "ayagawa-1014507-english-s3",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "ayagawa-1014507-english-s4",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      },
      {
        "id": "ayagawa-1014507-english-s5",
        "film_id": "ayagawa-1014507-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン1",
        "times": [
          "11:00",
          "15:50",
          "20:45"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014256-english",
    "cinema_id": "ayagawa",
    "title": "Michael／マイケル",
    "title_original": "Michael",
    "description": "The life and music of Michael Jackson, from the Jackson 5 to global superstardom, in a sweeping musical biopic.",
    "cast": [
      "Jaafar Jackson",
      "Colman Domingo",
      "Nia Long"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzI3NEEzOCcvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014256-english-s0",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "10:00",
          "12:40",
          "15:25",
          "18:05",
          "20:45"
        ]
      },
      {
        "id": "ayagawa-1014256-english-s1",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "10:00",
          "12:40",
          "15:25",
          "18:05",
          "20:45"
        ]
      },
      {
        "id": "ayagawa-1014256-english-s2",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "ayagawa-1014256-english-s3",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "ayagawa-1014256-english-s4",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      },
      {
        "id": "ayagawa-1014256-english-s5",
        "film_id": "ayagawa-1014256-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン5",
        "times": [
          "09:50",
          "12:30",
          "15:10",
          "17:50",
          "20:35"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014026-english",
    "cinema_id": "ayagawa",
    "title": "スター・ウォーズ／マンダロリアン・アンド・グローグー",
    "title_original": "The Mandalorian and Grogu",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzRBM0EyNycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "english",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014026-english-s0",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-06-27",
        "language": "english",
        "screen": "スクリーン6",
        "times": [
          "12:30"
        ]
      },
      {
        "id": "ayagawa-1014026-english-s1",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-06-28",
        "language": "english",
        "screen": "スクリーン6",
        "times": [
          "15:00"
        ]
      },
      {
        "id": "ayagawa-1014026-english-s2",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-06-29",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "ayagawa-1014026-english-s3",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-06-30",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "ayagawa-1014026-english-s4",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-07-01",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      },
      {
        "id": "ayagawa-1014026-english-s5",
        "film_id": "ayagawa-1014026-english",
        "date": "2026-07-02",
        "language": "english",
        "screen": "スクリーン7",
        "times": [
          "21:10"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014507-japanese",
    "cinema_id": "ayagawa",
    "title": "スーパーガール",
    "title_original": "Supergirl",
    "description": "Kara Zor-El steps out of Superman's shadow to face a threat that tests the limits of her power — and her humanity.",
    "cast": [
      "Milly Alcock",
      "Matthias Schoenaerts",
      "Eve Ridley"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzQ2MjczQScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014507-japanese-s0",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "11:30",
          "16:25",
          "21:15"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s1",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "11:30",
          "16:25",
          "21:15"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s2",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s3",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s4",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s5",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s6",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s7",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s8",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "10:00"
        ]
      },
      {
        "id": "ayagawa-1014507-japanese-s9",
        "film_id": "ayagawa-1014507-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "13:25",
          "18:15"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014026-japanese",
    "cinema_id": "ayagawa",
    "title": "スター・ウォーズ／マンダロリアン・アンド・グローグー",
    "title_original": "The Mandalorian and Grogu",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzRBM0EyNycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014026-japanese-s0",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "21:05"
        ]
      },
      {
        "id": "ayagawa-1014026-japanese-s1",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "21:05"
        ]
      },
      {
        "id": "ayagawa-1014026-japanese-s2",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "ayagawa-1014026-japanese-s3",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "ayagawa-1014026-japanese-s4",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      },
      {
        "id": "ayagawa-1014026-japanese-s5",
        "film_id": "ayagawa-1014026-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:25"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014397-japanese",
    "cinema_id": "ayagawa",
    "title": "映画「それいけ！アンパンマン　パンタンと約束の星」",
    "title_original": "Anpanman Pantan to Yakusoku no",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzM3Mjc0QScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014397-japanese-s0",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン5",
        "times": [
          "08:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s1",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s2",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "11:45"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s3",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s4",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン5",
        "times": [
          "08:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s5",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "11:00"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s6",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "11:45"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s7",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:00"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s8",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s9",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s10",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s11",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s12",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s13",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s14",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s15",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s16",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s17",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン1",
        "times": [
          "09:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s18",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン3",
        "times": [
          "12:00",
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014397-japanese-s19",
        "film_id": "ayagawa-1014397-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "14:25"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014166-japanese",
    "cinema_id": "ayagawa",
    "title": "ザ・スーパーマリオギャラクシー・ムービー",
    "title_original": "The Super Mario Galaxy Movie",
    "description": "Mario and friends blast across the galaxy in a dazzling animated adventure to save the Mushroom Kingdom from a cosmic threat.",
    "cast": [
      "Chris Pratt",
      "Anya Taylor-Joy",
      "Jack Black",
      "Charlie Day"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzJCMkEzMycvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "now_showing",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-06-28",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-22",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014166-japanese-s0",
        "film_id": "ayagawa-1014166-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "08:50"
        ]
      },
      {
        "id": "ayagawa-1014166-japanese-s1",
        "film_id": "ayagawa-1014166-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "13:30"
        ]
      },
      {
        "id": "ayagawa-1014166-japanese-s2",
        "film_id": "ayagawa-1014166-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "08:50"
        ]
      },
      {
        "id": "ayagawa-1014166-japanese-s3",
        "film_id": "ayagawa-1014166-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン4",
        "times": [
          "13:30"
        ]
      }
    ]
  }
],
  upcoming: [
  {
    "id": "ayagawa-1014190-japanese",
    "cinema_id": "ayagawa",
    "title": "名探偵コナン ハイウェイの堕天使",
    "title_original": "Detective Conan 2026",
    "description": "名探偵コナンシリーズ最新作。ハイウェイを舞台に、息もつかせぬ推理とアクションが展開する。",
    "cast": [
      "高山みなみ",
      "山崎和佳奈"
    ],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzJFM0U0QScvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "upcoming",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-07-02",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-27",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014190-japanese-s0",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "15:15"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s1",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "20:20"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s2",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン6",
        "times": [
          "12:30"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s3",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-28",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "20:00"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s4",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s5",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-29",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "21:00"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s6",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s7",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-06-30",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "21:00"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s8",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s9",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-07-01",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "21:00"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s10",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン7",
        "times": [
          "16:30"
        ]
      },
      {
        "id": "ayagawa-1014190-japanese-s11",
        "film_id": "ayagawa-1014190-japanese",
        "date": "2026-07-02",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "21:00"
        ]
      }
    ]
  },
  {
    "id": "ayagawa-1014829-japanese",
    "cinema_id": "ayagawa",
    "title": "【ディレイ・ビューイング】芸能生活３０周年記念！！大泉洋リサイタル２-リベンジ-",
    "title_original": "Delay Viewing 30th Anniversary of My Entertainment Career!! Yo Oizumi Recital 2",
    "description": null,
    "cast": [],
    "poster_url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0MDAgNjAwJz48cmVjdCB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nIzNEMkY2QicvPjxnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLW9wYWNpdHk9JzAuMjInIHN0cm9rZS13aWR0aD0nOScgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMTUwJyB5PScyNTAnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyByeD0nMTAnLz48bGluZSB4MT0nMTUwJyB5MT0nMjgwJyB4Mj0nMjUwJyB5Mj0nMjgwJy8+PGxpbmUgeDE9JzE1MCcgeTE9JzMyMCcgeDI9JzI1MCcgeTI9JzMyMCcvPjwvZz48L3N2Zz4=",
    "status": "upcoming",
    "language": "japanese",
    "run_from": "2026-06-27",
    "run_to": "2026-06-27",
    "source_url": "https://cinema.aeoncinema.com/wm/ayagawa/",
    "first_seen_at": "2026-06-27",
    "last_scraped_at": "2026-06-27T21:00:00.000Z",
    "screenings": [
      {
        "id": "ayagawa-1014829-japanese-s0",
        "film_id": "ayagawa-1014829-japanese",
        "date": "2026-06-27",
        "language": "japanese",
        "screen": "スクリーン2",
        "times": [
          "16:00"
        ]
      }
    ]
  }
],
};

export const MOCK_FILMS_BY_CINEMA: Record<string, { now_showing: FilmWithScreenings[]; upcoming: FilmWithScreenings[] }> = {
  utazu: UTAZU, ayagawa: AYAGAWA,
};

const ALL: FilmWithScreenings[] = [
  ...UTAZU.now_showing, ...UTAZU.upcoming, ...AYAGAWA.now_showing, ...AYAGAWA.upcoming,
];
export function mockFilmById(id: string | undefined): FilmWithScreenings | null {
  return ALL.find((f) => f.id === id) ?? null;
}
