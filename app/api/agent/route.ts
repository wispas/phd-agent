import { searchChunks } from "@/lib/search";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const results = await searchChunks(query);

    if (!results.length) {
      return Response.json({
        answer: "No relevant sources found in your knowledge base.",
        sources: []
      });
    }

    const context = results
      .slice(0, 3)
      .map((r: any) => r.text)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a PhD research assistant. Answer clearly and academically using ONLY provided sources."
        },
        {
          role: "user",
          content: `Question: ${query}

Sources:
${context}

Answer using ONLY these sources and cite them.`
        }
      ]
    });

    return Response.json({
      answer: response.choices[0].message.content,
      sources: results
    });

  } catch (error: any) {
    console.error("AGENT ERROR:", error);

    return Response.json({
      answer: "⚠️ AI failed. Check API key or billing.",
      sources: []
    });
  }
}