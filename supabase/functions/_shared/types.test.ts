/** Tests for the chain-shared helpers (language detection, title cleanup). */
import { describe, expect, it, vi } from 'vitest';

import { cleanTitle, dashDate, detectLanguage, jstStamp, normalize, padTime } from './types.ts';

describe('detectLanguage', () => {
  it('detects 字幕 (subtitled) as english', () => {
    expect(detectLanguage('字幕　プラダを着た悪魔２')).toBe('english');
    expect(detectLanguage('プラダを着た悪魔２（字幕版）')).toBe('english');
  });

  it('detects SUB-prefixed English names as english', () => {
    expect(detectLanguage('', 'SUB The Devil Wears Prada 2')).toBe('english');
  });

  it('detects 吹替 (dubbed) as japanese', () => {
    expect(detectLanguage('吹替　プラダを着た悪魔２')).toBe('japanese');
  });

  it('detects DUB-prefixed English names as japanese', () => {
    expect(detectLanguage('', 'DUB The Devil Wears Prada 2')).toBe('japanese');
  });

  it('treats unlabelled screenings as japanese domestic releases', () => {
    expect(detectLanguage('群青のカルテ')).toBe('japanese');
  });
});

describe('cleanTitle', () => {
  it('strips AEON-style 字幕/吹替 prefixes', () => {
    expect(cleanTitle('字幕　プラダを着た悪魔２')).toBe('プラダを着た悪魔２');
    expect(cleanTitle('吹替 プラダを着た悪魔２')).toBe('プラダを着た悪魔２');
  });

  it('strips SUB/DUB prefixes from English names', () => {
    expect(cleanTitle('SUB The Devil Wears Prada 2')).toBe('The Devil Wears Prada 2');
  });

  it('strips （字幕版） style markers', () => {
    expect(cleanTitle('プラダを着た悪魔２（字幕版）')).toBe('プラダを着た悪魔２');
  });

  it("strips TOHO-style '/ SUB …' tails", () => {
    expect(cleanTitle('The Devil Wears Prada 2 / SUB MX4D')).toBe('The Devil Wears Prada 2');
  });

  it('leaves plain titles untouched', () => {
    expect(cleanTitle('群青のカルテ')).toBe('群青のカルテ');
  });
});

describe('normalize', () => {
  it('converts fullwidth chars and collapses whitespace', () => {
    expect(normalize('ＴＯＨＯシネマズ　なんば')).toBe('TOHOシネマズ なんば');
  });
});

describe('dashDate', () => {
  it('converts YYYYMMDD to YYYY-MM-DD', () => {
    expect(dashDate('20260731')).toBe('2026-07-31');
  });
});

describe('padTime', () => {
  it('zero-pads single-digit hours', () => {
    expect(padTime('8:15')).toBe('08:15');
    expect(padTime('19:15')).toBe('19:15');
  });
});

describe('jstStamp', () => {
  // Drives AEON's `?v=` cache-buster — without a changing value, CloudFront
  // hands back a month-old schedule and every showtime ages out of the app.
  it('formats JST as yyyyMMddHHmm / yyyyMMddHH', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-11T05:44:49Z')); // 14:44 JST
    expect(jstStamp('minute')).toBe('202608111444');
    expect(jstStamp('hour')).toBe('2026081114');
    vi.useRealTimers();
  });

  it('rolls the date over at JST midnight, not UTC midnight', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-11T15:30:00Z')); // 00:30 JST on the 12th
    expect(jstStamp('minute')).toBe('202608120030');
    vi.useRealTimers();
  });

  it('changes between consecutive minutes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-11T05:44:00Z'));
    const first = jstStamp('minute');
    vi.setSystemTime(new Date('2026-08-11T05:45:00Z'));
    expect(jstStamp('minute')).not.toBe(first);
    vi.useRealTimers();
  });
});
