// src/components/ChatDock.tsx
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CHAT_STORAGE_KEY, REASONS, type ReasonId, SUGGESTIONS } from "../lib/chatConfig";

/** Inlined styles (keeps everything self-contained; matches your pastel-blue theme) */
const CHAT_CSS = `
@keyframes wiggle {
  0%,100% { transform: translateY(0) rotate(0deg); }
  10% { transform: rotate(-5deg); }
  20% { transform: rotate(5deg); }
  30% { transform: rotate(-4deg); }
  40% { transform: rotate(4deg); }
  50% { transform: rotate(-3deg); }
  60% { transform: rotate(3deg); }
  70% { transform: rotate(-2deg); }
  80% { transform: rotate(2deg); }
  90% { transform: rotate(-1deg); }
}

/* === Launcher (bigger, thick dark-blue ring, CLICK ME label, first-load wiggle) === */
.chat-launcher{
  position: fixed; right: 18px; bottom: 18px; z-index: 60;
  width: 72px; height: 72px; border-radius: 999px;
  border: 4px solid var(--accent-strong);
  background: radial-gradient(60% 60% at 35% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.7)),
              linear-gradient(180deg, #9EC5FF, #2F5FE8);
  box-shadow: 0 10px 28px rgba(11,30,75,0.24);
  cursor: pointer;
}
.chat-launcher:hover{ box-shadow: 0 12px 32px rgba(11,30,75,0.28); }
.chat-launcher.wiggle{ animation: wiggle .9s ease-in-out infinite; }
.chat-launcher-spark{ display:none; }
.chat-clickme{
  position: absolute; inset: 0;
  display:flex; align-items:center; justify-content:center;
  font-weight: 900; letter-spacing: 1px; font-size: 11px;
  color: var(--accent-strong);
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
  user-select: none; pointer-events: none;
}

/* === Panel wrapper === */
.chat-wrap{
  position: fixed; right: 16px; bottom: 98px; z-index: 60;
  max-width: 420px; width: calc(100% - 32px);
}
.chat-panel{
  border-radius: 16px; overflow: hidden; background: var(--panel2);
  border: 1px solid var(--border); box-shadow: var(--shadow);
  display: grid; grid-template-rows: auto 1fr;
}

/* === Header === */
.chat-head{
  display:flex; align-items:center; gap: 10px;
  background: linear-gradient(180deg, #183B8A, #2F5FE8);
  color:#fff; padding: 10px 12px;
}
/* Decorative gradient block (kept for backwards-compat if ever needed) */
.chat-avatar{
  width: 28px; height: 28px; border-radius: 8px;
  background: radial-gradient(60% 60% at 35% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.6)),
              linear-gradient(180deg, #9EC5FF, #2F5FE8);
  border: 1px solid rgba(255,255,255,0.7);
  box-shadow: inset 0 0 8px rgba(255,255,255,0.4);
}
/* --- NEW: cloud “S” logo next to title --- */
.chat-icon{
  width: 22px; height: 22px; border-radius: 6px;
  display:block;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.75);
  box-shadow: 0 1px 4px rgba(0,0,0,0.12), inset 0 0 6px rgba(255,255,255,0.35);
}
.chat-title{
  display:flex; flex-direction:column; line-height:1.1
}
.chat-title strong{ font-size:14px; display:flex; align-items:center; gap:8px; }
.chat-title span{ font-size:12px; opacity:0.9 }
.chat-close{
  margin-left:auto; background: transparent; color:#fff; border:0; font-size:20px; cursor:pointer;
}

/* === Body === */
.chat-body{ padding: 12px; }
.chat-section{
  background: linear-gradient(180deg, var(--panel2), rgba(232,240,250,0.92));
  padding: 8px; border-radius: 12px; border:1px solid var(--border);
}
.chat-prompt{ margin: 6px 6px 10px; color: var(--text); font-weight: 800; }

.chips{ display:flex; flex-wrap:wrap; gap:8px; padding: 0 6px 6px; }
.chip{
  border-radius: 999px; padding: 8px 12px;
  border: 1px solid var(--accent-strong);
  background: #fff; color: var(--text);
  font-weight: 800; cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease, color .12s ease, border-color .12s ease;
}
.chip:hover{ transform: translateY(-1px); box-shadow: 0 2px 10px rgba(11,30,75,0.10); }
.chip.active{ background: var(--accent); color:#fff; border-color: var(--accent-strong); }
.chip.ghost{ background: #fff; border-color: var(--border); color: var(--text); }

.chat-actions{ display:flex; gap:10px; align-items:center; padding: 8px 6px 2px; }
.link{ background:transparent; border:0; color: var(--accent); font-weight: 800; cursor: pointer; }

.field{ margin: 10px 6px; }
.field label{ display:block; font-size: 12px; font-weight: 800; margin-bottom: 6px; color: var(--text); }
.field input, .chat-section textarea{
  width:100%; padding:12px 14px; border-radius:12px;
  border:1px solid var(--border); background:#F8FBFF; color:var(--text);
}
.chat-section textarea{ min-height: 120px; resize: vertical; }

/* === Summary / confirmation === */
.summary{
  border: 3px solid #fff; border-radius: 16px; padding: 12px; background: var(--panel1);
}
.summary-title{ font-weight:900; margin-bottom: 6px; color: var(--text); }
.summary-body{ font-size: 13px; color: var(--muted); word-break: break-word; }

.err{ color: #9a3324; font-size: 13px; margin: 8px 6px; }

/* === Buttons === */
.btn{
  display:inline-block; padding:12px 16px; border-radius:12px;
  border:1px solid var(--accent-strong); background:var(--accent); color:#fff;
  font-weight:900; text-decoration:none; cursor:pointer;
}
.btn.white{
  background:#ffffff;
  color:#0C1B3A;
  border:2px solid var(--accent-strong);
}
.btn.white:hover{ background:#fff; box-shadow: var(--shadow); }
`;

type Step = "reason" | "followup" | "details" | "contact" | "confirm";

type Draft = {
  reasons: ReasonId[];
  followups: string[];
  message: string;
  email: string;
  name: string;
};

const initialDraft: Draft = {
  reasons: [],
  followups: [],
  message: "",
  email: "",
  name: ""
};

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("reason");
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Draft) : initialDraft;
    } catch {
      return initialDraft;
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldWiggle, setShouldWiggle] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Persist draft
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // First-load wiggle: once per browser session
  useEffect(() => {
    const KEY = "chatdock-wiggled-session";
    if (!sessionStorage.getItem(KEY)) {
      setShouldWiggle(true);
      const t = setTimeout(() => {
        setShouldWiggle(false);
        sessionStorage.setItem(KEY, "1");
      }, 5000);
      return () => clearTimeout(t);
    }
  }, []);

  // Helpers
  const toggleReason = (id: ReasonId) => {
    setDraft((d) => {
      const exists = d.reasons.includes(id);
      return { ...d, reasons: exists ? d.reasons.filter((r) => r !== id) : [...d.reasons, id] };
    });
  };

  const toggleFollowup = (label: string) => {
    setDraft((d) => {
      const exists = d.followups.includes(label);
      return { ...d, followups: exists ? d.followups.filter((f) => f !== label) : [...d.followups, label] };
    });
  };

  const resetAll = () => {
    setDraft(initialDraft);
    setSent(false);
    setError(null);
    setStep("reason");
  };

  const nextFromReason = () => {
    if (draft.reasons.length === 0) return;
    const hasFollowups = draft.reasons.some((r) => REASONS.find((x) => x.id === r)?.followups.length);
    setStep(hasFollowups ? "followup" : "details");
  };

  const nextFromFollowup = () => setStep("details");

  const onSubmitDetails = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("contact");
  };

  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...draft, site: window.location.hostname, when: new Date().toISOString() };
      const res = await fetch("/.netlify/functions/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSent(true);
      setStep("confirm");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "We couldn’t send this automatically.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Union of followups across selected reasons
  const followupOptions = Array.from(
    new Set(draft.reasons.flatMap((rid) => REASONS.find((r) => r.id === rid)?.followups ?? []))
  );

  return (
    <>
      <style>{CHAT_CSS}</style>

      {/* Launcher */}
      <button
        className={`chat-launcher ${shouldWiggle ? "wiggle" : ""}`}
        aria-label="Open planner chat"
        onClick={() => setOpen(true)}
      >
        <span className="chat-launcher-spark" aria-hidden="true" />
        <span className="chat-clickme">CLICK&nbsp;ME</span>
      </button>

      {open && (
        <div className="chat-wrap" role="dialog" aria-modal="true" aria-label="Planner chat">
          <div className="chat-panel" ref={panelRef}>
            <header className="chat-head">
              {/* New: logo next to the title */}
              <div className="chat-title">
                <strong>
                  <img src="/logo-cloud-s.png" alt="" className="chat-icon" aria-hidden="true" />
                  Blueprint Planner
                </strong>
                <span>Quick chips → clear plan → send</span>
              </div>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </header>

            <div className="chat-body">
              {step === "reason" && (
                <section className="chat-section">
                  <p className="chat-prompt">How can I help today?</p>
                  <div className="chips">
                    {REASONS.map((r) => (
                      <button
                        key={r.id}
                        className={`chip ${draft.reasons.includes(r.id) ? "active" : ""}`}
                        onClick={() => toggleReason(r.id)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <div className="chat-actions">
                    <button className="btn white" onClick={nextFromReason} disabled={draft.reasons.length === 0}>
                      Next
                    </button>
                    <button className="link" onClick={resetAll}>Reset</button>
                  </div>
                </section>
              )}

              {step === "followup" && (
                <section className="chat-section">
                  <p className="chat-prompt">Great — pick a few specifics (optional)</p>
                  <div className="chips">
                    {followupOptions.map((f) => (
                      <button
                        key={f}
                        className={`chip ${draft.followups.includes(f) ? "active" : ""}`}
                        onClick={() => toggleFollowup(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="chat-actions">
                    <button className="btn white" onClick={nextFromFollowup}>Next</button>
                    <button className="link" onClick={() => setStep("reason")}>Back</button>
                  </div>
                </section>
              )}

              {step === "details" && (
                <section className="chat-section">
                  <p className="chat-prompt">In a sentence or two, what outcome do you want?</p>
                  <form onSubmit={onSubmitDetails}>
                    <textarea
                      required
                      value={draft.message}
                      maxLength={3000}
                      onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                      placeholder="Example: A web app for onboarding that standardizes data capture and cuts manual steps."
                    />
                    <div className="chips suggest">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="chip ghost"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              message: d.message ? `${d.message}\n• ${s}` : `• ${s}`
                            }))
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="chat-actions">
                      <button className="btn white" type="submit">Next</button>
                      <button className="link" type="button" onClick={() => setStep("followup")}>Back</button>
                    </div>
                  </form>
                </section>
              )}

              {step === "contact" && (
                <section className="chat-section">
                  <p className="chat-prompt">Where should we reply?</p>
                  <form onSubmit={onSend}>
                    <div className="field">
                      <label htmlFor="email">Email (required)</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={draft.email}
                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                        placeholder="you@company.com"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="name">Name (optional)</label>
                      <input
                        id="name"
                        type="text"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="chat-actions">
                      <button className="btn white" type="submit" disabled={submitting}>
                        {submitting ? "Sending…" : "Send"}
                      </button>
                      <button className="link" type="button" onClick={() => setStep("details")}>Back</button>
                    </div>
                    {error && (
                      <p className="err">
                        {error}{" "}
                        <a
                          href={`mailto:support@tiertechtools.com?subject=Chat fallback&body=${encodeURIComponent(
                            draft.message || ""
                          )}`}
                        >
                          Open email
                        </a>
                      </p>
                    )}
                  </form>
                </section>
              )}

              {step === "confirm" && sent && (
                <section className="chat-section">
                  <div className="summary">
                    <div className="summary-title">✅ Sent</div>
                    <div className="summary-body">
                      <b>Reply to:</b> {draft.email}<br/>
                      <b>Reasons:</b>{" "}
                      {draft.reasons.map((r) => REASONS.find((x) => x.id === r)?.label).join(", ") || "—"}<br/>
                      {draft.followups.length > 0 && (<><b>Details:</b> {draft.followups.join(", ")}<br/></>)}
                      <b>Message:</b><br/>{draft.message || "—"}
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="btn white" onClick={() => setOpen(false)}>Close</button>
                    <button className="link" onClick={resetAll}>Start another</button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
