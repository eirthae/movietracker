import type { Language } from '@/lib/types';

/** Poster image (or placeholder) with the film-level language badge. */
export function Poster({
  url,
  alt,
  language,
  size,
}: {
  url: string | null;
  alt: string;
  language: Language;
  size: 'sm' | 'md' | 'full';
}) {
  return (
    <div className={`poster-wrap ${size}`}>
      {url ? (
        <img className="poster-img" src={url} alt={alt} loading="lazy" />
      ) : (
        <div className="poster-ph" aria-label={alt}>
          Poster
        </div>
      )}
      <LanguageBadge language={language} />
    </div>
  );
}

export function LanguageBadge({ language }: { language: Language }) {
  if (language === 'english') return <span className="badge eng">ENG</span>;
  if (language === 'japanese') return <span className="badge ja">日本</span>;
  return null;
}
