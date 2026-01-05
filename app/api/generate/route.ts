import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    const images = [];

    for (let i = 0; i < 9; i++) {
      const img = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });

      images.push({
        url: `data:image/png;base64,${img.data[0].b64_json}`,
      });
    }

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}