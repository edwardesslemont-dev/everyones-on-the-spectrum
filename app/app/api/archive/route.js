import { getArchiveBatches } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const batches = await getArchiveBatches();
    return Response.json({ batches });
  } catch (err) {
    console.error("Failed to fetch archive:", err);
    return Response.json({ error: "Failed to fetch archive" }, { status: 500 });
  }
}
