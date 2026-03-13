import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUADRANT_META = {
  authLeft:  { label: "Big Gov. Left",      color: "#7965B2", bgColor: "#F7F5FD", borderColor: "#D8D0F0" },
  authRight: { label: "Big Gov. Right",     color: "#C47B3C", bgColor: "#FCF6EE", borderColor: "#EDD8B8" },
  libLeft:   { label: "Libertarian Left",   color: "#4A82B0", bgColor: "#EFF6FC", borderColor: "#C0DDF0" },
  libRight:  { label: "Libertarian Right",  color: "#4E8E80", bgColor: "#EFF8F6", borderColor: "#B8DDD8" },
};

const QUADRANT_LABELS = {
  authLeft: "BIG GOV. LEFT SOURCES",
  authRight: "BIG GOV. RIGHT SOURCES",
  libLeft: "LIBERTARIAN LEFT SOURCES",
  libRight: "LIBERTARIAN RIGHT SOURCES",
  general: "TECH / BUSINESS / CULTURE SOURCES",
};

function formatHeadlines(headlines) {
  return Object.entries(headlines)
    .map(([quadrant, items]) => {
      const label = QUADRANT_LABELS[quadrant] || quadrant.toUpperCase();
      const lines = items.map((h) => `  - [${h.source}] ${h.title}`).join("\n");
      return `${label}:\n${lines || "  (no items)"}`;
    })
    .join("\n\n");
}

export async function generateStories(headlines) {
  const headlineText = formatHeadlines(headlines);

  const prompt = `You are the editorial engine for "Everyone's on the Spectrum" — a news app that presents the most important stories of the moment from 4 political perspectives: Big Gov. Left, Big Gov. Right, Libertarian Left, and Libertarian Right.

Here are headlines from 25 news sources across the political spectrum and general interest categories:

${headlineText}

Your task: think like a front-page editor. Ask yourself: "What are the 5 most important things a smart, curious American should know about right now?" Then generate full coverage for each.

STORY SELECTION:
- Pick the biggest ongoing stories, not just the latest tactical update. If the Iran conflict is the top story, frame it as "Iran war escalates" — not "missile hits school." The school strike is a fact within the bigger story.
- Exception: if a single event IS the story (a presidential assassination, a landmark Supreme Court ruling, a massive acquisition), frame it at the event level.
- Actively seek variety: politics, geopolitics, economy, tech/AI, business, culture. Do not pick 5 political stories if major tech or economic stories are unfolding.
- Tech and AI stories are a priority. Business deals, major product launches, AI developments, and industry shifts are all fair game.
- The same major story can appear in consecutive refreshes if it's still the most important thing happening — just reflect the latest developments in the facts.
- Prefer stories that matter to a broad American audience over niche or hyper-partisan events.

HEADLINE FRAMING:
- Frame at the story level: "Iran War Escalates as Oil Hits $100" not "U.S. Missile Strikes Iranian School"
- Neutral and factual — no spin, no loaded language
- Specific enough to be informative, broad enough to capture the full story

For each story generate:
- A neutral, story-level headline
- A category from: Politics, Economy, Technology, Health, World, Culture
- 4–6 verified facts (specific events, numbers, names — this is where tactical details like the school strike belong)
- For each of the 4 quadrants:
  - sentiment: an integer 1–5 reflecting how this story lands for this quadrant relative to their core values. 1 = very negative/threatening to their values, 2 = negative, 3 = neutral or mixed, 4 = positive, 5 = very positive/strongly aligns with their values. This is NOT about whether the news is objectively good or bad — it's about whether it aligns with or threatens THIS quadrant's worldview.
  - why: WHY people in this quadrant feel the way they do, rooted in their core values
  - defense: HOW they'd argue their position — specific evidence, historical examples, or logic they'd use
  - sources: 2–3 real outlet names from that quadrant's typical media diet

IMPORTANT: Every story gets all 4 quadrant perspectives — even tech, business, and culture stories. AI taking jobs, corporate consolidation, government regulation of tech — the quadrant framework applies to everything.

TONE: Write with genuine empathy for each quadrant. A reader from that quadrant should recognize themselves. Don't strawman. Make the strongest honest version of each argument. Keep why and defense to 2–3 sentences max — punchy, not exhaustive.

Return ONLY a valid JSON object — no markdown, no explanation, nothing else. All string values must be on a single line (no literal newlines inside strings). Exactly this structure:

{
  "stories": [
    {
      "id": 1,
      "category": "Politics",
      "headline": "...",
      "facts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
      "quadrants": {
        "authLeft":  { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "authRight": { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libLeft":   { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libRight":  { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] }
      }
    }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  let raw = message.content[0].text.trim();

  // Strip markdown code fences if present
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  // Extract the outermost JSON object (handles extra text before/after)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in Claude response");
  raw = jsonMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Last resort: strip literal control characters that break JSON
    const cleaned = raw.replace(/[\x00-\x1F\x7F]/g, (ch) =>
      ch === "\n" || ch === "\r" || ch === "\t" ? ch : ""
    );
    parsed = JSON.parse(cleaned);
  }

  // Merge static metadata (colors, labels) into each quadrant
  return parsed.stories.map((story, i) => ({
    ...story,
    id: i + 1,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    quadrants: Object.fromEntries(
      Object.entries(story.quadrants).map(([key, val]) => [
        key,
        { ...QUADRANT_META[key], ...val },
      ])
    ),
  }));
}
