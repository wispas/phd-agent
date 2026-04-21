import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getEmbedding } from "@/lib/embedding";

// fake embedding (temporary)
function createFakeEmbedding(text: string) {
  return text.split(" ").map(word => word.length);
}

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
  
    // 🔥 REAL embedding
    const queryVector = await getEmbedding(query);
  
    const results = snapshot.docs.map(doc => {
      const data = doc.data();
  
      return {
        text: data.text,
        source: data.source,
        score: cosineSimilarity(
            queryVector as number[],
            (data.embedding || []) as number[]
          )
      };
    });
  
    // 🔥 REAL threshold (important)
    results.sort((a, b) => b.score - a.score);

const uniqueMap = new Map();

results.forEach(r => {
  if (!uniqueMap.has(r.text)) {
    uniqueMap.set(r.text, r);
  }
});

return Array.from(uniqueMap.values()).slice(0, 5);
  }