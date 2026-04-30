import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getEmbedding } from "@/lib/embedding";

// cosine similarity
function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * (b[i] || 0);
    normA += a[i] * a[i];
    normB += (b[i] || 0) * (b[i] || 0);
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function searchChunks(query: string) {
  const snapshot = await getDocs(collection(db, "chunks"));

  const queryVector = (await getEmbedding(query)) as number[];

  const results = snapshot.docs.map(doc => {
    const data = doc.data();
    const embedding = (data.embedding || []) as number[];

    return {
      text: data.text,
      source: data.source,
      score: cosineSimilarity(queryVector, embedding)
    };
  });

  results.sort((a, b) => b.score - a.score);

  const q = query.toLowerCase();
  const top = results[0];

  // ⚠️ also fix potential crash if no results
  if (!top) return [];

  const keywordMatch = top.text.toLowerCase().includes(q);

  // 🚨 SMART FILTER
  if (top.score < 0.5 && !keywordMatch) {
    return [];
  }

  // remove duplicates
  const uniqueMap = new Map();
  results.forEach(r => {
    if (!uniqueMap.has(r.text)) {
      uniqueMap.set(r.text, r);
    }
  });

  return Array.from(uniqueMap.values()).slice(0, 5);
}