import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAddCinema, validateCinemaUrl, type ValidateResult } from '@/lib/queries';

/** Client-side slug preview (server re-validates on add). */
function slugOf(url: string): string | null {
  const m = url.match(/aeoncinema\.com\/(?:wm|theaters|cinema2?)\/([a-z0-9_-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

type Check =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'valid'; result: ValidateResult }
  | { state: 'invalid'; message: string };

export function AddCinemaPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [check, setCheck] = useState<Check>({ state: 'idle' });
  const addM = useAddCinema();
  const requestSeq = useRef(0);

  const slug = slugOf(url);

  // Debounced URL validation via the manage-cinema function.
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setCheck({ state: 'idle' });
      return;
    }
    if (!slugOf(trimmed)) {
      setCheck({ state: 'invalid', message: "That doesn't look like an AEON schedule URL." });
      return;
    }
    setCheck({ state: 'checking' });
    const seq = ++requestSeq.current;
    const timer = setTimeout(async () => {
      try {
        const result = await validateCinemaUrl(trimmed);
        if (seq !== requestSeq.current) return;
        setCheck({ state: 'valid', result });
        setName((prev) => (nameTouched && prev ? prev : result.name));
      } catch (e) {
        if (seq !== requestSeq.current) return;
        setCheck({ state: 'invalid', message: e instanceof Error ? e.message : String(e) });
      }
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const canAdd = check.state === 'valid' && name.trim().length > 0 && !addM.isPending;

  const onAdd = () => {
    if (check.state !== 'valid') return;
    addM.mutate(
      { url: url.trim(), name: name.trim() },
      { onSuccess: () => navigate('/') },
    );
  };

  return (
    <>
      <button className="back-head" onClick={() => navigate(-1)}>
        <iconify-icon icon="solar:arrow-left-linear" />
        <span>Add cinema</span>
      </button>

      <div className="scroll" style={{ gap: 16 }}>
        <div className="form-field">
          <span className="label">Cinema name</span>
          <input
            className="input"
            value={name}
            placeholder="AEON Cinema …"
            onChange={(e) => {
              setName(e.target.value);
              setNameTouched(true);
            }}
          />
        </div>

        <div className="form-field">
          <span className="label">Schedule URL</span>
          <input
            className="input mono"
            value={url}
            placeholder="cinema.aeoncinema.com/wm/…"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            onChange={(e) => setUrl(e.target.value)}
          />
          <span className="hint">AEON mobile schedule page — refreshed every Monday</span>
        </div>

        <div className="form-field">
          <span className="label">Short ID</span>
          <input className="input mono readonly" value={slug ?? ''} placeholder="—" readOnly />
          <span className="hint">Auto-generated from the URL</span>
        </div>

        {check.state === 'checking' && (
          <div className="check-card">
            <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            <div>
              <div className="title">Checking URL…</div>
            </div>
          </div>
        )}
        {check.state === 'valid' && (
          <div className="check-card ok">
            <iconify-icon icon="solar:check-circle-linear" />
            <div>
              <div className="title">URL looks valid</div>
              <div className="sub">
                Found {check.result.films} film{check.result.films === 1 ? '' : 's'} on the
                schedule page
              </div>
            </div>
          </div>
        )}
        {check.state === 'invalid' && (
          <div className="check-card bad">
            <iconify-icon icon="solar:close-circle-linear" />
            <div>
              <div className="title">Can't use that URL</div>
              <div className="sub">{check.message}</div>
            </div>
          </div>
        )}

        <button className="primary-btn" style={{ marginTop: 4 }} disabled={!canAdd} onClick={onAdd}>
          <iconify-icon icon="solar:add-circle-linear" />
          <span>{addM.isPending ? 'Adding…' : 'Add cinema'}</span>
        </button>
        {addM.isError && (
          <div className="error-text" style={{ textAlign: 'center' }}>
            {addM.error instanceof Error ? addM.error.message : 'Something went wrong.'}
          </div>
        )}
        <div className="form-caption">
          The new tab appears on the Cinemas screen right away
        </div>
      </div>
    </>
  );
}
