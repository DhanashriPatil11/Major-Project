import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a legal assistant helping judges understand case details and bail decisions. Answer clearly and professionally.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message?.content ?? "Sorry, no response";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ reply: "Error processing request." }, { status: 500 });
  }
}
