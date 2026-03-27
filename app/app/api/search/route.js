import { fetchAllHeadlines } from "@/lib/rss";
import { generateSearchStory } from "@/lib/claude";
import { initDb, saveHeadlines, getLatestHeadlines } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  const { query, fresh } = await req.json();
  if (!query?.trim()) return Response.json({ error: "No query" }, { status: 400 });

  try {
    await initDb();

    let headlines;
    if (fresh) {
      headlines = await fetchAllHeadlines();
      await saveHeadlines(headlines);
    } else {
      const cached = await getLatestHeadlines();
      if (cached) {
        headlines = cached.headlines;
      } else {
        // No cache yet — fetch fresh on first use
        headlines = await fetchAllHeadlines();
        await saveHeadlines(headlines);
      }
    }

    const result = await generateSearchStory(headlines, query);

    if (result.coverage === "low") {
      return Response.json({ coverage: "low" });
    }

    return Response.json({ story: result });
  } catch (err) {
    console.error("Search failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
