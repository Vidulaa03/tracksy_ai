import { useState, useEffect, FormEvent } from 'react';
import { JobApplication, JobStatus, JOB_STATUSES } from '../types';
import { aiAPI } from '../services/api';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  open:      boolean;
  onClose:   () => void;
  onSubmit:  (data: Partial<JobApplication>) => Promise<void>;
  editApp?:  JobApplication;
}

const EMPTY = {
  position:           '',
  companyName:        '',
  description:        '',
  jobDescriptionLink: '',
  notes:              '',
  salaryRange:        '',
  status:             'applied' as JobStatus,
  appliedDate:        new Date().toISOString().split('T')[0],
};

export default function ApplicationDialog({ open, onClose, onSubmit, editApp }: Props) {
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [parsing,    setParsing]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiError,    setAiError]    = useState('');
  const [bullets,    setBullets]    = useState<string[]>([]);
  const [copied,     setCopied]     = useState<number | null>(null);

  // Reset / pre-fill on open
  useEffect(() => {
    if (!open) return;
    if (editApp) {
      setForm({
        position:           editApp.position           ?? '',
        companyName:        editApp.companyName        ?? '',
        description:        editApp.description        ?? '',
        jobDescriptionLink: editApp.jobDescriptionLink ?? '',
        notes:              editApp.notes              ?? '',
        salaryRange:        editApp.salaryRange        ?? '',
        status:             editApp.status             ?? 'applied',
        appliedDate:        (editApp.appliedDate ?? '').split('T')[0] || EMPTY.appliedDate,
      });
      setBullets(editApp.resumeBullets ?? []);
    } else {
      setForm(EMPTY);
      setBullets([]);
    }
    setErrors({});
    setAiError('');
  }, [open, editApp]);

  function set(k: keyof typeof EMPTY, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.position.trim())    e.position    = 'Required';
    if (!form.companyName.trim()) e.companyName = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try { await onSubmit({ ...form, resumeBullets: bullets }); onClose(); }
    finally { setSaving(false); }
  }

  async function handleParse() {
    if (!form.description.trim()) { setAiError('Paste a job description first'); return; }
    setParsing(true); setAiError('');
    try {
      const r = await aiAPI.parseJobDescription(form.description);
      const d = (r.data as any)?.parsedData ?? r.data;
      if (d?.companyName) set('companyName', d.companyName);
      if (d?.role)        set('position',    d.role);
      if (d?.salaryRange) set('salaryRange', d.salaryRange);
    } catch {
      setAiError('Parsing failed — check your OPENAI_API_KEY in server/.env');
    } finally { setParsing(false); }
  }

  async function handleGenerate() {
    if (!form.description.trim()) { setAiError('Paste a job description first'); return; }
    setGenerating(true); setAiError('');
    try {
      const r = await aiAPI.getResumeSuggestions(form.description);
      const d = (r.data as any);
      setBullets(d?.bullets ?? d ?? []);
    } catch {
      setAiError('Failed to generate bullets — check your OPENAI_API_KEY in server/.env');
    } finally { setGenerating(false); }
  }

  async function copyBullet(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  }

  if (!open) return null;

  /* ── shared style helpers ── */
  const inp: React.CSSProperties = {
    background: 'var(--surface-3)', border: '1px solid var(--border-strong)',
    borderRadius: '9px', color: 'var(--text)', padding: '9px 12px',
    width: '100%', fontSize: '13px', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 500,
    color: 'var(--text-secondary)', marginBottom: '5px',
  };
  function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow   = '0 0 0 3px rgba(99,102,241,0.15)';
  }
  function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = 'var(--border-strong)';
    e.target.style.boxShadow   = 'none';
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%', maxWidth: '700px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--surface)', border: '1px solid var(--border-strong)',
          borderRadius: '16px', overflow: 'hidden',
        }}
      >
        {/* ── header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
            {editApp ? 'Edit Application' : 'New Application'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '5px', borderRadius: '6px', display: 'flex',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* ── scrollable body ── */}
        <div style={{ overflowY: 'auto', padding: '20px 24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* row 1: position + company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Role / Position *</label>
                <input
                  style={{ ...inp, borderColor: errors.position ? '#f87171' : 'var(--border-strong)' }}
                  value={form.position} onChange={(e) => set('position', e.target.value)}
                  placeholder="Senior Engineer" onFocus={focus} onBlur={blur}
                />
                {errors.position && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{errors.position}</p>}
              </div>
              <div>
                <label style={lbl}>Company *</label>
                <input
                  style={{ ...inp, borderColor: errors.companyName ? '#f87171' : 'var(--border-strong)' }}
                  value={form.companyName} onChange={(e) => set('companyName', e.target.value)}
                  placeholder="Acme Inc" onFocus={focus} onBlur={blur}
                />
                {errors.companyName && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{errors.companyName}</p>}
              </div>
            </div>

            {/* row 2: link + date + salary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>JD Link</label>
                <input style={inp} type="url" value={form.jobDescriptionLink}
                  onChange={(e) => set('jobDescriptionLink', e.target.value)}
                  placeholder="https://..." onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={lbl}>Date Applied</label>
                <input style={inp} type="date" value={form.appliedDate}
                  onChange={(e) => set('appliedDate', e.target.value)}
                  onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={lbl}>Salary Range</label>
                <input style={inp} value={form.salaryRange}
                  onChange={(e) => set('salaryRange', e.target.value)}
                  placeholder="$90k – $130k" onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* status pills — exactly 5 */}
            <div>
              <label style={lbl}>Status</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {JOB_STATUSES.map((s) => {
                  const active = form.status === s.value;
                  return (
                    <button key={s.value} type="button" onClick={() => set('status', s.value)}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                        fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s',
                        background: active ? `${s.hex}20` : 'var(--surface-3)',
                        color:      active ? s.hex : 'var(--text-secondary)',
                        border:     `1px solid ${active ? s.hex + '55' : 'var(--border)'}`,
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* job description + AI parse button */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Job Description</label>
                <button type="button" onClick={handleParse} disabled={parsing}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '11px', fontWeight: 600, padding: '5px 11px', borderRadius: '7px',
                    cursor: 'pointer', border: '1px solid var(--primary-border)',
                    background: 'var(--primary-muted)', color: 'var(--primary)',
                    opacity: parsing ? 0.6 : 1, transition: 'opacity 0.15s',
                  }}
                >
                  {parsing ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                  {parsing ? 'Parsing…' : 'AI Parse & Autofill'}
                </button>
              </div>
              <textarea
                style={{ ...inp, resize: 'vertical', minHeight: '90px', lineHeight: 1.5 } as React.CSSProperties}
                value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={4}
                placeholder="Paste the full job description — AI Parse autofills company, role, and salary."
                onFocus={focus as any} onBlur={blur as any}
              />
              {aiError && (
                <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={11} />{aiError}
                </p>
              )}
            </div>

            {/* notes */}
            <div>
              <label style={lbl}>Notes</label>
              <textarea
                style={{ ...inp, resize: 'vertical' } as React.CSSProperties}
                value={form.notes} onChange={(e) => set('notes', e.target.value)}
                rows={2} placeholder="Referral, recruiter name, next steps…"
                onFocus={focus as any} onBlur={blur as any}
              />
            </div>

            {/* AI resume bullets */}
            <div style={{
              background: 'var(--surface-3)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                    AI Resume Bullets
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    4 tailored bullet points — copy straight into your resume
                  </p>
                </div>
                <button type="button" onClick={handleGenerate} disabled={generating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                    cursor: 'pointer', border: 'none', background: 'var(--primary)', color: 'white',
                    opacity: generating ? 0.6 : 1, transition: 'opacity 0.15s',
                  }}
                >
                  {generating ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                  Generate
                </button>
              </div>

              {bullets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {bullets.map((b, i) => (
                    <div key={i} className="bullet-row"
                      style={{
                        display: 'flex', gap: '8px', alignItems: 'flex-start',
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: '8px', padding: '10px 12px',
                      }}
                    >
                      <span style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>•</span>
                      <p style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b}</p>
                      <button type="button" onClick={() => copyBullet(b, i)}
                        className="copy-btn"
                        style={{
                          flexShrink: 0, fontSize: '11px', fontWeight: 600,
                          padding: '3px 8px', borderRadius: '6px', cursor: 'pointer',
                          border: '1px solid var(--border)',
                          background: copied === i ? 'rgba(52,211,153,0.15)' : 'var(--surface)',
                          color:      copied === i ? '#34d399'               : 'var(--text-muted)',
                          opacity: 0, transition: 'opacity 0.15s',
                        }}
                      >
                        {copied === i ? '✓' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* submit */}
            <button type="submit" disabled={saving}
              style={{
                width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer',
                background: saving ? 'var(--surface-3)' : 'var(--primary)',
                color:      saving ? 'var(--text-muted)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.15s',
              }}
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? 'Saving…' : editApp ? 'Update Application' : 'Add Application'}
            </button>
          </form>
        </div>
      </div>

      <style>{`.bullet-row:hover .copy-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
