import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getEmbedding } from "@/lib/embedding";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, source } = body;

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const embedding = await getEmbedding(text);

    if (!embedding || embedding.length === 0) {
      return Response.json({ error: "Embedding failed" }, { status: 500 });
    }

    await addDoc(collection(db, "chunks"), {
      text,
      source: source || "unknown",
      embedding,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ success: true });

  } catch (error: any) {
    console.error("🔥 ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}