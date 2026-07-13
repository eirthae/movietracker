import { formatDayChip } from '@/lib/format';
import type { ShowTime } from '@/lib/types';

/** Horizontal date chips — shared by the film card and the detail screen. */
export function DateChips({
  dates,
  selected,
  onSelect,
  size = 'md',
}: {
  dates: string[];
  selected: string | null;
  onSelect: (date: string) => void;
  size?: 'md' | 'lg';
}) {
  const lg = size === 'lg' ? ' lg' : '';
  return (
    <div className="chip-row">
      {dates.map((date) => (
        <button
          key={date}
          className={`date-chip${lg}${date === selected ? ' active' : ''}`}
          onClick={() => onSelect(date)}
        >
          {formatDayChip(date)}
        </button>
      ))}
    </div>
  );
}

/** Time chips with per-screening language tags. */
export function TimeChips({
  times,
  size = 'md',
  selected,
  onSelect,
}: {
  times: ShowTime[];
  size?: 'md' | 'lg';
  selected?: ShowTime | null;
  onSelect?: (t: ShowTime) => void;
}) {
  const lg = size === 'lg' ? ' lg' : '';
  return (
    <div className="time-grid">
      {times.map((t) => {
        const isSelected = selected && selected.time === t.time && selected.language === t.language;
        return (
          <button
            key={`${t.time}-${t.language}`}
            className={`time-chip${lg}${isSelected ? ' selected' : ''}`}
            onClick={onSelect ? () => onSelect(t) : undefined}
          >
            <span className="time">{t.time}</span>
            <span className={`tag ${t.language === 'english' ? 'eng' : 'ja'}`}>
              {t.language === 'english' ? 'ENG' : '日本'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
