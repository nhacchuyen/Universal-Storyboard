"use client";

export default function Home() {
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
      <h1 style={{ fontSize: 42, marginBottom: 12 }}>
        Universal Storyboard
      </h1>

      <p style={{ color: "#aaaaaa", maxWidth: 700, marginBottom: 28 }}>
        Create AI-powered storyboard scenes, prompts, and cinematic frames
        for images and videos.
      </p>

      <a
        href="/storyboard"
        style={{
          display: "inline-block",
          background: "#ffffff",
          color: "#000000",
          padding: "14px 20px",
          borderRadius: 14,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Open Storyboard →
      </a>
    </div>
  );
}
