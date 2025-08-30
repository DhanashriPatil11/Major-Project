import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { caseText, chatHistory, judgeDecision } = await req.json();

    // If judgeDecision sent (Approve/Reject/Hold), just acknowledge for now
    if (judgeDecision) {
      // Here you can save the judgeDecision in your DB if you want
      return NextResponse.json({ status: "Decision saved" });
    }

    if (!caseText) {
      return NextResponse.json(
        { error: "No case text provided" },
        { status: 400 }
      );
    }

    // Compose prompt to summarize & give bail eligibility suggestion
    const prompt = `
You are a legal expert AI assistant.
Summarize the following case details concisely and provide a bail eligibility recommendation (Approve, Reject, Hold).

Case details:
${caseText}

Answer in JSON format like this:
{
  "summary": "...case summary here...",
  "recommendation": "Approve" | "Reject" | "Hold",
  "confidence": 0.0 to 1.0 (your confidence in the recommendation)
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const rawOutput = completion.choices[0].message?.content ?? "{}";

    // Try parse JSON from AI response
    let parsedOutput = {};
    try {
      parsedOutput = JSON.parse(rawOutput);
    } catch {
      // If parsing fails, send raw output as summary fallback
      parsedOutput = {
        summary: rawOutput,
        recommendation: null,
        confidence: null,
      };
    }

    return NextResponse.json(parsedOutput);
  } catch (error) {
    console.error("Decision error:", error);
    return NextResponse.json({ error: "Error processing request." }, { status: 500 });
  }
}
