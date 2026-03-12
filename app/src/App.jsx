import { useState } from "react";

const CATEGORY_COLORS = {
  Politics: { bg: "#F0EEF8", text: "#6B5EA8" },
  Technology: { bg: "#E8F4FD", text: "#3A6FA0" },
  Economy: { bg: "#FBF5E8", text: "#956B2A" },
};

const stories = [
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
      authLeft: {
        label: "Big Gov. Left",
        color: "#7965B2",
        bgColor: "#F7F5FD",
        borderColor: "#D8D0F0",
        emotion: "🙌",
        why: "People in this quadrant tend to feel that this bill is long overdue and genuinely good news. They believe market forces have had decades to address climate change and failed, leaving working-class and frontline communities to bear the cost. To them, only coordinated government investment at scale can match the urgency of the crisis.",
        defense: "They'd point to the New Deal and the interstate highway system as proof that large public programs create lasting infrastructure and jobs. They'd cite IPCC projections showing the window for action is closing fast, and argue that the bill's $400 billion is not spending — it's an investment that pays for itself through avoided climate damages estimated in the trillions.",
        sources: ["The Nation", "Jacobin", "Common Dreams"],
      },
      authRight: {
        label: "Big Gov. Right",
        color: "#C47B3C",
        bgColor: "#FCF6EE",
        borderColor: "#EDD8B8",
        emotion: "😡",
        why: "People in this quadrant tend to feel that this bill is a costly overreach that puts ideology ahead of economic reality. They prioritize energy security and national competitiveness, and believe government-mandated green transitions impose massive burdens on taxpayers and businesses without guaranteed results — all while geopolitical rivals continue to industrialize freely.",
        defense: "They'd argue that while the U.S. shuts down reliable energy infrastructure, China is building coal plants at record pace — meaning American emissions cuts simply export jobs and pollution overseas. They'd point to the CBO's projection of $1.2 trillion in added debt and ask why taxpayers should subsidize technologies that private markets haven't chosen on their own merits.",
        sources: ["Fox News", "Breitbart", "Daily Wire"],
      },
      libLeft: {
        label: "Libertarian Left",
        color: "#4A82B0",
        bgColor: "#EFF6FC",
        borderColor: "#C0DDF0",
        emotion: "😐",
        why: "People in this quadrant support climate action but are skeptical of top-down government programs that often get captured by corporate interests and fail to reach the communities that need help most. They want solutions that empower people — not just utility companies and EV buyers who can already afford a $50,000 car.",
        defense: "They'd argue that the bill's EV tax credits disproportionately benefit wealthy households, and that corporate contractors will absorb most of the $400 billion in green subsidies. They'd push instead for community-owned solar, local energy cooperatives, and investments in public transit — solutions that deliver both climate results and genuine economic equality.",
        sources: ["Vox", "The Atlantic", "NPR"],
      },
      libRight: {
        label: "Libertarian Right",
        color: "#4E8E80",
        bgColor: "#EFF8F6",
        borderColor: "#B8DDD8",
        emotion: "😤",
        why: "People in this quadrant believe that price signals and market competition are far more efficient at driving technological innovation than government spending programs. They see this bill as a classic case of politicians picking winners and losers with borrowed money — distorting investment decisions and creating costly dependencies that outlast any administration.",
        defense: "They'd champion a revenue-neutral carbon tax as the economically sound alternative — letting markets find the cheapest path to emissions reduction without bureaucrats choosing which technologies win. They'd cite Solyndra and other green subsidy failures as cautionary tales, and note that private investment in renewables was already outpacing public spending before the bill passed.",
        sources: ["Reason", "Cato", "WSJ"],
      },
    },
  },
  {
    id: 2,
    category: "Technology",
    date: "Mar 10, 2026",
    headline: "AI Hiring Tools Face Federal Discrimination Probe",
    facts: [
      "The EEOC launched an investigation into six major AI hiring platforms.",
      "Audits found statistically significant disparities in candidate screening outcomes by race.",
      "The tools are used by an estimated 40% of Fortune 500 companies.",
      "Vendors argue the models are trained on 'objective' performance data.",
      "The probe may result in mandatory algorithmic audits under proposed legislation.",
    ],
    quadrants: {
      authLeft: {
        label: "Big Gov. Left",
        color: "#7965B2",
        bgColor: "#F7F5FD",
        borderColor: "#D8D0F0",
        emotion: "😤",
        why: "People in this quadrant tend to feel that this probe is necessary but probably too little, too late. They see AI hiring tools as the latest technological extension of systemic racism in corporate America — discrimination that has been rebranded as 'algorithmic objectivity.' To them, the state has both the obligation and the power to intervene forcefully when private actors encode inequality into their systems.",
        defense: "They'd cite the audit data showing statistically significant racial disparities as proof that discriminatory outcomes are happening regardless of intent — and argue that intent doesn't matter, impact does. They'd point to decades of documented racial bias in hiring and make the case that voluntary compliance has never worked, making mandatory algorithmic audits and reparative hiring requirements the only credible path forward.",
        sources: ["Jacobin", "The Intercept", "In These Times"],
      },
      authRight: {
        label: "Big Gov. Right",
        color: "#C47B3C",
        bgColor: "#FCF6EE",
        borderColor: "#EDD8B8",
        emotion: "😠",
        why: "People in this quadrant tend to feel that this federal probe represents government overreach into private business decisions. They believe companies should be free to hire based on merit and performance, and that bureaucratic intervention in hiring — especially based on statistical disparities rather than proven intent — threatens the principle of meritocracy and stifles corporate innovation.",
        defense: "They'd argue that if a model is trained on objective performance data, its outputs should be presumed fair until proven otherwise through proper legal due process — not preemptive regulation triggered by optics. They'd warn that mandated hiring quotas or algorithmic restrictions would force companies to lower the bar, ultimately harming American competitiveness and productivity.",
        sources: ["Daily Wire", "Epoch Times", "Townhall"],
      },
      libLeft: {
        label: "Libertarian Left",
        color: "#4A82B0",
        bgColor: "#EFF6FC",
        borderColor: "#C0DDF0",
        emotion: "🤔",
        why: "People in this quadrant care deeply about both civil liberties and systemic equality. They want AI hiring systems to be held accountable and made transparent — but are wary of giving government too much control over private technology, which could itself become a tool of surveillance or suppression. They see a narrow path between laissez-faire and overreach.",
        defense: "They'd advocate for third-party algorithmic auditing requirements, mandatory public disclosure of training data, and the legal right for rejected candidates to request human review — reforms that create real accountability without heavy-handed mandates. They'd point to the EU's AI Act as a workable model that balances innovation with enforceable rights.",
        sources: ["The Atlantic", "Wired", "MIT Tech Review"],
      },
      libRight: {
        label: "Libertarian Right",
        color: "#4E8E80",
        bgColor: "#EFF8F6",
        borderColor: "#B8DDD8",
        emotion: "🙄",
        why: "People in this quadrant believe that competitive markets and reputational incentives are faster and more effective at correcting harmful corporate behavior than slow-moving federal agencies. They worry that heavy regulation will chill AI innovation and create compliance burdens that entrench large incumbents while blocking startups that might build better, fairer tools.",
        defense: "They'd argue that companies already face lawsuits, public backlash, and serious talent retention problems when their AI tools produce discriminatory outcomes — market pressures that are already forcing self-correction faster than any federal probe could. They'd also warn that regulatory uncertainty benefits the biggest players who can afford compliance lawyers, while freezing out the smaller companies most likely to build genuine alternatives.",
        sources: ["Reason", "TechCrunch", "Forbes"],
      },
    },
  },
  {
    id: 3,
    category: "Economy",
    date: "Mar 10, 2026",
    headline: "Fed Holds Rates Amid Renewed Inflation Fears",
    facts: [
      "The Federal Reserve voted 9–1 to hold the federal funds rate at 4.75%.",
      "CPI rose 0.4% in February, above the 0.3% consensus forecast.",
      "Chair Powell cited 'persistent shelter costs' as the primary driver.",
      "Markets fell 1.2% following the announcement.",
      "Two rate cuts previously forecast for 2026 are now considered unlikely.",
    ],
    quadrants: {
      authLeft: {
        label: "Big Gov. Left",
        color: "#7965B2",
        bgColor: "#F7F5FD",
        borderColor: "#D8D0F0",
        emotion: "😡",
        why: "People in this quadrant tend to feel that holding rates is yet another example of monetary policy that protects capital while punishing working people. High interest rates make mortgages, car loans, and small business credit more expensive — burdens that fall hardest on lower-income households. Meanwhile, bondholders and wealthy savers benefit from higher yields. To them, the Fed structurally serves Wall Street.",
        defense: "They'd argue that the real driver of inflation isn't excess consumer spending but corporate price-gouging and supply chain failures — problems that raising interest rates does nothing to fix. They'd cite research showing that rate hikes disproportionately hurt renters and small business owners while leaving wealthy asset-holders largely unaffected, and call for direct government intervention on housing supply and corporate pricing power instead.",
        sources: ["Jacobin", "The Nation", "Democracy Now"],
      },
      authRight: {
        label: "Big Gov. Right",
        color: "#C47B3C",
        bgColor: "#FCF6EE",
        borderColor: "#EDD8B8",
        emotion: "😒",
        why: "People in this quadrant tend to feel that the Fed is managing symptoms while Congress creates the disease. They believe persistent inflation is the predictable result of years of deficit spending and bloated social programs — and that rate hikes are a Band-Aid that doesn't address the root cause. They're also skeptical of unelected technocrats having this much power over the economy.",
        defense: "They'd point to the direct correlation between pandemic-era stimulus spending and the inflation surge that followed as evidence that fiscal irresponsibility — not tight money — is the real problem. They'd call for significant cuts to federal spending and a return to balanced budgets as the only durable cure for inflation, and question why Congress continues to run deficits while the Fed is forced to do the heavy lifting.",
        sources: ["Fox Business", "Breitbart", "American Conservative"],
      },
      libLeft: {
        label: "Libertarian Left",
        color: "#4A82B0",
        bgColor: "#EFF6FC",
        borderColor: "#C0DDF0",
        emotion: "🤷",
        why: "People in this quadrant take a pragmatic, data-driven view of monetary policy. They see the Fed's decision as reasonable caution given genuinely mixed economic signals — but they're frustrated that the debate focuses entirely on interest rates while ignoring the structural issue everyone can see in the numbers: shelter costs are the primary inflation driver, and no rate hike in history has built a single apartment.",
        defense: "They'd cite research showing that zoning reform, upzoning urban cores, and increased federal investment in affordable housing would do more to reduce shelter inflation than any interest rate policy. They'd argue that holding rates is defensible as a short-term move, but that the real policy failure is decades of local and federal government blocking the housing supply needed to house a growing population.",
        sources: ["Bloomberg", "The Atlantic", "Brookings"],
      },
      libRight: {
        label: "Libertarian Right",
        color: "#4E8E80",
        bgColor: "#EFF8F6",
        borderColor: "#B8DDD8",
        emotion: "😌",
        why: "People in this quadrant tend to feel that the Fed made exactly the right call. They believe monetary credibility is one of the most valuable and fragile assets in a modern economy, and that prematurely cutting rates — under political pressure or market wishful thinking — would reignite inflation and destroy the institutional trust that keeps the dollar stable. Patience, not stimulus, is the responsible path.",
        defense: "They'd point to the 1970s 'stop-go' monetary policy era as the definitive cautionary tale: the Fed cut rates too early, inflation came roaring back, and it ultimately took Paul Volcker's painful 20% rates to restore credibility. They'd argue that Powell staying the course despite pressure from markets and politicians is exactly the kind of institutional independence that prevents much worse outcomes down the road.",
        sources: ["WSJ", "Reason", "AEI"],
      },
    },
  },
];

function QuadrantCard({ q }) {
  return (
    <div className="qcard" style={{ background: q.bgColor, borderColor: q.borderColor }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: q.color }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
        </div>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{q.emotion}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, marginBottom: 5, opacity: 0.8 }}>Why they feel this way</p>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "#2a2724", fontFamily: "'Source Serif 4', Georgia, serif" }}>{q.why}</p>
      </div>
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, marginBottom: 5, opacity: 0.8 }}>How they'd argue it</p>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "#2a2724", fontFamily: "'Source Serif 4', Georgia, serif" }}>{q.defense}</p>
      </div>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 5 }}>
        {q.sources.map((src) => <span key={src} className="src-tag">{src}</span>)}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("facts");
  const story = stories.find((s) => s.id === selectedId) || null;

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,400;1,400&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAF7; }

        .story-card {
          background: #fff;
          border: 1px solid #EDEAE4;
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .story-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        .cat-pill {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          border-radius: 20px;
          padding: 3px 10px;
        }

        .back-btn {
          background: #F0EDE8;
          border: none;
          border-radius: 8px;
          color: #5a5650;
          cursor: pointer;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          padding: 6px 14px;
          transition: background 0.15s;
        }
        .back-btn:hover { background: #E5E1DB; }

        .tab-btn {
          background: none;
          border: none;
          color: #9a9590;
          cursor: pointer;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .tab-btn.on {
          background: #1a1916;
          color: #fff;
        }
        .tab-btn:not(.on):hover { background: #F0EDE8; color: #1a1916; }

        .qcard {
          border: 1.5px solid;
          border-radius: 12px;
          padding: 18px;
        }

        .politician {
          display: inline-block; position: relative; font-family: 'Inter', sans-serif; font-size: 10px; color: #4a4744; cursor: default; border-bottom: 1px dotted #b0aba5;
        }
        .politician .tip {
          visibility: hidden; opacity: 0; position: absolute; bottom: calc(100% + 7px); left: 0; transform: none;
          background: #1a1916; color: #fff; padding: 8px 11px; border-radius: 8px; font-size: 11px; line-height: 1.5; width: 230px; white-space: normal; z-index: 200; pointer-events: none;
          transition: opacity 0.15s;
        }
        .politician:hover .tip { visibility: visible; opacity: 1; }

        .src-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          border-radius: 4px;
          padding: 2px 8px;
          background: rgba(0,0,0,0.05);
          color: #5a5650;
        }

        .fact-row {
          display: flex;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #F0EDE8;
        }

        .see-spectrum-btn {
          margin-top: 24px;
          background: #1a1916;
          border: none;
          border-radius: 8px;
          color: #fff;
          padding: 10px 20px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .see-spectrum-btn:hover { opacity: 0.8; }

        .compass-cell {
          border-radius: 10px;
          padding: 12px;
          border: 1.5px solid;
        }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #EDEAE4", textAlign: "center", padding: "36px 24px 28px", background: "#fff" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "#a09b95", textTransform: "uppercase", marginBottom: 12 }}>Every story. Every angle.</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          background: "linear-gradient(90deg, #7965B2 0%, #C47B3C 33%, #4A82B0 66%, #4E8E80 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Everyone's on the Spectrum</h1>
        <div style={{ marginTop: 14, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#b0aba5", letterSpacing: "0.04em" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        {!story ? (
          <div>
            {/* Compass Legend */}
            <div style={{ margin: "36px auto 0", background: "#fff", border: "1px solid #EDEAE4", borderRadius: 16, padding: "28px 28px 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1a1916", letterSpacing: "0.02em" }}>How we cover every story</span>
              </div>
              <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9a9590", lineHeight: 1.6, marginBottom: 16 }}>
                Facts first — then all four perspectives.
              </p>
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↑ Big Government / Social Control</span>
              </div>
              {/* Top row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { label: "Big Gov. Left", color: "#7965B2", bg: "#F7F5FD", border: "#D8D0F0", desc: "Equality via state\n+ enforced progressive rules",
                    politicians: [
                      { name: "Bernie Sanders", tip: "Longtime advocate for heavy government role in healthcare, wealth taxes, worker rights, and economic redistribution." },
                      { name: "Alexandria Ocasio-Cortez", tip: "Pushes aggressive government programs (Green New Deal, Medicare for All, wealth taxes) and regulatory oversight to achieve equality." },
                      { name: "Elizabeth Warren", tip: "Strong on economic regulation, breaking up big tech/banks, consumer protection, and progressive taxation." },
                    ]},
                  { label: "Big Gov. Right", color: "#C47B3C", bg: "#FCF6EE", border: "#EDD8B8", desc: "Markets + tradition\nvia enforced rules",
                    politicians: [
                      { name: "Donald Trump", tip: "Protectionist tariffs, massive military/immigration enforcement, tax cuts for markets, and traditionalist social stances." },
                      { name: "Mike Pence", tip: "Classic social conservative with strong government enforcement on abortion/religious liberty, plus pro-business deregulation." },
                      { name: "Ted Cruz", tip: "Advocates tough border security, law-and-order, and government-backed traditional values, while supporting free-market tax policies." },
                    ]},
                ].map((q) => (
                  <div key={q.label} className="compass-cell" style={{ background: q.bg, borderColor: q.border }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: q.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6b6760", lineHeight: 1.5, whiteSpace: "pre-line", display: "block", marginBottom: 8 }}>{q.desc}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {q.politicians.map((p) => (
                        <span key={p.name} className="politician">{p.name}<span className="tip">{p.tip}</span></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Horizontal axis label */}
              <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>← Economic Equality</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>Free Markets →</span>
              </div>
              {/* Bottom row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { label: "Libertarian Left", color: "#4A82B0", bg: "#EFF6FC", border: "#C0DDF0", desc: "Freedom + equality",
                    politicians: [
                      { name: "Rashida Tlaib", tip: "Strong on personal freedoms (civil liberties, anti-war) while pushing socialist-leaning economic policies and distrust of big institutions." },
                      { name: "Cori Bush", tip: "Emphasizes grassroots equality, anti-police militarization, and economic justice without heavy top-down authoritarianism." },
                      { name: "Jill Stein", tip: "Advocates decentralized, anti-corporate economics with strong personal freedoms — anti-surveillance, drug decriminalization, civil rights." },
                    ]},
                  { label: "Libertarian Right", color: "#4E8E80", bg: "#EFF8F6", border: "#B8DDD8", desc: "Freedom + free markets",
                    politicians: [
                      { name: "Rand Paul", tip: "Consistent on civil liberties (anti-Patriot Act, criminal justice reform), ending foreign wars, and free-market economics with low taxes/regulation." },
                      { name: "Ron Paul", tip: "Icon of this quadrant: gold standard advocacy, non-interventionism, drug legalization, and extreme deregulation." },
                      { name: "Justin Amash", tip: "Strong on personal freedoms (privacy, free speech) and laissez-faire economics; left Republican party to become independent/Libertarian." },
                    ]},
                ].map((q) => (
                  <div key={q.label} className="compass-cell" style={{ background: q.bg, borderColor: q.border }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: q.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: q.color, fontWeight: 700 }}>{q.label}</span>
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6b6760", lineHeight: 1.5, whiteSpace: "pre-line", display: "block", marginBottom: 8 }}>{q.desc}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {q.politicians.map((p) => (
                        <span key={p.name} className="politician">{p.name}<span className="tip">{p.tip}</span></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↓ Personal Freedom / Live & Let Live</span>
              </div>
            </div>

            {/* Story list */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 0 16px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>Today's Stories</span>
              <div style={{ flex: 1, height: 1, background: "#EDEAE4" }} />
            </div>
            {stories.map((s) => {
              const cat = CATEGORY_COLORS[s.category] || { bg: "#F0EDE8", text: "#5a5650" };
              return (
                <div key={s.id} className="story-card" onClick={() => { setSelectedId(s.id); setTab("facts"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                        <span className="cat-pill" style={{ background: cat.bg, color: cat.text }}>{s.category}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#b0aba5" }}>{s.date}</span>
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(17px, 2.5vw, 21px)", fontWeight: 700, lineHeight: 1.35, marginBottom: 12, color: "#1a1916" }}>{s.headline}</h2>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {Object.values(s.quadrants).map((q) => (
                          <span key={q.label} style={{ width: 9, height: 9, borderRadius: "50%", background: q.color, display: "inline-block" }} />
                        ))}
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#b0aba5", marginLeft: 4 }}>4 perspectives · {s.facts.length} facts</span>
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
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 24, maxWidth: 680, color: "#1a1916" }}>{story.headline}</h2>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#F0EDE8", borderRadius: 10, padding: 4, width: "fit-content" }}>
              <button className={`tab-btn ${tab === "facts" ? "on" : ""}`} onClick={() => setTab("facts")}>The Facts</button>
              <button className={`tab-btn ${tab === "spectrum" ? "on" : ""}`} onClick={() => setTab("spectrum")}>The Spectrum</button>
            </div>

            {tab === "facts" && (
              <div style={{ maxWidth: 660 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", marginBottom: 18 }}>Verified facts — no framing, no opinion</p>
                {story.facts.map((f, i) => (
                  <div key={i} className="fact-row">
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#d0cbc5", paddingTop: 2, minWidth: 20 }}>{i + 1}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.7, fontFamily: "'Source Serif 4', Georgia, serif", color: "#2a2724" }}>{f}</span>
                  </div>
                ))}
                <button className="see-spectrum-btn" onClick={() => setTab("spectrum")}>See The Spectrum →</button>
              </div>
            )}

            {tab === "spectrum" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↑ Big Government / Social Control</span>
                </div>
                {/* Top row: Big Gov. Left + Big Gov. Right */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[story.quadrants.authLeft, story.quadrants.authRight].map((q) => (
                    <QuadrantCard key={q.label} q={q} />
                  ))}
                </div>
                {/* Economic axis label between rows */}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>← Economic Equality</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", color: "#b0aba5", letterSpacing: "0.1em" }}>Free Markets →</span>
                </div>
                {/* Bottom row: Libertarian Left + Libertarian Right */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[story.quadrants.libLeft, story.quadrants.libRight].map((q) => (
                    <QuadrantCard key={q.label} q={q} />
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0aba5" }}>↓ Personal Freedom / Live & Let Live</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
