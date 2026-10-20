import { runOnSubscription, transcriptPrompt } from "@/lib/relay";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  const { messages, story } = await req.json();

  const systemPrompt = story
    ? `You are a sharp, non-partisan political analyst helping a reader go deeper on a news story. You explain perspectives with genuine empathy — you never strawman any side.

The story the user is reading:
Headline: ${story.headline}
Category: ${story.category}
Facts:
${story.facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Political perspectives on this story:
${Object.entries(story.quadrants)
  .map(
    ([, q]) =>
      `${q.label} (sentiment: ${q.sentiment}/5):
  Why they feel this way: ${q.why}
  How they'd argue it: ${q.defense}`
  )
  .join("\n\n")}

Guidelines:
- Keep responses concise — 2–4 paragraphs max unless the user asks for more.
- Don't repeat information already shown on the page unless asked to elaborate.
- You can speculate about implications, historical context, and likely outcomes — clearly labeled as analysis, not fact.
- Stay anchored to this specific story. If the user goes off-topic, gently redirect.
- Never advocate for a political position. Illuminate all sides honestly.`
    : `You are a helpful political analyst. Answer questions about news and politics with balance and clarity.`;

  let text;
  try {
    text = await runOnSubscription({
      kind: "chat",
      model: "haiku",
      system: systemPrompt,
      prompt: transcriptPrompt(messages),
      timeoutMs: 55_000,
    });
  } catch (err) {
    text = `Error: ${err.message}`;
  }

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
