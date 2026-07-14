/** Chain adapter registry — one place that knows every supported cinema chain. */
import { aeonAdapter } from './aeon.ts';
import { parksAdapter } from './parks.ts';
import { tohoAdapter } from './toho.ts';
import type { ChainAdapter } from './types.ts';

export const ADAPTERS: ChainAdapter[] = [aeonAdapter, tohoAdapter, parksAdapter];

export interface ResolvedCinema {
  adapter: ChainAdapter;
  chain: string;
  slug: string;
  /** Stable cinema id: AEON keeps its bare slug (v2.0 rows), others are prefixed. */
  id: string;
  scheduleUrl: string;
}

export function resolveUrl(url: string): ResolvedCinema | null {
  for (const adapter of ADAPTERS) {
    const slug = adapter.parseUrl(url);
    if (slug) {
      return {
        adapter,
        chain: adapter.chain,
        slug,
        id: adapter.chain === 'aeon' ? slug : `${adapter.chain}-${slug}`,
        scheduleUrl: adapter.canonicalUrl(slug, url),
      };
    }
  }
  return null;
}

export function adapterFor(chain: string): ChainAdapter | null {
  return ADAPTERS.find((a) => a.chain === chain) ?? null;
}
