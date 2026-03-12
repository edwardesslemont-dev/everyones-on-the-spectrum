import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT batch_key, created_at, jsonb_array_length(stories) as story_count
      FROM story_batches
      ORDER BY created_at DESC
      LIMIT 5
    `);
    return Response.json({
      rows: result.rows,
      dbUrl: process.env.DATABASE_URL?.slice(0, 40) + "...",
    });
  } catch (err) {
    return Response.json({ error: err.message, dbUrl: process.env.DATABASE_URL?.slice(0, 40) + "..." });
  }
}
