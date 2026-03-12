import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUADRANT_META = {
  authLeft:  { label: "Big Gov. Left",      color: "#7965B2", bgColor: "#F7F5FD", borderColor: "#D8D0F0" },
  authRight: { label: "Big Gov. Right",     color: "#C47B3C", bgColor: "#FCF6EE", borderColor: "#EDD8B8" },
  libLeft:   { label: "Libertarian Left",   color: "#4A82B0", bgColor: "#EFF6FC", borderColor: "#C0DDF0" },
  libRight:  { label: "Libertarian Right",  color: "#4E8E80", bgColor: "#EFF8F6", borderColor: "#B8DDD8" },
};

function formatHeadlines(headlines) {
  return Object.entries(headlines)
    .map(([quadrant, items]) => {
      const label = QUADRANT_META[quadrant].label;
      const lines = items.map((h) => `  - [${h.source}] ${h.title}`).join("\n");
      return `${label.toUpperCase()} SOURCES:\n${lines || "  (no items)"}`;
    })
    .join("\n\n");
}

export async function generateStories(headlines) {
  const headlineText = formatHeadlines(headlines);

  const prompt = `You are the editorial engine for "Everyone's on the Spectrum" — a news app that presents every major story from 4 political perspectives: Big Gov. Left, Big Gov. Right, Libertarian Left, and Libertarian Right.

Here are headlines collected in the last 12 hours from 40 news sources across the political spectrum:

${headlineText}

Your task: select the 5 most significant stories of this moment and generate full coverage for each.

SELECTION CRITERIA:
- Prioritize stories with cross-quadrant significance (covered by multiple quadrant sources, OR major in one quadrant but absent from others — absence is valuable, it reveals coverage gaps)
- Prefer concrete news events over opinion pieces
- Ensure variety: don't pick 5 political stories if there are economy, tech, or world events worth covering
- Avoid trivial or celebrity non-news

For each story generate:
- A neutral, factual headline (no spin)
- A category from: Politics, Economy, Technology, Health, World, Culture
- 4–6 verified facts (no framing, no opinion — just what happened)
- For each of the 4 quadrants:
  - emotion: one emoji representing how this quadrant emotionally reacts to this story
  - why: a substantive paragraph explaining WHY people in this quadrant feel the way they do, rooted in their core values and worldview
  - defense: a substantive paragraph showing HOW they'd argue their position — the specific evidence, historical examples, or logic they'd use
  - sources: 2–3 source names from that quadrant's typical media diet (use real outlet names)

TONE FOR why/defense: Write with genuine empathy for each quadrant. A reader from that quadrant should recognize themselves. Don't strawman. Make the strongest honest version of each argument.

Return ONLY a valid JSON object — no markdown, no explanation, nothing else — in exactly this structure:

{
  "stories": [
    {
      "id": 1,
      "category": "Politics",
      "headline": "...",
      "facts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
      "quadrants": {
        "authLeft":  { "emotion": "😤", "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "authRight": { "emotion": "😡", "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libLeft":   { "emotion": "🤔", "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libRight":  { "emotion": "😌", "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] }
      }
    }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const parsed = JSON.parse(raw);

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
