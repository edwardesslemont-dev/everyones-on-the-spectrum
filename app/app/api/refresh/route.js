import { fetchAllHeadlines } from "@/lib/rss";
import { generateStories } from "@/lib/claude";
import { initDb, saveStories, getBatchKey, cleanupOldBatches, getLatestBatch } from "@/lib/db";

const COOLDOWN_HOURS = 4;

export async function POST() {
  try {
    await initDb();

    // Enforce 4-hour cooldown
    const latest = await getLatestBatch();
    if (latest?.createdAt) {
      const hoursSince = (Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSince < COOLDOWN_HOURS) {
        const nextRefreshAt = new Date(new Date(latest.createdAt).getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
        return Response.json({ error: "too_soon", nextRefreshAt }, { status: 429 });
      }
    }

    const headlines = await fetchAllHeadlines();
    const totalHeadlines = Object.values(headlines).flat().length;
    if (totalHeadlines < 10) return Response.json({ error: "Too few headlines fetched" }, { status: 500 });

    const stories = await generateStories(headlines);
    const batchKey = getBatchKey();
    await saveStories(batchKey, stories);
    await cleanupOldBatches();

    return Response.json({ success: true, count: stories.length });
  } catch (err) {
    console.error("Refresh failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
