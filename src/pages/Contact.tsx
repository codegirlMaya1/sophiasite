// src/pages/Contact.tsx
import { useEffect, useMemo, useState, type FormEvent } from "react";

// Use env if present, else fallback to your provided key
const W3F_KEY =
  (import.meta as any).env?.VITE_W3F_KEY ??
  "592e79f6-18d3-4dfc-bff0-e8dfd4bf0a8a";

const GOAL_CHIPS = [
  "Scope a production-ready web app",
  "Design a mobile app for field teams",
  "Automate a manual workflow or approval",
  "Build a clean data dashboard with alerts",
  "Integrate auth, payments, and messaging",
  "Prototype an AI assistant with guardrails",
];

const PLACEHOLDERS = [
  "Example: A lightweight portal that reduces onboarding time by 50%.",
  "Example: A mobile app for field staff with offline-first and secure sync.",
  "Example: One dashboard with weekly digests, pulling from 3 systems.",
  "Example: Replace spreadsheets with a role-based internal tool + audit log.",
  "Example: An assistant that drafts replies and cites sources for review.",
];

export default function Contact() {
  const [result, setResult] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  // Rotate helpful placeholder
  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const placeholder = useMemo(() => PLACEHOLDERS[phIdx], [phIdx]);

  const onChip = (chip: string) => {
    setMessage((cur) => (cur ? `${cur}\n• ${chip}` : `• ${chip}`));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("");
    setSending(true);

    try {
      const formEl = event.currentTarget;
      const formData = new FormData(formEl);

      formData.append("access_key", W3F_KEY);
      formData.append("subject", "Project inquiry");
      formData.append("from_name", name || "Website visitor");
      formData.append("site", window.location.hostname);
      formData.append("when", new Date().toISOString());
      formData.append("to", "support@tiertechtools.com"); // route to your inbox

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data?.success) {
        setResult("Thanks — your message was sent. I’ll reply shortly.");
        formEl.reset();
        setEmail("");
        setName("");
        setCompany("");
        setMessage("");
      } else {
        setResult(data?.message || "We couldn’t send this right now.");
      }
    } catch {
      setResult("We couldn’t send this right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-wrap">
      <style>{CSS}</style>

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <h1>Start a project</h1>
          <p>
            Outline the outcome you want and how to reach you. I’ll reply with next
            steps, timeline options, and a clear delivery plan.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="contact-grid container">
        {/* Form card */}
        <div className="card form-card">
          <h2 className="card-title">Tell me a bit about your needs</h2>
          <p className="card-sub">This goes straight to my inbox.</p>

          <div className="chips">
            {GOAL_CHIPS.map((chip) => (
              <button key={chip} type="button" className="chip" onClick={() => onChip(chip)}>
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="form" noValidate>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Jordan Reed"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email (required)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="company">Company (optional)</label>
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company or team name"
              />
            </div>

            <div className="field">
              <label htmlFor="message">What would success look like?</label>
              <textarea
                id="message"
                name="message"
                required
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
              />
            </div>

            {/* Honeypot for bots */}
            <input type="checkbox" name="botcheck" tabIndex={-1} style={{ display: "none" }} readOnly />

            <div className="actions">
              <button className="btn-primary" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </button>
              <a className="btn-link" href="mailto:support@tiertechtools.com">
                Prefer email? support@tiertechtools.com
              </a>
            </div>

            {result && <div className="result">{result}</div>}
          </form>
        </div>

        {/* Info card */}
        <aside className="card info-card">
          <h3 className="aside-title">What to expect</h3>
          <ul className="bullets">
            <li><b>Response:</b> typically within 1–2 business days.</li>
            <li><b>Clarity first:</b> we’ll confirm scope, constraints, and success criteria.</li>
            <li><b>Deliverables:</b> a brief plan, milestones, and options that fit your timeline.</li>
          </ul>

          <div className="metrics">
            <div className="metric">
              <div className="num">2–6 wks</div>
              <div className="label">Typical delivery window</div>
            </div>
            <div className="metric">
              <div className="num">45%</div>
              <div className="label">Faster document prep</div>
            </div>
            <div className="metric">
              <div className="num">70%</div>
              <div className="label">Fewer formatting errors</div>
            </div>
          </div>

          <div className="note">
            Questions now? <a href="mailto:support@tiertechtools.com">Email directly</a>.
          </div>
        </aside>
      </section>
    </main>
  );
}

/* --- Scoped styles --- */
const CSS = `
:root{
  --bg:#F4F7FD;
  --panel:#FFFFFF;
  --ink:#0C1B3A;
  --muted:#41527A;
  --line:#D7E2F8;
  --accent:#2F5FE8;
  --accent-strong:#183B8A;
}

.contact-wrap{ background:var(--bg); min-height: calc(100vh - 120px); }
.container{ max-width:1120px; margin:0 auto; padding: 28px 16px; }

.contact-hero{
  background: linear-gradient(180deg, #E9F0FF, rgba(233,240,255,0));
  border-bottom: 1px solid var(--line);
}
.contact-hero-inner{ max-width: 1120px; margin: 0 auto; padding: 40px 16px 16px; }
.contact-hero h1{
  margin:0 0 10px; font-size: clamp(28px, 4.6vw, 44px);
  color: var(--accent-strong); letter-spacing: 0.2px;
}
.contact-hero p{
  margin:0 0 16px; color: var(--muted); font-size: 16px; max-width: 70ch;
}

.contact-grid{
  display:grid; grid-template-columns: 1.1fr .9fr; gap: 22px;
}
@media (max-width: 900px){
  .contact-grid{ grid-template-columns: 1fr; }
}

.card{
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(12,27,58,.06);
}

.form-card{ padding: 18px; }
.card-title{ margin: 4px 2px 6px; font-size: 18px; font-weight: 900; color: var(--ink); }
.card-sub{ margin: 0 2px 14px; color: var(--muted); font-size: 14px; }

.chips{ display:flex; flex-wrap: wrap; gap: 8px; margin: 2px 2px 12px; }
.chip{
  border-radius: 999px; padding: 8px 12px;
  border: 1px solid var(--line); background: #fff; color: var(--ink);
  font-weight: 800; cursor: pointer;
}
.chip:hover{ border-color: var(--accent); color: var(--accent-strong); }

.form{ margin-top: 6px; }
.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 640px){ .grid-2{ grid-template-columns: 1fr; } }

.field{ margin-bottom: 12px; }
.field label{ display:block; font-size: 12px; font-weight: 800; margin-bottom: 6px; color: var(--ink); }
.field input, .field textarea{
  width:100%; padding:12px 14px; border-radius:12px;
  border:1px solid var(--line); background:#F8FBFF; color:var(--ink);
}
.field textarea{ resize: vertical; }

.actions{ display:flex; align-items:center; gap: 12px; margin-top: 6px; flex-wrap: wrap; }
.btn-primary{
  display:inline-block; padding:12px 16px; border-radius:12px;
  background: var(--accent); color: #fff; border: 1px solid var(--accent-strong);
  font-weight: 900; cursor: pointer;
}
.btn-primary:disabled{ opacity: .7; cursor: not-allowed; }
.btn-link{ color: var(--accent); font-weight: 800; text-decoration: none; }
.btn-link:hover{ text-decoration: underline; }

.result{ margin-top: 10px; color: var(--muted); }

.info-card{ padding: 18px; display:flex; flex-direction:column; }
.aside-title{ margin: 4px 2px 10px; font-size: 16px; font-weight: 900; color: var(--ink); }
.bullets{ margin: 0 2px 12px; padding: 0 0 0 18px; color: var(--muted); line-height: 1.5; }

.metrics{
  display:grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 4px 2px 14px;
}
.metric{
  background:#F4F8FF; border:1px solid var(--line); border-radius: 12px; padding: 10px;
  display:flex; flex-direction:column; align-items:center; text-align:center;
}
.metric .num{ font-weight: 900; font-size: 18px; color: var(--accent-strong); }
.metric .label{ font-size: 12px; color: var(--muted); }

.note{ margin-top:auto; color: var(--muted); font-size: 14px; }
.note a{ color: var(--accent); font-weight: 800; text-decoration: none; }
.note a:hover{ text-decoration: underline; }
`;
