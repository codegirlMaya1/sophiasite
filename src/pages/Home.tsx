// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useMemo, type CSSProperties } from "react";

export default function Home() {
  // Card shell (thick white border pop)
  const card = useMemo<CSSProperties>(() => ({
    borderRadius: 16,
    border: "4px solid #FFFFFF",
    background: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(12,27,58,.12)",
    overflow: "hidden",
  }), []);

  // Image #1: framed "cover" (fills its frame) — stays in the RIGHT column
  const coverWrapper = useMemo<CSSProperties>(() => ({
    ...card,
    aspectRatio: "16 / 10",
    minHeight: 320,
  }), [card]);


  // ✅ Image #2: FULL-WIDTH below the 2-col grid, NO CROPPING
  const fullWidthFigure = useMemo<CSSProperties>(() => ({
    ...card,
    width: "100%",
    display: "block",
    marginTop: 18, // gap from the grid above
  }), [card]);

  const imageFull = useMemo<CSSProperties>(() => ({
    display: "block",
    width: "100%",
    height: "auto",       // keep entire image visible
  }), []);

  const section = useMemo<CSSProperties>(() => ({
    padding: "48px 0",
  }), []);

  // 2-column layout for Solutions + Photo #1
  const grid2Lg = useMemo<CSSProperties>(() => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // left: list, right: Photo #1
    gap: 18,
    alignItems: "start",
  }), []);

  const kpi = useMemo<CSSProperties>(() => ({
    ...card,
    padding: 18,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
    gap: 12,
  }), [card]);

  const kpiItem: CSSProperties = { textAlign: "center", lineHeight: 1.15 };
  const kpiStat: CSSProperties = { fontWeight: 900, fontSize: 28 };
  const kpiLabel: CSSProperties = { fontSize: 12, opacity: 0.8 };

  const h1: CSSProperties = {
    fontSize: "clamp(28px, 4.6vw, 48px)",
    lineHeight: 1.05,
    fontWeight: 900,
    margin: "0 0 12px",
  };

  const pLead: CSSProperties = {
    fontSize: "clamp(15px, 2vw, 18px)",
    opacity: 0.9,
    margin: "0 0 18px",
  };

  const ctas: CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const ctaPrimary: CSSProperties = {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#FFFFFF",
    color: "#0C1B3A",
    border: "2px solid #183B8A",
    fontWeight: 900,
    textDecoration: "none",
  };

  const ctaSecondary: CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 12,
    background: "transparent",
    color: "#183B8A",
    border: "1px solid #AFC7F5",
    fontWeight: 900,
    textDecoration: "none",
  };

  return (
    <div className="home">
      {/* HERO */}
      <section style={section}>
        <div className="container" style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <h1 style={h1}>Software solutions that teams actually enjoy using.</h1>
            <p style={pLead}>
              Web & mobile apps, internal tools, analytics, and integrations—designed, built, and shipped with clear communication.
            </p>
            <div style={ctas}>
              <Link to="/contact" style={ctaPrimary}>DESIGN A PROJECT</Link>
              <Link to="/about" style={ctaSecondary}>How I work</Link>
            </div>
          </div>

          {/* KPIs */}
          <div style={kpi}>
            <div style={kpiItem}>
              <div style={kpiStat}>45%</div>
              <div style={kpiLabel}>Faster document prep</div>
            </div>
            <div style={kpiItem}>
              <div style={kpiStat}>70%</div>
              <div style={kpiLabel}>Fewer formatting errors</div>
            </div>
            <div style={kpiItem}>
              <div style={kpiStat}>2–6 wks</div>
              <div style={kpiLabel}>Typical delivery window</div>
            </div>
            <div style={kpiItem}>
              <div style={kpiStat}>100%</div>
              <div style={kpiLabel}>Plain-language docs</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS + CUSTOMER PHOTO #1 (right column) */}
      <section style={{ ...section, paddingTop: 0 }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22 }}>Solutions for teams</h2>

          <div style={grid2Lg} className="responsive-grid">
            {/* Left column: Solutions list */}
            <ul style={{ ...card, padding: 16, listStyle: "disc", paddingLeft: 28 }}>
              <li><b>Web Applications</b> — Responsive React front-ends with clean TypeScript services, solid auth, and production-ready deployment.</li>
              <li><b>Mobile Applications</b> — Cross-platform apps with offline-first flows, secure sync, and ergonomics tuned for busy workflows.</li>
              <li><b>Internal Tools</b> — Role-based dashboards, approvals, and reporting that remove manual steps and create auditability.</li>
              <li><b>Data &amp; Analytics</b> — From ingestion to visualization—clean contracts, reliable pipelines, and clear, explainable metrics.</li>
              <li><b>AI Assistants &amp; Models</b> — Assistive systems with retrieval, safety guardrails, and human-in-the-loop to keep trust high.</li>
              <li><b>Integrations &amp; Automation</b> — Connect identity, payments, messaging, and storage. Standardize outputs and reduce copy-paste.</li>
            </ul>

            {/* Right column: Happy Customers #1 (cover) */}
            <figure style={coverWrapper}>
              <img
  src="/ad-happy-customers-1.png"
  alt="Why modern applications increase revenue"
  style={{
    display: "block",
    width: "100%",
    maxWidth: "1100px",   // keeps it elegant on wide screens
    height: "auto",       // ensures full image shows (no cropping)
    margin: "24px auto",  // centers inside the section
    border: "8px solid #FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(12,27,58,0.08)"
  }}
/>

             
            </figure>
          </div>

          {/* ⬇︎ Full-width Happy Customers #2 (no crop, entire image visible) */}
          <figure style={fullWidthFigure}>
            <img
              src="/ad-happy-customers-2.png"
              alt="Happy customers using an application, team celebrating a successful rollout"
              style={imageFull}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>
    </div>
  );
}

