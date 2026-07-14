/**
 * Client-side mirror of the chain registry (supabase/functions/_shared/registry.ts):
 * enough to preview the cinema id while typing. The server re-resolves on
 * validate/add, so these only need to agree on patterns and id shape.
 */
export interface ParsedCinemaUrl {
  chain: 'aeon' | 'toho' | 'parks';
  slug: string;
  id: string;
}

export function parseCinemaUrl(url: string): ParsedCinemaUrl | null {
  let m = url.match(/aeoncinema\.com\/(?:wm|theaters|cinema2?)\/([a-z0-9_-]+)/i);
  if (m) return { chain: 'aeon', slug: m[1].toLowerCase(), id: m[1].toLowerCase() };

  m =
    url.match(/hlo\.tohotheater\.jp\/net\/(?:schedule|ticket)\/(\d{3})\//i) ??
    url.match(/tohotheater\.jp\/theater\/(\d{3})\b/i);
  if (m) return { chain: 'toho', slug: m[1], id: `toho-${m[1]}` };

  m = url.match(/(?:parkscinema\.com|smt-cinema\.com)\/(?:sp\/)?site\/([a-z0-9_-]+)/i);
  if (m) return { chain: 'parks', slug: m[1].toLowerCase(), id: `parks-${m[1].toLowerCase()}` };

  return null;
}
