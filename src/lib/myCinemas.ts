/**
 * The device's own cinema list. The Supabase DB is shared by everyone using
 * the app (film data is scraped once per cinema), but which cinemas show up
 * as tabs is personal — stored only in this browser's localStorage.
 */
export interface MyCinemaRef {
  id: string;
  name: string;
}

const KEY = 'ct.myCinemas';

export function getMyCinemas(): MyCinemaRef[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v)
      ? v.filter((c) => c && typeof c.id === 'string' && typeof c.name === 'string')
      : [];
  } catch {
    return [];
  }
}

export function isMyCinema(id: string): boolean {
  return getMyCinemas().some((c) => c.id === id);
}

export function addMyCinema(ref: MyCinemaRef): void {
  const list = getMyCinemas();
  if (list.some((c) => c.id === ref.id)) return;
  localStorage.setItem(KEY, JSON.stringify([...list, ref]));
}
