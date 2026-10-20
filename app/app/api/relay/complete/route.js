import { getDb } from "@/lib/db";
import { relayAuthorized } from "@/lib/relay";

export const dynamic = "force-dynamic";

// The Mac mini relay posts a job's text, or the reason it failed.
export async function POST(request) {
  if (!relayAuthorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ok, text, error } = await request.json();
  const { rowCount } = await getDb().query(
    `UPDATE claude_jobs SET status = $2, result = $3, error = $4, prompt = NULL, system = NULL
     WHERE id = $1 AND status = 'running'`,
    [id, ok ? "done" : "failed", ok ? text : null, ok ? null : String(error ?? "failed").slice(0, 1000)]
  );
  // 404 means the waiter already gave up and deleted the job.
  return Response.json({ ok: rowCount === 1 }, { status: rowCount === 1 ? 200 : 404 });
}
