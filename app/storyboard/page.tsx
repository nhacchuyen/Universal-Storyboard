"use client";

import { useState } from "react";

type ImageItem = {
  url: string;
  prompt: string;
  index?: number;
  size?: string;
};

export default function StoryboardPage() {
  const [prompt, setPrompt] = useState(
    "Cinematic daytime love scene inside a phone booth, young Asian man and pretty western blonde girl with short sparky hair, realistic, soft natural light, shallow depth of field"
  );
  const [ratio, setRatio] = useState("16:9");
  const [count, setCount] = useState(3);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function generateImages() {
    setImages([]);
    setLoading(true);

    try {
      for (let i = 1; i <= count; i++) {
        setStatus(`Generating image ${i} of ${count}...`);

        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, ratio, index: i }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || `API error (${res.status})`);
        }

        if (!data?.url || typeof data.url !== "string") {
          throw new Error("No image URL returned");
        }

        setImages((prev) => [...prev, data]);
      }

      setStatus("Done ✅");
    } catch (e: any) {
      setStatus(`Error: ${e?.message || "Image generation failed"}`);
    }

    setLoading(false);
  }

  function downloadImage(url: string, filename: string) {
    // If it's a data URL (data:image/png;base64,...) download via Blob
    if (url.startsWith("data:image")) {
      const base64 = url.split(",")[1];
      const byteChars = atob(base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      return;
    }

    // Normal URL download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Storyboard Generator</h1>

      <textarea
        className="w-full h-32 p-3 rounded bg-neutral-900 border border-neutral-700 mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <select
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
          className="p-2 rounded bg-neutral-900 border border-neutral-700"
        >
          <option value="16:9">16:9 (YouTube / Grok)</option>
          <option value="9:16">9:16 (TikTok)</option>
          <option value="1:1">1:1</option>
        </select>

        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="p-2 rounded bg-neutral-900 border border-neutral-700"
        >
          <option value={1}>1 image</option>
          <option value={3}>3 images</option>
          <option value={4}>4 images</option>
          <option value={6}>6 images</option>
        </select>

        <button
          onClick={generateImages}
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <span className="text-neutral-400">{status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="border border-neutral-800 rounded overflow-hidden bg-neutral-950"
          >
            <img src={img.url} alt={`img-${i}`} className="w-full h-auto" />
            <button
              className="w-full bg-white text-black py-2 font-bold"
              onClick={() => downloadImage(img.url, `storyboard_${i + 1}.png`)}
            >
              Download image {i + 1}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
