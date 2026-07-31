import { describe, expect, it } from 'vitest';

import { parseCinemaUrl } from './chains';

describe('parseCinemaUrl', () => {
  it('parses AEON wm schedule URLs', () => {
    expect(parseCinemaUrl('https://cinema.aeoncinema.com/wm/utazu/')).toEqual({
      chain: 'aeon',
      slug: 'utazu',
      id: 'utazu',
    });
  });

  it('parses AEON URLs without protocol and lowercases the slug', () => {
    expect(parseCinemaUrl('cinema.aeoncinema.com/wm/Ayagawa')).toEqual({
      chain: 'aeon',
      slug: 'ayagawa',
      id: 'ayagawa',
    });
  });

  it('parses TOHO schedule URLs into toho-<code>', () => {
    expect(
      parseCinemaUrl('https://hlo.tohotheater.jp/net/schedule/032/TNPI2000J01.do'),
    ).toEqual({ chain: 'toho', slug: '032', id: 'toho-032' });
  });

  it('parses TOHO theater-page URLs', () => {
    expect(parseCinemaUrl('https://www.tohotheater.jp/theater/032/institution.html')).toEqual({
      chain: 'toho',
      slug: '032',
      id: 'toho-032',
    });
  });

  it('parses Parks Cinema site URLs into parks-<slug>', () => {
    expect(parseCinemaUrl('https://www.parkscinema.com/site/namba/')).toEqual({
      chain: 'parks',
      slug: 'namba',
      id: 'parks-namba',
    });
  });

  it('rejects unrelated URLs', () => {
    expect(parseCinemaUrl('https://example.com/cinema/utazu')).toBeNull();
    expect(parseCinemaUrl('not a url at all')).toBeNull();
    expect(parseCinemaUrl('')).toBeNull();
  });
});
