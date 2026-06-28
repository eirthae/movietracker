/**
 * Backend test suite — run with: npx tsx scripts/test-backend.ts
 *
 * Covers the AEON adapter (the "info fetch"), slug parsing (add-cinema),
 * language/title logic, and live link reachability. Mixes pure unit tests with
 * integration tests that hit the real AEON endpoints.
 */
import {
  cinemaExists,
  cleanTitle,
  detectLanguage,
  fetchCinema,
  lookupCinemaName,
  parseSlug,
  type ParsedFilm,
} from '../supabase/functions/_shared/aeon';

let pass = 0;
let fail = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(name + (detail ? ` — ${detail}` : ''));
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function http(url: string): Promise<number> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) Mobile' } });
    return res.status;
  } catch (e) {
    return -1;
  }
}

async function main() {
  console.log('\n== parseSlug (add cinema) ==');
  check('utazu wm url', parseSlug('https://cinema.aeoncinema.com/wm/utazu/') === 'utazu');
  check('ayagawa theater url', parseSlug('https://theater.aeoncinema.com/theaters/ayagawa/') === 'ayagawa');
  check('hyphen slug', parseSlug('https://cinema.aeoncinema.com/wm/okayama-ek/') === 'okayama-ek');
  check('uppercase normalised', parseSlug('HTTPS://CINEMA.AEONCINEMA.COM/WM/UTAZU/') === 'utazu');
  check('non-aeon url -> null', parseSlug('https://www.google.com/x') === null);
  check('garbage -> null', parseSlug('not a url') === null);

  console.log('\n== detectLanguage ==');
  check('字幕 -> english', detectLanguage('字幕　プラダ', 'SUB Prada') === 'english');
  check('SUB -> english', detectLanguage('', 'SUB The Thing') === 'english');
  check('吹替 -> japanese', detectLanguage('吹替　マリオ', 'DUB Mario') === 'japanese');
  check('unlabelled -> japanese', detectLanguage('国宝', '') === 'japanese');

  console.log('\n== cleanTitle ==');
  check('strip 字幕', cleanTitle('字幕　プラダを着た悪魔2') === 'プラダを着た悪魔2');
  check('strip SUB', cleanTitle('SUB The Devil Wears Prada 2') === 'The Devil Wears Prada 2');
  check('strip 吹替', cleanTitle('吹替 マリオ') === 'マリオ');

  console.log('\n== cinemaExists (live) ==');
  check('utazu exists', (await cinemaExists('utazu')) === true);
  check('ayagawa exists', (await cinemaExists('ayagawa')) === true);
  check('bogus does not exist', (await cinemaExists('zzznotarealcinema')) === false);

  console.log('\n== lookupCinemaName (live) ==');
  const name = await lookupCinemaName('utazu');
  check('utazu name resolves', !!name && /宇多津|AEON/.test(name), String(name));

  console.log('\n== fetchCinema (live info fetch + parse) ==');
  let films: ParsedFilm[] = [];
  try {
    films = await fetchCinema('utazu');
  } catch (e) {
    check('fetchCinema utazu', false, (e as Error).message);
  }
  check('returns films', films.length > 0, `${films.length} films`);
  check('every film has screenings', films.every((f) => f.screenings.length > 0));
  check(
    'each film is single-language (split correct)',
    films.every((f) => f.screenings.every((s) => s.language === f.language)),
  );
  check('has an English entry', films.some((f) => f.language === 'english'));
  check('has a Japanese entry', films.some((f) => f.language === 'japanese'));
  check(
    'times look like HH:MM',
    films.every((f) => f.screenings.every((s) => s.times.every((t) => /^\d{2}:\d{2}$/.test(t)))),
  );
  check('status is valid', films.every((f) => f.status === 'now_showing' || f.status === 'upcoming'));
  check('titles are non-empty', films.every((f) => f.title.trim().length > 0));

  console.log('\n== Links reachable (live) ==');
  check('schedule API 200', (await http('https://theater.aeoncinema.com/schedule/v2/data/utazu/schedule.json')) === 200);
  check('ayagawa schedule API 200', (await http('https://theater.aeoncinema.com/schedule/v2/data/ayagawa/schedule.json')) === 200);
  const firstFilm = films[0];
  if (firstFilm) {
    const srcStatus = await http(firstFilm.source_url);
    check('film source_url reachable', srcStatus === 200, `${firstFilm.source_url} -> ${srcStatus}`);
    const withPoster = films.find((f) => f.poster_url);
    if (withPoster?.poster_url) {
      const pStatus = await http(withPoster.poster_url);
      check('poster_url reachable', pStatus === 200, `-> ${pStatus}`);
    } else {
      check('poster_url reachable', false, 'no film had a poster');
    }
  }

  console.log(`\n==== ${pass} passed, ${fail} failed ====`);
  if (fail) {
    console.log('FAILURES:');
    for (const f of failures) console.log('  - ' + f);
    process.exit(1);
  }
  process.exit(0);
}

main();
