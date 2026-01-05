"use client";

import { useMemo, useState } from "react";

type Img = { url: string };

export default function Home() {
  const [scene, setScene] = useState("");
  const [count, setCount] = useState(6);
  const [ratio, setRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(false);
const [lockCharacter, setLockCharacter] = useState(true);
const [characterNotes, setCharacterNotes] = useState(
  "Same person in every frame. Consistent facial identity, same face proportions, same hairstyle, same skin tone, same clothing style."
);

  const canGenerate = useMemo(() => scene.trim().length > 0, [scene]);

  async function generate() {
    if (!canGenerate) return;

    try {
      setLoading(true);
      setImages([]);

      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
  prompt: scene,
  characterNotes: lockCharacter ? characterNotes : "",
  n: count,
  ratio,
  quality: "8k ultra detailed, cinematic, sharp focus, realistic",
}),
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "API error");
        return;
      }

      setImages((data.images || []).map((url: string) => ({ url })));
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: 28,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ fontSize: 22, letterSpacing: 1, margin: 0 }}>
          UNIVERSAL STORYBOARD
        </h1>

        <button
          onClick={() => window.location.reload()}
          style={{
            borderRadius: 12,
            padding: "10px 14px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Frames */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            border: "1px solid #333",
            borderRadius: 14,
            padding: 10,
            background: "#0f0f0f",
          }}
        >
          <div style={{ color: "#aaa", fontSize: 13 }}>Frames</div>
          {[4, 9].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n as 4 | 9)}
              style={{
                borderRadius: 12,
                padding: "8px 12px",
                border: "1px solid #333",
                background: count === n ? "#fff" : "#111",
                color: count === n ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Ratio */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            border: "1px solid #333",
            borderRadius: 14,
            padding: 10,
            background: "#0f0f0f",
          }}
        >
          <div style={{ color: "#aaa", fontSize: 13 }}>Ratio</div>
          {(["16:9", "1:1", "9:16"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              style={{
                borderRadius: 12,
                padding: "8px 12px",
                border: "1px solid #333",
                background: ratio === r ? "#fff" : "#111",
                color: ratio === r ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <input
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          placeholder='Describe your scene (e.g., foggy street encounter at night)...'
          style={{
            flex: 1,
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 14,
            padding: "14px 16px",
            outline: "none",
            fontSize: 14,
          }}
        />

        <button
          disabled={!canGenerate || loading}
          onClick={generate}
          style={{
            borderRadius: 14,
            padding: "14px 18px",
            border: "1px solid #333",
            background: !canGenerate || loading ? "#222" : "#fff",
            color: !canGenerate || loading ? "#888" : "#000",
            cursor: !canGenerate || loading ? "not-allowed" : "pointer",
            fontWeight: 900,
            minWidth: 150,
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <p style={{ color: "#888", marginTop: 10 }}>
        Choose 6 frames, pick a ratio, then click Generate.
      </p>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 260,
              borderRadius: 18,
              background: "#111",
              border: "1px solid #333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              overflow: "hidden",
            }}
          >
            {images[i]?.url ? (
              <img
                src={images[i].url}
                alt={`frame-${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ fontSize: 14 }}>
                {loading ? "..." : `Frame ${i + 1}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}