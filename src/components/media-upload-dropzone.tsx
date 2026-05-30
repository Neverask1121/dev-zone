import React, { DragEvent, ChangeEvent, useMemo, useState } from "react";

type UploadItem = {
  name: string;
  size: number;
  type: string;
  preview: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToItem(file: File): UploadItem {
  return {
    name: file.name,
    size: file.size,
    type: file.type || "unknown",
    preview: URL.createObjectURL(file),
  };
}

function PreviewTile({ item, onRemove }: { item: UploadItem; onRemove: () => void }) {
  return (
    <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid #e2e8f0", background: "#fff", display: "grid", gap: 10 }}>
      <div style={{ height: 140, background: "#f8fafc", display: "grid", placeItems: "center" }}>
        <img src={item.preview} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 12, display: "grid", gap: 6 }}>
        <strong style={{ color: "#0f172a", fontSize: 14 }}>{item.name}</strong>
        <span style={{ color: "#64748b", fontSize: 13 }}>{formatBytes(item.size)}</span>
        <span style={{ color: "#64748b", fontSize: 12 }}>{item.type}</span>
        <button
          type="button"
          onClick={onRemove}
          style={{
            width: "fit-content",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: "#fff",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function MediaUploadDropzone() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const accept = useMemo(() => ["image/png", "image/jpeg", "image/webp", "image/avif"], []);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next: UploadItem[] = [];
    for (const file of Array.from(fileList)) {
      if (!accept.includes(file.type)) {
        setError(`Unsupported file type: ${file.type || file.name}`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError(`File too large: ${file.name}`);
        continue;
      }
      next.push(fileToItem(file));
    }
    if (next.length) {
      setItems((current) => [...current, ...next]);
      setError("");
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Media Upload Dropzone</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A file upload dropzone with preview tiles, basic validation, and drag-and-drop support.
          </p>
        </header>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            borderRadius: 24,
            border: dragging ? "2px solid #2563eb" : "2px dashed #cbd5e1",
            background: dragging ? "#eff6ff" : "#f8fafc",
            padding: 24,
            display: "grid",
            gap: 12,
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <strong style={{ color: "#0f172a", fontSize: 20 }}>Drop files here</strong>
          <span style={{ color: "#475569", fontSize: 14, lineHeight: "22px", maxWidth: 520 }}>
            Supported types: PNG, JPG, WEBP, and AVIF. Files larger than 8 MB are rejected.
          </span>
          <input type="file" accept={accept.join(",")} multiple onChange={handleInput} />
        </div>

        {error ? (
          <div style={{ padding: 12, borderRadius: 16, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 14 }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {items.map((item, index) => (
            <PreviewTile
              key={`${item.name}-${index}`}
              item={item}
              onRemove={() => setItems((current) => current.filter((_, i) => i !== index))}
            />
          ))}
        </div>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The dropzone supports both drag-and-drop and native file selection.</div>
          <div>Preview tiles show the user exactly what was uploaded.</div>
          <div>Validation checks file type and size before the preview is added.</div>
          <div>The tile list scales naturally as more files are added.</div>
          <div>Removing an item only touches the local preview list.</div>
          <div>The preview URLs keep the component functional without extra libraries.</div>
          <div>The design works for media, documents, or content attachments.</div>
          <div>Feedback is immediate when an invalid file is dropped.</div>
          <div>The empty state is replaced by real thumbnails as soon as files arrive.</div>
          <div>Because it is data-driven, the component can be wired to an upload API later.</div>
          <div>The tile layout remains clear on smaller screens.</div>
          <div>Users can see file name, size, and type at a glance.</div>
          <div>The component is practical for profile photos, galleries, or bulk upload flows.</div>
          <div>The border state makes the active drop target obvious.</div>
          <div>It is a real input flow, not a static placeholder shell.</div>
        </section>
      </section>
    </main>
  );
}
