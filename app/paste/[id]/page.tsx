type Paste = {
  id: string;
  content: string;
  createdAt: string;
  expiresAt: string | null;
  maxViews: number | null;
  viewCount: number;
};

async function getPaste(id: string): Promise<Paste> {
  const res = await fetch(
    `http://localhost:3000/api/paste/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Paste not available");
  }

  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ REQUIRED in Next 15

  let paste: Paste;

  try {
    paste = await getPaste(id);
  } catch {
    return (
      <div style={{ padding: "40px" }}>
        <h1>❌ Paste not available</h1>
        <p>This paste may have expired or reached its view limit.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>📄 Paste</h1>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "16px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {paste.content}
      </pre>

      <p style={{ marginTop: "12px", opacity: 0.7 }}>
        Views: {paste.viewCount}
        {paste.maxViews ? ` / ${paste.maxViews}` : ""}
      </p>
    </div>
  );
}
