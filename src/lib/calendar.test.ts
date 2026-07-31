import { describe, expect, it } from 'vitest';

import { googleCalendarUrl } from './calendar';

function params(url: string): URLSearchParams {
  return new URL(url).searchParams;
}

describe('googleCalendarUrl', () => {
  it('builds a template URL with start/end from the film runtime', () => {
    const url = googleCalendarUrl({
      title: 'Harbor of Kites (ENG)',
      date: '2026-07-13',
      time: '10:00',
      durationMin: 104,
    });
    const p = params(url);
    expect(url).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render\?/);
    expect(p.get('action')).toBe('TEMPLATE');
    expect(p.get('text')).toBe('Harbor of Kites (ENG)');
    expect(p.get('dates')).toBe('20260713T100000/20260713T114400');
  });

  it('pins the timezone to JST', () => {
    const p = params(googleCalendarUrl({ title: 'x', date: '2026-07-13', time: '10:00' }));
    expect(p.get('ctz')).toBe('Asia/Tokyo');
  });

  it('defaults to 120 minutes when the runtime is unknown', () => {
    const p = params(
      googleCalendarUrl({ title: 'x', date: '2026-07-13', time: '19:15', durationMin: null }),
    );
    expect(p.get('dates')).toBe('20260713T191500/20260713T211500');
  });

  it('rolls the end past midnight onto the next day', () => {
    const p = params(
      googleCalendarUrl({ title: 'x', date: '2026-07-31', time: '23:30', durationMin: 90 }),
    );
    expect(p.get('dates')).toBe('20260731T233000/20260801T010000');
  });

  it('rolls across a month boundary', () => {
    const p = params(
      googleCalendarUrl({ title: 'x', date: '2026-12-31', time: '23:00', durationMin: 150 }),
    );
    expect(p.get('dates')).toBe('20261231T230000/20270101T013000');
  });

  it('passes location and details through when given', () => {
    const p = params(
      googleCalendarUrl({
        title: 'x',
        date: '2026-07-13',
        time: '10:00',
        location: 'AEON Cinema Utazu',
        details: 'https://cinema.aeoncinema.com/wm/utazu/',
      }),
    );
    expect(p.get('location')).toBe('AEON Cinema Utazu');
    expect(p.get('details')).toBe('https://cinema.aeoncinema.com/wm/utazu/');
  });
});
