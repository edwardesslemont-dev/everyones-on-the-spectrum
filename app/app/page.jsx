"use client";
import { useState, useEffect } from "react";

const CATEGORY_COLORS = {
  Politics:    { bg: "#F0EEF8", text: "#6B5EA8" },
  Technology:  { bg: "#E8F4FD", text: "#3A6FA0" },
  Economy:     { bg: "#FBF5E8", text: "#956B2A" },
  Health:      { bg: "#F0FAF4", text: "#2E7D52" },
  World:       { bg: "#F0F4FB", text: "#3A5A8A" },
  Culture:     { bg: "#FBF0F8", text: "#8A3A6A" },
};

// Static fallback stories shown while real ones load or if DB is empty
const FALLBACK_STORIES = [
  {
    id: 1,
    category: "Politics",
    date: "Mar 10, 2026",
    headline: "Congress Passes Sweeping Climate Infrastructure Bill",
    facts: [
      "The bill allocates $400 billion over 10 years for clean energy infrastructure.",
      "It passed the Senate 52–48 along party lines.",
      "The Congressional Budget Office projects it will reduce emissions 30% by 2035.",
      "The bill includes tax credits for EV purchases up to $7,500.",
      "Opposition argues it will add $1.2 trillion to the national debt over 20 years.",
    ],
    quadrants: {
      authLeft:  { label: "Big Gov. Left",     color: "#7965B2", bgColor: "#F7F5FD", borderColor: "#D8D0F0", emotion: "🙌", why: "People in this quadrant tend to feel that this bill is long overdue and genuinely good news. They believe market forces have had decades to address climate change and failed, leaving working-class and frontline communities to bear the cost. To them, only coordinated government investment at scale can match the urgency of the crisis.", defense: "They'd point to the New Deal and the interstate highway system as proof that large public programs create lasting infrastructure and jobs. They'd cite IPCC projections showing the window for action is closing fast, and argue that the bill's $400 billion is not spending — it's an investment that pays for itself through avoided climate damages estimated in the trillions.", sources: ["The Nation", "Jacobin", "Common Dreams"] },
      authRight: { label: "Big Gov. Right",    color: "#C47B3C", bgColor: "#FCF6EE", borderColor: "#EDD8B8", emotion: "😡", why: "People in this quadrant tend to feel that this bill is a costly overreach that puts ideology ahead of economic reality. They prioritize energy security and national competitiveness, and believe government-mandated green transitions impose massive burdens on taxpayers and businesses without guaranteed results — all while geopolitical rivals continue to industrialize freely.", defense: "They'd argue that while the U.S. shuts down reliable energy infrastructure, China is building coal plants at record pace — meaning American emissions cuts simply export jobs and pollution overseas. They'd point to the CBO's projection of $1.2 trillion in added debt and ask why taxpayers should subsidize technologies that private markets haven't chosen on their own merits.", sources: ["Fox News", "Breitbart", "Daily Wire"] },
      libLeft:   { label: "Libertarian Left",  color: "#4A82B0", bgColor: "#EFF6FC", borderColor: "#C0DDF0", emotion: "😐", why: "People in this quadrant support climate action but are skeptical of top-down government programs that often get captured by corporate interests and fail to reach the communities that need help most. They want solutions that empower people — not just utility companies and EV buyers who can already afford a $50,000 car.", defense: "They'd argue that the bill's EV tax credits disproportionately benefit wealthy households, and that corporate contractors will absorb most of the $400 billion in green subsidies. They'd push instead for community-owned solar, local energy cooperatives, and investments in public transit.", sources: ["Vox", "The Atlantic", "NPR"] },
      libRight:  { label: "Libertarian Right", color: "#4E8E80", bgColor: "#EFF8F6", borderColor: "#B8DDD8", emotion: "😤", why: "People in this quadrant believe that price signals and market competition are far more efficient at driving technological innovation than government spending programs. They see this bill as a classic case of politicians picking winners and losers with borrowed money.", defense: "They'd champion a revenue-neutral carbon tax as the economically sound alternative — letting markets find the cheapest path to emissions reduction without bureaucrats choosing which technologies win. They'd cite Solyndra and other green subsidy failures as cautionary tales.", sources: ["Reason", "Cato", "WSJ"] },
    },
  },
];

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

const COMPASS = [
  {
    top: [
      { label: "Big Gov. Left", color: "#7965B2", bg: "#F7F5FD", border: "#D8D0F0", desc: "State-enforced equality & progressive moral regulation" },
      { label: "Big Gov. Right", color: "#C47B3C", bg: "#FCF6EE", border: "#EDD8B8", desc: "State-enforced tradition, order & protected markets" },
    ],
    bottom: [
      { label: "Libertarian Left", color: "#4A82B0", bg: "#EFF6FC", border: "#C0DDF0", desc: "Radical equality through voluntary cooperation & maximum personal freedom" },
      { label: "Libertarian Right", color: "#4E8E80", bg: "#EFF8F6", border: "#B8DDD8", desc: "Maximum individual liberty & completely free markets" },
    ],
  },
];

export default function Page() {
  const [stories, setStories] = useState(FALLBACK_STORIES);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("facts");

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((data) => {
        if (data.stories?.length) setStories(data.stories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const story = stories.find((s) => s.id === selectedId) || null;

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916" }}>
      <header style={{ borderBottom: "1px solid #EDEAE4", textAlign: "center", padding: "36px 24px 28px", background: "#fff" }}>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "#a09b95", textTransform: "uppercase", marginBottom: 12 }}>Top stories. Every angle.</div>
        <h1 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          background: "linear-gradient(90deg, #7965B2 0%, #C47B3C 33%, #4A82B0 66%, #4E8E80 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Everyone's on the Spectrum</h1>
        <div style={{ marginTop: 14, fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#b0aba5", letterSpacing: "0.04em" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        {!story ? (
          <div>
            {/* Compass */}
            <div style={{ margin: "36px auto 0", background: "#fff", border: "1px solid #EDEAE4", borderRadius: 16, padding: "28px 28px 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "#1a1916" }}>How we cover stories</span>
              </div>
              <p style={{ textAlign: "center", fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#9a9590", lineHeight: 1.6, marginBottom: 16 }}>
                Facts first — then all four perspectives.
              </p>
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↑ Big Government / Social Control</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {COMPASS[0].top.map((q) => (
                  <div key={q.label} className="compass-cell" style={{ background: q.bg, borderColor: q.border }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: q.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, color: "#6b6760", lineHeight: 1.5, whiteSpace: "pre-line", display: "block" }}>{q.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>← Economic Equality</span>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>Free Markets →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {COMPASS[0].bottom.map((q) => (
                  <div key={q.label} className="compass-cell" style={{ background: q.bg, borderColor: q.border }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: q.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, color: "#6b6760", lineHeight: 1.5, whiteSpace: "pre-line", display: "block" }}>{q.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↓ Personal Freedom / Live & Let Live</span>
              </div>
            </div>

            {/* Story list */}
            <div style={{ padding: "32px 0 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>
                  {loading ? "Loading stories…" : "Latest stories"}
                </span>
                <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
              </div>
              {!loading && <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#b0aba5", margin: 0 }}>We refresh our top 5 stories twice a day. Usually around 7AM and 7PM PT.</p>}
            </div>

            {loading && (
              <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>
                Fetching today's stories…
              </div>
            )}

            {!loading && stories.map((s) => {
              const cat = CATEGORY_COLORS[s.category] || { bg: "#F0EDE8", text: "#5a5650" };
              return (
                <div key={s.id} className="story-card" onClick={() => { setSelectedId(s.id); setTab("facts"); }}>
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
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 0 20px" }}>
              <button className="back-btn" onClick={() => setSelectedId(null)}>← Back</button>
              {(() => {
                const cat = CATEGORY_COLORS[story.category] || { bg: "#F0EDE8", text: "#5a5650" };
                return <span className="cat-pill" style={{ background: cat.bg, color: cat.text }}>{story.category}</span>;
              })()}
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 24, maxWidth: 680, color: "#1a1916" }}>{story.headline}</h2>

            <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#F0EDE8", borderRadius: 10, padding: 4, width: "fit-content" }}>
              <button className={`tab-btn ${tab === "facts" ? "on" : ""}`} onClick={() => setTab("facts")}>The Facts</button>
              <button className={`tab-btn ${tab === "spectrum" ? "on" : ""}`} onClick={() => setTab("spectrum")}>The Spectrum</button>
            </div>

            {tab === "facts" && (
              <div style={{ maxWidth: 660 }}>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", marginBottom: 18 }}>Verified facts — no framing, no opinion</p>
                {story.facts.map((f, i) => (
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
                  {[story.quadrants.authLeft, story.quadrants.authRight].map((q) => (
                    <QuadrantCard key={q.label} q={q} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>← Economic Equality</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>Free Markets →</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[story.quadrants.libLeft, story.quadrants.libRight].map((q) => (
                    <QuadrantCard key={q.label} q={q} />
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↓ Personal Freedom / Live & Let Live</span>
                </div>
              </div>
            )}
          </div>
        )}
        {!story && (
          <div style={{ textAlign: "center", paddingBottom: 40 }}>
            <a href="/how-it-works" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "#9a9590", textDecoration: "none", border: "1px solid #EDEAE4", borderRadius: 8, padding: "8px 18px", background: "#fff", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#1a1916"; e.currentTarget.style.borderColor = "#b0aba5"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9a9590"; e.currentTarget.style.borderColor = "#EDEAE4"; }}>
              How it works
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
