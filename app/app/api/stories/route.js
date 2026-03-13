import { getLatestBatch } from "@/lib/db";

export async function GET() {
  try {
    const batch = await getLatestBatch();
    if (!batch) return Response.json({ stories: null }, { status: 404 });
    return Response.json({ stories: batch.stories, createdAt: batch.createdAt });
  } catch (err) {
    console.error("Failed to fetch stories:", err);
    return Response.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
