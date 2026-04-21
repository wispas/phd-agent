import { searchChunks } from "@/lib/search";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const results = await searchChunks(query);

    const context = results.map(r => r.text).join("\n");

    // 🔥 LLM generation
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a PhD research assistant. Answer clearly using provided sources."
        },
        {
          role: "user",
          content: `Question: ${query}\n\nSources:\n${context}`
        }
      ]
    });

    return Response.json({
      answer: response.choices[0].message.content
    });

  } catch (error: any) {
    console.error("AGENT ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}