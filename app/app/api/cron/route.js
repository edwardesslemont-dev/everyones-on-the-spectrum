import { fetchAllHeadlines } from "@/lib/rss";
import { generateStories } from "@/lib/claude";
import { initDb, saveStories, getLatestStories, getBatchKey } from "@/lib/db";

export async function GET(request) {
  // Verify secret via header (Vercel cron) or query param (manual trigger)
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    querySecret !== process.env.CRON_SECRET
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Cron job started:", new Date().toISOString());

    // 1. Ensure DB table exists
    await initDb();

    // 2. Fetch headlines from all 40 RSS feeds
    console.log("Fetching RSS headlines...");
    const headlines = await fetchAllHeadlines();
    const totalHeadlines = Object.values(headlines).flat().length;
    console.log(`Fetched ${totalHeadlines} headlines across 4 quadrants`);

    if (totalHeadlines < 10) {
      return Response.json({ error: "Too few headlines fetched" }, { status: 500 });
    }

    // 3. Send to Claude to select + generate stories
    console.log("Generating stories with Claude...");
    const stories = await generateStories(headlines);
    console.log(`Generated ${stories.length} stories`);

    // 4. Save to database
    const batchKey = getBatchKey();
    await saveStories(batchKey, stories);
    console.log(`Saved batch: ${batchKey}`);

    // Verify save worked by reading back immediately
    const verify = await getLatestStories();
    const verifyCount = Array.isArray(verify) ? verify.length : "NOT_ARRAY";
    console.log(`Verify read-back: ${verifyCount} stories`);

    return Response.json({ success: true, batchKey, count: stories.length, verifyReadBack: verifyCount, dbUrl: process.env.DATABASE_URL?.slice(0, 35) });
  } catch (err) {
    console.error("Cron job failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
