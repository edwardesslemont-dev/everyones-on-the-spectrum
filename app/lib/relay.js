// Runs Claude on Edward's Claude subscription instead of the metered API.
//
// The app never calls Anthropic itself. It queues a job in Postgres and waits;
// the claude-relay worker on Edward's Mac mini claims the job, runs it through
// headless Claude Code on the subscription, and posts the text back
// (app/api/relay/claim and app/api/relay/complete). If the Mini is off, the
// job times out and the caller gets an error.

import { createHash, timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";

const POLL_MS = 1000;

export async function initRelayTable() {
  await getDb().query(`
    CREATE TABLE IF NOT EXISTS claude_jobs (
      id SERIAL PRIMARY KEY,
      kind VARCHAR(30) NOT NULL,
      model VARCHAR(40) NOT NULL,
      effort VARCHAR(10),
      system TEXT,
      prompt TEXT,
      status VARCHAR(10) NOT NULL DEFAULT 'queued',
      result TEXT,
      error TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      claimed_at TIMESTAMPTZ
    )
  `);
}

// Queues one Claude run and waits for its text. Throws on failure or timeout.
export async function runOnSubscription({ kind, model, effort = null, system, prompt, timeoutMs }) {
  const db = getDb();
  await initRelayTable();
  await db.query(`DELETE FROM claude_jobs WHERE created_at < NOW() - INTERVAL '1 day'`);
  const { rows } = await db.query(
    `INSERT INTO claude_jobs (kind, model, effort, system, prompt) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [kind, model, effort, system, prompt]
  );
  const id = rows[0].id;
  const deadline = Date.now() + timeoutMs;

  try {
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const job = (await db.query(`SELECT status, result, error FROM claude_jobs WHERE id = $1`, [id])).rows[0];
      if (!job) throw new Error("Claude job disappeared");
      if (job.status === "done") return job.result;
      if (job.status === "failed") throw new Error(job.error || "Claude job failed");
    }
    throw new Error("Claude did not answer in time. The Mac mini relay may be offline.");
  } finally {
    // The waiter owns the row: once it stops waiting, nothing should run or keep it.
    await db.query(`DELETE FROM claude_jobs WHERE id = $1`, [id]).catch(() => {});
  }
}

// Constant-time check of the worker's key. Fails closed if RELAY_KEY is unset.
export function relayAuthorized(request) {
  const expected = process.env.RELAY_KEY;
  const given = request.headers.get("x-relay-key");
  if (!expected || !given) return false;
  const a = createHash("sha256").update(expected).digest();
  const b = createHash("sha256").update(given).digest();
  return timingSafeEqual(a, b);
}

// Folds a chat history into one prompt, since headless Claude Code takes a
// single prompt per run.
export function transcriptPrompt(messages) {
  const turns = messages.filter((m) => typeof m.content === "string" && m.content.trim());
  if (turns.length === 0) throw new Error("No messages");
  const last = turns[turns.length - 1];
  if (turns.length === 1) return last.content;
  const history = turns
    .slice(0, -1)
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n\n");
  return `Conversation so far:\n\n${history}\n\nReply to the user's latest message:\n\n${last.content}`;
}
