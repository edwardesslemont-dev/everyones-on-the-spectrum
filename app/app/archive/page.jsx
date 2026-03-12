"use client";
import { useState, useEffect } from "react";

const CATEGORY_COLORS = {
  Politics:   { bg: "#F0EEF8", text: "#6B5EA8" },
  Technology: { bg: "#E8F4FD", text: "#3A6FA0" },
  Economy:    { bg: "#FBF5E8", text: "#956B2A" },
  Health:     { bg: "#F0FAF4", text: "#2E7D52" },
  World:      { bg: "#F0F4FB", text: "#3A5A8A" },
  Culture:    { bg: "#FBF0F8", text: "#8A3A6A" },
};

function parseBatchKey(key) {
  const parts = key.split("-");
  const period = parts.pop();
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${dateStr} · ${period.charAt(0).toUpperCase() + period.slice(1)}`;
}

function QuadrantCard({ q }) {
  return (
    <div className="qcard" style={{ background: q.bgColor, borderColor: q.borderColor }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: q.color }} />
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
        </div>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{q.emotion}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, marginBottom: 5, opacity: 0.8 }}>Why they feel this way</p>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "#2a2724", fontFamily: "var(--font-source-serif), Georgia, serif" }}>{q.why}</p>
      </div>
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, marginBottom: 5, opacity: 0.8 }}>How they'd argue it</p>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "#2a2724", fontFamily: "var(--font-source-serif), Georgia, serif" }}>{q.defense}</p>
      </div>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 5 }}>
        {q.sources.map((src) => <span key={src} className="src-tag">{src}</span>)}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [tab, setTab] = useState("facts");

  useEffect(() => {
    fetch("/api/archive")
      .then((r) => r.json())
      .then((data) => { if (data.batches) setBatches(data.batches); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (selectedStory) {
    const s = selectedStory;
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916" }}>
        <header style={{ borderBottom: "1px solid #EDEAE4", textAlign: "center", padding: "36px 24px 28px", background: "#fff" }}>
          <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "#a09b95", textTransform: "uppercase", marginBottom: 12 }}>Top stories. Every angle.</div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.02em", background: "linear-gradient(90deg, #7965B2 0%, #C47B3C 33%, #4A82B0 66%, #4E8E80 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Everyone's on the Spectrum</h1>
        </header>
        <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 0 20px" }}>
            <button className="back-btn" onClick={() => { setSelectedStory(null); setTab("facts"); }}>← Back</button>
            {(() => { const cat = CATEGORY_COLORS[s.category] || { bg: "#F0EDE8", text: "#5a5650" }; return <span className="cat-pill" style={{ background: cat.bg, color: cat.text }}>{s.category}</span>; })()}
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 24, maxWidth: 680, color: "#1a1916" }}>{s.headline}</h2>
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#F0EDE8", borderRadius: 10, padding: 4, width: "fit-content" }}>
            <button className={`tab-btn ${tab === "facts" ? "on" : ""}`} onClick={() => setTab("facts")}>The Facts</button>
            <button className={`tab-btn ${tab === "spectrum" ? "on" : ""}`} onClick={() => setTab("spectrum")}>The Spectrum</button>
          </div>
          {tab === "facts" && (
            <div style={{ maxWidth: 660 }}>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", marginBottom: 18 }}>Verified facts — no framing, no opinion</p>
              {s.facts.map((f, i) => (
                <div key={i} className="fact-row">
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "#d0cbc5", paddingTop: 2, minWidth: 20 }}>{i + 1}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font-source-serif), Georgia, serif", color: "#2a2724" }}>{f}</span>
                </div>
              ))}
              <button className="see-spectrum-btn" onClick={() => setTab("spectrum")}>See The Spectrum →</button>
            </div>
          )}
          {tab === "spectrum" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↑ Big Government / Social Control</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[s.quadrants.authLeft, s.quadrants.authRight].map((q) => <QuadrantCard key={q.label} q={q} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>← Economic Equality</span>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>Free Markets →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[s.quadrants.libLeft, s.quadrants.libRight].map((q) => <QuadrantCard key={q.label} q={q} />)}
              </div>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↓ Personal Freedom / Live & Let Live</span>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916" }}>
      <header style={{ borderBottom: "1px solid #EDEAE4", textAlign: "center", padding: "36px 24px 28px", background: "#fff" }}>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "#a09b95", textTransform: "uppercase", marginBottom: 12 }}>Top stories. Every angle.</div>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.02em", background: "linear-gradient(90deg, #7965B2 0%, #C47B3C 33%, #4A82B0 66%, #4E8E80 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Everyone's on the Spectrum</h1>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 0 24px" }}>
          <a href="/" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#9a9590", textDecoration: "none" }}>← Back</a>
          <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>Archive</span>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>Loading archive…</div>
        )}

        {!loading && batches.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>No archived stories yet. Check back after the next refresh.</div>
        )}

        {!loading && batches.map((batch) => {
          const stories = Array.isArray(batch.stories) ? batch.stories : [];
          const label = parseBatchKey(batch.batch_key);
          return (
            <div key={batch.batch_key} style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", whiteSpace: "nowrap" }}>{label}</span>
                <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
              </div>
              {stories.map((s) => {
                const cat = CATEGORY_COLORS[s.category] || { bg: "#F0EDE8", text: "#5a5650" };
                return (
                  <div key={s.id} className="story-card" onClick={() => { setSelectedStory(s); setTab("facts"); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                          <span className="cat-pill" style={{ background: cat.bg, color: cat.text }}>{s.category}</span>
                          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#b0aba5" }}>{s.date}</span>
                        </div>
                        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(17px, 2.5vw, 21px)", fontWeight: 700, lineHeight: 1.35, marginBottom: 12, color: "#1a1916" }}>{s.headline}</h2>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {Object.values(s.quadrants).map((q) => (
                            <span key={q.label} style={{ width: 9, height: 9, borderRadius: "50%", background: q.color, display: "inline-block" }} />
                          ))}
                          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#b0aba5", marginLeft: 4 }}>4 perspectives · {s.facts.length} facts</span>
                        </div>
                      </div>
                      <span style={{ color: "#d0cbc5", fontSize: 20, marginTop: 2 }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </div>
  );
}
