import { Pool } from "pg";

let pool;

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initDb() {
  const db = getDb();
  await db.query(`
    CREATE TABLE IF NOT EXISTS story_batches (
      id SERIAL PRIMARY KEY,
      batch_key VARCHAR(50) UNIQUE NOT NULL,
      stories JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function saveStories(batchKey, stories) {
  const db = getDb();
  await db.query(
    `INSERT INTO story_batches (batch_key, stories)
     VALUES ($1, $2)
     ON CONFLICT (batch_key) DO UPDATE SET stories = $2, created_at = NOW()`,
    [batchKey, JSON.stringify(stories)]
  );
}

export async function getLatestStories() {
  const db = getDb();
  const result = await db.query(
    `SELECT stories FROM story_batches ORDER BY created_at DESC LIMIT 1`
  );
  return result.rows[0]?.stories || null;
}

export async function getLatestBatch() {
  const db = getDb();
  const result = await db.query(
    `SELECT stories, created_at FROM story_batches ORDER BY created_at DESC LIMIT 1`
  );
  if (!result.rows[0]) return null;
  return { stories: result.rows[0].stories, createdAt: result.rows[0].created_at };
}

export async function getArchiveBatches() {
  const db = getDb();
  const result = await db.query(
    `SELECT batch_key, stories, created_at
     FROM story_batches
     WHERE created_at > NOW() - INTERVAL '30 days'
     ORDER BY created_at DESC
     OFFSET 1`
  );
  return result.rows;
}

export async function cleanupOldBatches() {
  const db = getDb();
  await db.query(`DELETE FROM story_batches WHERE created_at < NOW() - INTERVAL '30 days'`);
}

export function getBatchKey() {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const hour = now.getUTCHours();
  const window = hour < 12 ? "morning" : "evening";
  return `${date}-${window}`;
}
