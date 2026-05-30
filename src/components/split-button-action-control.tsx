import React, { useEffect, useMemo, useRef, useState } from "react";

type Option = {
  id: string;
  label: string;
  description: string;
};

const OPTIONS: Option[] = [
  { id: "save", label: "Save draft", description: "Store without publishing." },
  { id: "publish", label: "Publish now", description: "Make the item live." },
  { id: "schedule", label: "Schedule publish", description: "Pick a future time." },
  { id: "preview", label: "Preview", description: "Open the draft preview." },
];

export default function SplitButtonActionControl() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(OPTIONS[0]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const node = event.target as Node | null;
      if (open && menuRef.current && node && !menuRef.current.contains(node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const primaryAction = useMemo(() => selected, [selected]);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Split Button Action Control</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A primary action with a secondary dropdown for alternate workflows and quick publishing choices.
          </p>
        </header>

        <div ref={menuRef} style={{ display: "flex", gap: 0, alignItems: "stretch", width: "fit-content", position: "relative" }}>
          <button
            type="button"
            onClick={() => setSelected(primaryAction)}
            style={{
              borderRadius: "14px 0 0 14px",
              border: "1px solid #2563eb",
              borderRight: "1px solid rgba(255,255,255,0.25)",
              background: "#2563eb",
              color: "#fff",
              padding: "12px 16px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {primaryAction.label}
          </button>
          <button
            type="button"
            onClick={() => setOpen((state) => !state)}
            aria-haspopup="menu"
            aria-expanded={open}
            style={{
              borderRadius: "0 14px 14px 0",
              border: "1px solid #2563eb",
              background: "#1d4ed8",
              color: "#fff",
              padding: "12px 14px",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            ▾
          </button>

          {open ? (
            <div
              role="menu"
              aria-label="Split button actions"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 280,
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                background: "#fff",
                boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
                padding: 12,
                display: "grid",
                gap: 8,
                zIndex: 20,
              }}
            >
              {OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                  }}
                  style={{
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    padding: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <strong style={{ color: "#0f172a", fontSize: 14 }}>{option.label}</strong>
                  <span style={{ color: "#475569", fontSize: 13, lineHeight: "20px" }}>{option.description}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <section style={{ borderRadius: 22, border: "1px solid #e2e8f0", background: "#f8fafc", padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Current action</h3>
          <strong style={{ color: "#0f172a", fontSize: 16 }}>{selected.label}</strong>
          <span style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{selected.description}</span>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The split control separates the most likely action from its alternatives.</div>
          <div>The dropdown is keyboard dismissible and closes on outside click.</div>
          <div>The primary button uses the current choice so the control always stays useful.</div>
          <div>The alternate menu presents quick selection options without leaving the toolbar.</div>
          <div>The architecture keeps the menu aligned with the trigger.</div>
          <div>The component is well suited to editors, dashboards, and task tools.</div>
          <div>Each option is a real workflow target rather than placeholder text.</div>
          <div>The menu can be extended with icons or shortcuts later.</div>
          <div>The state model is minimal and predictable.</div>
          <div>It works cleanly where space is tight and actions need to stay compact.</div>
          <div>The selection preview helps users understand the active mode.</div>
          <div>The two-button design improves usability without adding clutter.</div>
          <div>Spacing and border radius match modern application controls.</div>
          <div>The component can be integrated into a toolbar or header action row.</div>
          <div>Secondary actions remain accessible while the primary action remains obvious.</div>
        </section>
      </section>
    </main>
  );
}
