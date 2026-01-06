import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function pickSize(ratio: string) {
  if (ratio === "9:16") return "1024x1536";
  if (ratio === "1:1") return "1024x1024";
  return "1536x1024";
}

export async function POST(req: Request) {
  try {
    const { prompt = "", ratio = "16:9", index = 1 } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const size = pickSize(String(ratio));

    // ✅ Correct OpenAI Images call
    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: String(prompt),
      size,
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json(
        { error: "No image returned from OpenAI" },
        { status: 500 }
      );
    }    return NextResponse.json({
      url: `data:image/png;base64,${b64}`,
      prompt,
      index,
      size,
    });
} catch (err: any) {
  console.error("IMAGE API ERROR:", err);
  console.error("CAUSE:", err?.cause);

  return NextResponse.json(
    {
      error: err?.message || "Unknown error",
      name: err?.name,
      code: err?.code,
      cause: err?.cause?.message || err?.cause,
      status: err?.status,
    },
    { status: 500 }
);
}
}
