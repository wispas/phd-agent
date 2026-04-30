import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getEmbedding } from "@/lib/embedding";

export async function POST(req: Request) {
  try {
    const { text, source } = await req.json();

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const embedding = await getEmbedding(text);

    await addDoc(collection(db, "chunks"), {
      text,
      source: source || "unknown",
      embedding,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ success: true });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}