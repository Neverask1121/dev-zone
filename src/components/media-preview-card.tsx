import React, { useMemo, useState } from "react";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  status: "ready" | "draft" | "published";
  sizeLabel: string;
  format: string;
  source: string;
  checksum: string;
};

const MEDIA: MediaItem[] = [
  { id: "hero", title: "Hero image", description: "Used for the landing page header.", status: "published", sizeLabel: "2400 × 1600", format: "JPG", source: "Brand library", checksum: "A12F-81D0" },
  { id: "feature", title: "Feature card", description: "Thumbnail for a product tile.", status: "ready", sizeLabel: "1200 × 900", format: "PNG", source: "Product catalog", checksum: "B09E-22AA" },
  { id: "gallery", title: "Gallery shot", description: "Preview for the media library grid.", status: "draft", sizeLabel: "1920 × 1080", format: "WEBP", source: "Creative team", checksum: "C44C-90B1" },
  { id: "banner", title: "Banner art", description: "Wide image for a campaign section.", status: "published", sizeLabel: "2560 × 1440", format: "AVIF", source: "Campaign folder", checksum: "D11B-34F7" },
  { id: "portrait", title: "Portrait crop", description: "Used for a profile or author card.", status: "ready", sizeLabel: "1600 × 2000", format: "JPG", source: "Editorial set", checksum: "E78A-10C8" },
];

function StatusBadge({ status }: { status: MediaItem["status"] }) {
  const tone = status === "published" ? "#dcfce7" : status === "ready" ? "#dbeafe" : "#fef3c7";
  const fg = status === "published" ? "#166534" : status === "ready" ? "#1d4ed8" : "#b45309";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 999, padding: "4px 10px", background: tone, color: fg, fontSize: 12, fontWeight: 800 }}>
      {status}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, color: "#334155" }}>
      <span>{label}</span>
      <strong style={{ color: "#0f172a" }}>{value}</strong>
    </div>
  );
}

function PreviewPane({ item }: { item: MediaItem }) {
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid #e2e8f0", background: "#0f172a", color: "#fff" }}>
      <div style={{ minHeight: 270, background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 50%, #111827 100%)", display: "grid", placeItems: "center" }}>
        <div style={{ display: "grid", gap: 8, textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 13, color: "#bfdbfe", fontWeight: 800 }}>Preview tile</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{item.title}</div>
          <div style={{ color: "#cbd5e1", fontSize: 15, lineHeight: "24px", maxWidth: 380 }}>{item.description}</div>
        </div>
      </div>
      <div style={{ padding: 18, display: "grid", gap: 12, background: "#fff", color: "#0f172a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <strong>{item.title}</strong>
          <StatusBadge status={item.status} />
        </div>
        <MetaRow label="Description" value={item.description} />
        <MetaRow label="Size" value={item.sizeLabel} />
        <MetaRow label="Format" value={item.format} />
        <MetaRow label="Source" value={item.source} />
        <MetaRow label="Checksum" value={item.checksum} />
      </div>
    </div>
  );
}

function Thumb({ item, active, onClick }: { item: MediaItem; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 18,
        border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
        background: active ? "#eff6ff" : "#fff",
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ height: 84, borderRadius: 14, background: "linear-gradient(135deg, #dbeafe 0%, #e2e8f0 100%)", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 900, color: "#1d4ed8" }}>
        {item.title.slice(0, 1)}
      </div>
      <strong style={{ color: "#0f172a", fontSize: 14 }}>{item.title}</strong>
      <span style={{ color: "#475569", fontSize: 13, lineHeight: "20px" }}>{item.sizeLabel}</span>
      <span style={{ color: "#64748b", fontSize: 12 }}>{item.format}</span>
    </button>
  );
}

export default function MediaPreviewCard() {
  const [activeId, setActiveId] = useState(MEDIA[0].id);
  const activeItem = useMemo(() => MEDIA.find((item) => item.id === activeId) ?? MEDIA[0], [activeId]);

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Media Preview Card</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A preview card with thumbnail tiles, overlay styling, and metadata presented in a structured layout.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)", gap: 16, alignItems: "start" }}>
          <PreviewPane item={activeItem} />
          <aside style={{ display: "grid", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Media tiles</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {MEDIA.map((item) => (
                <Thumb key={item.id} item={item} active={item.id === activeId} onClick={() => setActiveId(item.id)} />
              ))}
            </div>
          </aside>
        </div>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The preview pane places the selected media item front and center.</div>
          <div>Thumbnail cards make browsing fast and keep visual scanning easy.</div>
          <div>Metadata is shown both in the preview and the list for quick confirmation.</div>
          <div>Status badges help distinguish drafts, ready items, and published items.</div>
          <div>The card can be used in galleries, content tools, or media libraries.</div>
          <div>Gradient placeholders stand in for real thumbnails while preserving layout shape.</div>
          <div>The design keeps the main image surface large enough for inspection.</div>
          <div>Selection is direct and easy to understand with simple button controls.</div>
          <div>The structure allows future actions like edit, replace, or remove.</div>
          <div>The same layout works for image previews, video posters, or document thumbnails.</div>
          <div>Responsive columns keep the card useful on smaller screens.</div>
          <div>The card balances visual focus and supporting metadata.</div>
          <div>It is suitable for content review and gallery browsing flows.</div>
          <div>The component can be embedded inside a dashboard or full-page browser.</div>
          <div>The selected tile state stays visible in the side rail.</div>
          <div>Thumbnail height is fixed to preserve a tidy grid.</div>
          <div>Simple structure makes the component easy to extend with actions later.</div>
          <div>Format and source metadata help users confirm where the asset belongs.</div>
          <div>The preview surface remains strong enough for approval-style workflows.</div>
          <div>Different media types can be supported with the same component shell.</div>
          <div>Checksum metadata can be used to verify cached or imported assets.</div>
          <div>The card works well for a content approval queue or a media audit tool.</div>
        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>Assets can be verified quickly because the metadata remains visible after selection.</div>
          <div>The selected item is easy to compare against alternate thumbnails in the side rail.</div>
          <div>The preview layout gives enough room for approval decisions and asset review.</div>
          <div>The component is intentionally structured for content operations and media management.</div>
        </section>
        </section>
      </section>
    </main>
  );
}
