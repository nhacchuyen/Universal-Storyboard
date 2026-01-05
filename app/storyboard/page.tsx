"use client";

import { useState } from "react";

type Scene = {
  id: number;
  prompt: string;
};

export default function StoryboardPage() {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 1, prompt: "" },
    { id: 2, prompt: "" },
    { id: 3, prompt: "" },
    { id: 4, prompt: "" },
  ]);

  function updateScene(id: number, value: string) {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, prompt: value } : s))
    );
  }

  function copyAll() {
    const text = scenes
      .map((s, i) => `Scene ${i + 1}:\n${s.prompt || "(empty)"}`)
      .join("\n\n");

    navigator.clipboard.writeText(text);
    alert("All scenes copied!");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        padding: 40,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 20 }}>
        🎬 Universal Storyboard
      </h1>

      {scenes.map((scene) => (
        <div key={scene.id} style={{ marginBottom: 20 }}>
          <h3>Scene {scene.id}</h3>
          <textarea
            value={scene.prompt}
            onChange={(e) => updateScene(scene.id, e.target.value)}
            placeholder="Describe this scene..."
            style={{
              width: "100%",
              minHeight: 100,
              padding: 12,
              borderRadius: 10,
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            }}
          />
        </div>
      ))}

      <button
        onClick={copyAll}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 14,
          fontWeight: 700,
          background: "#ffffff",
          color: "#000000",
          border: "none",
          cursor: "pointer",
        }}
      >
        Copy All Scenes
      </button>
    </div>
  );
}
