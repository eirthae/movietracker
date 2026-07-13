import { formatTimestampDate } from '@/lib/format';
import { usePrefs, type ThemeSetting } from '@/lib/prefs';
import { useLatestScrape } from '@/lib/queries';

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsPage() {
  const { theme, setTheme, notifyEnglish, setNotifyEnglish } = usePrefs();
  const scrapeQ = useLatestScrape();
  const lastScrape = scrapeQ.data ? formatTimestampDate(scrapeQ.data.started_at) : 'Never';

  return (
    <>
      <header className="page-head">Settings</header>

      <div className="scroll" style={{ gap: 20, paddingTop: 20 }}>
        <section className="settings-section">
          <div className="settings-label">Appearance</div>
          <div className="settings-card">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className="settings-row"
                onClick={() => setTheme(opt.value)}
              >
                <span className={`radio-dot${theme === opt.value ? ' checked' : ''}`} />
                <span style={{ fontWeight: theme === opt.value ? 600 : 400 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-label">Notifications</div>
          <div className="settings-card">
            <button className="settings-row" onClick={() => setNotifyEnglish(!notifyEnglish)}>
              <span className="grow">
                <div>English films</div>
                <div className="hint">Notify when a new ENG film appears</div>
              </span>
              <span className={`toggle${notifyEnglish ? ' on' : ''}`}>
                <span className="knob" />
              </span>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-label">About</div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="grow">App version</span>
              <span className="value mono">{__APP_VERSION__}</span>
            </div>
            <div className="settings-row">
              <span className="grow">Last scrape</span>
              <span className="value">{lastScrape}</span>
            </div>
            <div className="settings-row">
              <span className="grow">Data source</span>
              <span className="value">AEON Cinema</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
