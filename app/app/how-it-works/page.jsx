export const metadata = {
  title: "How it works — Everyone's on the Spectrum",
};

const SOURCES = {
  "Progressive Governance":         ["New York Times", "NBC News", "NPR", "The Guardian", "The Atlantic"],
  "Conservative Governance":        ["Fox News", "New York Post", "Washington Examiner", "National Review", "Daily Wire"],
  "Egalitarian Anti-Establishment": ["The Intercept", "Mother Jones", "Jacobin", "Democracy Now!", "Common Dreams"],
  "Free-Market Libertarian":        ["Reason", "Cato Institute", "Mises Institute", "Antiwar.com", "FEE"],
  "Tech / Business / Culture":      ["The Verge", "Wired", "Ars Technica", "TechCrunch", "Variety"],
};

const QUADRANT_COLORS = {
  "Progressive Governance":         { color: "#7965B2", bg: "#F7F5FD", border: "#D8D0F0" },
  "Conservative Governance":        { color: "#C47B3C", bg: "#FCF6EE", border: "#EDD8B8" },
  "Egalitarian Anti-Establishment": { color: "#4A82B0", bg: "#EFF6FC", border: "#C0DDF0" },
  "Free-Market Libertarian":        { color: "#4E8E80", bg: "#EFF8F6", border: "#B8DDD8" },
  "Tech / Business / Culture":      { color: "#6B6760", bg: "#F5F4F0", border: "#E0DDD8" },
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", marginBottom: 14 }}>{title}</p>
      {children}
    </div>
  );
}

export default function HowItWorks() {
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
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <a href="/" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#9a9590", textDecoration: "none" }}>← Back</a>
          <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>How it works</span>
        </div>

        <Section title="The idea">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724", marginBottom: 12 }}>
            Every major news story is being covered right now by dozens of outlets — each choosing what to emphasize, what to omit, and how to frame it. Most news apps show you one angle. We show you all four.
          </p>
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724" }}>
            Everyone's on the Spectrum presents the top stories of the day through four distinct political lenses — each explained with genuine empathy, not caricature.
          </p>
        </Section>

        <Section title="The process">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", label: "Collect headlines", desc: "We pull the latest headlines from 25 sources — 20 across the political spectrum and 5 tech, business, and culture outlets." },
              { step: "2", label: "Select the top stories", desc: "Claude (Anthropic's AI) reads all the headlines and selects the 5 most significant stories of the moment — thinking like a front-page editor, not a wire service. Variety across topics is a priority." },
              { step: "3", label: "Generate four perspectives", desc: "For each story, Claude writes a neutral factual summary and then four distinct takes — one per quadrant — each rooted in that quadrant's genuine values and worldview. No strawmen." },
              { step: "4", label: "Publish", desc: "Stories go live on the site. The whole process takes under a minute." },
            ].map(({ step, label, desc }) => (
              <div key={step} style={{ display: "flex", gap: 16, background: "#fff", border: "1px solid #EDEAE4", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 700, color: "#d0cbc5", minWidth: 20, paddingTop: 2 }}>{step}</div>
                <div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 600, color: "#1a1916", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 14, lineHeight: 1.7, color: "#5a5650" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="The sentiment scale">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724", marginBottom: 16 }}>
            Each quadrant gets a sentiment score from 1 to 5 — not based on whether the news is objectively good or bad, but on whether the story aligns with or threatens that quadrant's core values.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { emoji: "😡", score: 1, label: "Very negative", desc: "This story directly threatens or contradicts this quadrant's core values." },
              { emoji: "😠", score: 2, label: "Negative", desc: "This quadrant sees this as bad news, even if not existentially threatening." },
              { emoji: "😐", score: 3, label: "Neutral / mixed", desc: "This quadrant has complicated or conflicted feelings — some good, some bad." },
              { emoji: "🙂", score: 4, label: "Positive", desc: "This story generally aligns with this quadrant's values and preferred direction." },
              { emoji: "😍", score: 5, label: "Very positive", desc: "This is exactly what this quadrant wants to see — strongly validates their worldview." },
            ].map(({ emoji, score, label, desc }) => (
              <div key={score} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", border: "1px solid #EDEAE4", borderRadius: 10, padding: "12px 16px" }}>
                <span style={{ fontSize: 24, lineHeight: 1, paddingTop: 2 }}>{emoji}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, color: "#1a1916", marginBottom: 2 }}>{score} — {label}</p>
                  <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 13, lineHeight: 1.6, color: "#5a5650" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Sources">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 14, lineHeight: 1.7, color: "#5a5650", marginBottom: 16 }}>
            We pull from 25 outlets — 5 per quadrant, plus 5 tech, business, and culture sources. Political sources represent each quadrant's mainstream and independent voices. The general sources ensure we surface major tech, AI, business, and culture stories regardless of political angle.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(SOURCES).map(([quadrant, sources]) => {
              const { color, bg, border } = QUADRANT_COLORS[quadrant];
              return (
                <div key={quadrant} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color, marginBottom: 10 }}>{quadrant}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {sources.map((s) => (
                      <span key={s} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "#2a2724" }}>{s}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Refreshing stories">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724" }}>
            Stories don't refresh automatically. Use the <strong>Refresh</strong> button on the homepage to pull the latest headlines and generate new stories. You can refresh once every 4 hours.
          </p>
        </Section>

        <Section title="About">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724" }}>
            Everyone's on the Spectrum is an independent project built on the belief that understanding how others see the world — really understanding it, not a caricature of it — is the first step toward better discourse. We don't take sides. We just show you all of them.
          </p>
        </Section>
      </main>
    </div>
  );
}
