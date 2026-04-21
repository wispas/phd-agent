import { searchChunks } from "@/lib/search";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json({ error: "No query" }, { status: 400 });
    }

    const results = await searchChunks(query);

    // ✅ remove duplicates
    const uniqueMap = new Map();

    results.forEach((r: any) => {
      if (!uniqueMap.has(r.text)) {
        uniqueMap.set(r.text, r);
      }
    });

    const uniqueResults = Array.from(uniqueMap.values());

    uniqueResults.sort((a: any, b: any) => b.score - a.score);

    return Response.json(uniqueResults.slice(0, 5));

  } catch (error: any) {
    console.error("SEARCH ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}