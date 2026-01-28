"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState(2);
  const [pasteUrl, setPasteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function createPaste() {
    const res = await fetch("/api/paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, maxViews }),
    });

    const data = await res.json();
    setPasteUrl(`/paste/${data.id}`);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(
      window.location.origin + pasteUrl
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your paste..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        style={{ width: "100%" }}
      />

      <br /><br />

      <label>Max Views: </label>
      <input
        type="number"
        value={maxViews}
        onChange={(e) => setMaxViews(Number(e.target.value))}
      />

      <br /><br />

      <button onClick={createPaste}>Create Paste</button>

      {pasteUrl && (
        <div style={{ marginTop: 16 }}>
          <p>
            Paste created {" "}
            <a href={pasteUrl} target="_blank">
              {pasteUrl}
            </a>
          </p>

          <button onClick={copyLink}>
            {copied ? "✅ Copied!" : "📋 Copy Link"}
          </button>
        </div>
      )}
    </main>
  );
}
