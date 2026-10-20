import { getDb } from "@/lib/db";
import { initRelayTable, relayAuthorized } from "@/lib/relay";

export const dynamic = "force-dynamic";

// The Mac mini relay claims the oldest queued Claude job.
export async function POST(request) {
  if (!relayAuthorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await initRelayTable();
  const { rows } = await getDb().query(`
    UPDATE claude_jobs SET status = 'running', claimed_at = NOW()
    WHERE id = (
      SELECT id FROM claude_jobs WHERE status = 'queued'
      ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED
    )
    RETURNING id, kind, model, effort, system, prompt
  `);
  return Response.json({ job: rows[0] ?? null });
}
