import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const { notes } = await req.json();

  const prompt = `
  You are a PhD research assistant.

  Use ONLY the notes below.
  Do NOT invent citations.

  ${JSON.stringify(notes)}

  Write an academic paragraph.
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({ text: res.choices[0].message.content });
}