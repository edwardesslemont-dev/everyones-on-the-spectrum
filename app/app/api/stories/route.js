import { getLatestStories } from "@/lib/db";

export async function GET() {
  try {
    const stories = await getLatestStories();
    if (!stories) {
      return Response.json({ stories: null }, { status: 404 });
    }
    return Response.json({ stories });
  } catch (err) {
    console.error("Failed to fetch stories:", err);
    return Response.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
