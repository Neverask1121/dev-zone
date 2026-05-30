import React, { useMemo, useState } from "react";

type Action = {
  id: string;
  label: string;
  hint: string;
  tone: "primary" | "secondary" | "danger";
};

const ACTIONS: Action[] = [
  { id: "save", label: "Save", hint: "Store the current workflow state.", tone: "primary" },
  { id: "preview", label: "Preview", hint: "Inspect the current result.", tone: "secondary" },
  { id: "duplicate", label: "Duplicate", hint: "Create another copy.", tone: "secondary" },
  { id: "delete", label: "Delete", hint: "Remove the current item.", tone: "danger" },
];

function ActionButton({
  action,
  active,
  onClick,
}: {
  action: Action;
  active: boolean;
  onClick: (action: Action) => void;
}) {
  const bg =
    action.tone === "primary" ? "#2563eb" : action.tone === "danger" ? "#fee2e2" : "#fff";
  const fg =
    action.tone === "primary" ? "#fff" : action.tone === "danger" ? "#b91c1c" : "#0f172a";

  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      style={{
        borderRadius: 14,
        border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
        background: bg,
        color: fg,
        padding: "10px 14px",
        cursor: "pointer",
        display: "grid",
        gap: 4,
        textAlign: "left",
        minWidth: 128,
      }}
    >
      <strong style={{ fontSize: 14 }}>{action.label}</strong>
      <span style={{ fontSize: 12, lineHeight: "18px", color: action.tone === "primary" ? "rgba(255,255,255,0.9)" : "#475569" }}>
        {action.hint}
      </span>
    </button>
  );
}

export default function StickyActionBar() {
  const [selectedId, setSelectedId] = useState("save");
  const [savedCount, setSavedCount] = useState(0);

  const selected = useMemo(() => ACTIONS.find((action) => action.id === selectedId) ?? ACTIONS[0], [selectedId]);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 18 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Sticky Action Bar</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A fixed action bar that stays visible while the page content scrolls.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gap: 16,
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            background: "#fff",
            padding: 18,
          }}
        >
          <section style={{ display: "grid", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Content area</h3>
            <div style={{ display: "grid", gap: 12, color: "#334155", fontSize: 14, lineHeight: "24px" }}>
              <div>This block simulates long-form content so the sticky control can be tested against a real scroll context.</div>
              <div>The action bar should remain available while the user reads or edits the page.</div>
              <div>Below are repeated sections that represent forms, notes, or detail panels.</div>
              <div>Keeping the bar sticky reduces the need to scroll back to the top for common actions.</div>
              <div>It works best when the primary action stays obvious and the secondary actions remain compact.</div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {Array.from({ length: 12 }, (_, index) => (
                <article
                  key={index}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 16,
                    background: index % 2 === 0 ? "#f8fafc" : "#fff",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <strong style={{ color: "#0f172a" }}>Section {index + 1}</strong>
                  <span style={{ color: "#475569", lineHeight: "22px", fontSize: 14 }}>
                    This section exists to give the page enough height for sticky behavior to matter.
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              position: "sticky",
              bottom: 16,
              zIndex: 20,
              borderRadius: 22,
              border: "1px solid #e2e8f0",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 12px 28px rgba(15,23,42,0.12)",
              padding: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: "#0f172a", fontSize: 15 }}>Sticky controls</strong>
              <span style={{ color: "#475569", fontSize: 13 }}>Selected: {selected.label}</span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ACTIONS.map((action) => (
                <ActionButton key={action.id} action={action} active={action.id === selectedId} onClick={(picked) => setSelectedId(picked.id)} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSavedCount((count) => count + 1)}
              style={{
                borderRadius: 14,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                padding: "11px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Save now
            </button>
          </section>

          <section
            style={{
              borderRadius: 20,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: 18,
              display: "grid",
              gap: 10,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Status summary</h3>
            <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              <div>Saved count: {savedCount}</div>
              <div>Current action: {selected.label}</div>
              <div>Sticky behavior keeps the controls accessible inside long workflows.</div>
              <div>The bar can hold different actions depending on the page state.</div>
              <div>Because it is compact, it does not block the content area.</div>
              <div>The component is ideal for editors, forms, and review pages.</div>
              <div>The same architecture works inside a panel, modal, or full document view.</div>
              <div>Primary and secondary actions remain visually separated.</div>
              <div>The layout is flexible enough for both desktop and tablet views.</div>
              <div>Responsive wrapping keeps the bar usable when space shrinks.</div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
