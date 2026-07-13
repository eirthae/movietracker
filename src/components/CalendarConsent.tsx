/**
 * First-use privacy prompt for "Add to Google Calendar".
 *
 * The calendar button never connects to anything: it opens Google Calendar's
 * event template in the user's own browser session, pre-filled with the
 * screening. The app has no calendar access, stores no accounts/tokens, and
 * nothing is saved server-side. This sheet says exactly that, once.
 */

const CONSENT_KEY = 'ct.calendarConsent';

export function hasCalendarConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === 'yes';
}

export function grantCalendarConsent(): void {
  localStorage.setItem(CONSENT_KEY, 'yes');
}

export function CalendarConsentSheet({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="sheet-overlay" onClick={onCancel}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <iconify-icon icon="solar:calendar-add-linear" className="sheet-icon" />
        <div className="sheet-title">Opens your Google Calendar</div>
        <div className="sheet-body">
          This opens Google Calendar in a new tab with the screening pre-filled — you save the
          event yourself, in your own Google account.
        </div>
        <div className="sheet-body">
          Cinema Tracker never connects to your calendar and never sees, stores, or shares your
          account or any personal data. The only thing sent to Google is the event text itself.
        </div>
        <button className="primary-btn" onClick={onConfirm}>
          <iconify-icon icon="solar:calendar-add-linear" />
          <span>Continue to Google Calendar</span>
        </button>
        <button className="sheet-cancel" onClick={onCancel}>
          Cancel
        </button>
        <div className="sheet-fineprint">Shown once — this is just so you know.</div>
      </div>
    </div>
  );
}
