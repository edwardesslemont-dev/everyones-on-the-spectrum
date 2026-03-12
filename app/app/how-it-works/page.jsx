export const metadata = {
  title: "How it works — Everyone's on the Spectrum",
};

const SOURCES = {
  "Big Gov. Left": ["Common Dreams", "Daily Kos", "The American Prospect", "In These Times", "The Nation"],
  "Big Gov. Right": ["Breitbart", "Newsmax", "Washington Examiner", "New York Post", "Washington Times"],
  "Libertarian Left": ["The Intercept", "Mother Jones", "Jacobin", "Democracy Now", "CounterPunch"],
  "Libertarian Right": ["Reason", "Cato Institute", "Mises Institute", "Antiwar.com", "FEE"],
};

const QUADRANT_COLORS = {
  "Big Gov. Left":      { color: "#7965B2", bg: "#F7F5FD", border: "#D8D0F0" },
  "Big Gov. Right":     { color: "#C47B3C", bg: "#FCF6EE", border: "#EDD8B8" },
  "Libertarian Left":   { color: "#4A82B0", bg: "#EFF6FC", border: "#C0DDF0" },
  "Libertarian Right":  { color: "#4E8E80", bg: "#EFF8F6", border: "#B8DDD8" },
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
          <a href="/" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#9a9590", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>← Back</a>
          <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>How it works</span>
        </div>

        <Section title="The idea">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724", marginBottom: 12 }}>
            Every major news story is being covered right now by dozens of outlets — each choosing what to emphasize, what to omit, and how to frame it. Most news apps show you one angle. We show you all four.
          </p>
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724" }}>
            Everyone's on the Spectrum presents the top stories of the day through four distinct political lenses: Big Gov. Left, Big Gov. Right, Libertarian Left, and Libertarian Right — each explained with genuine empathy, not caricature.
          </p>
        </Section>

        <Section title="The process">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", label: "Collect headlines", desc: "Twice a day, we pull the latest headlines from 20 news sources across the political spectrum — 5 per quadrant." },
              { step: "2", label: "Select the top stories", desc: "Claude (Anthropic's AI) reads all the headlines and selects the 5 most significant stories of the moment, prioritizing events covered across multiple quadrants and ensuring variety across topics." },
              { step: "3", label: "Generate four perspectives", desc: "For each story, Claude writes a neutral factual summary and then four distinct takes — one per quadrant — each rooted in that quadrant's genuine values and worldview. No strawmen." },
              { step: "4", label: "Publish", desc: "Stories go live on the site automatically. The whole process takes under a minute." },
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

        <Section title="Sources">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 14, lineHeight: 1.7, color: "#5a5650", marginBottom: 16 }}>
            We pull from 20 outlets — 5 per quadrant. Sources were chosen to represent each quadrant's mainstream and independent voices.
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

        <Section title="Refresh schedule">
          <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#2a2724" }}>
            Stories refresh twice a day — usually around <strong>7AM and 7PM PT</strong>. If you check the site between refreshes, you're seeing the most recent batch.
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
