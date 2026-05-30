import React, { useEffect, useMemo, useRef, useState } from "react";

type MenuItem = {
  id: string;
  label: string;
  group: string;
};

const ITEMS: MenuItem[] = [
  { id: "open", label: "Open item", group: "Primary actions" },
  { id: "rename", label: "Rename", group: "Primary actions" },
  { id: "duplicate", label: "Duplicate", group: "Primary actions" },
  { id: "share", label: "Share", group: "Sharing" },
  { id: "copy-link", label: "Copy link", group: "Sharing" },
  { id: "archive", label: "Archive", group: "Danger zone" },
  { id: "delete", label: "Delete", group: "Danger zone" },
];

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</div>
      <div style={{ display: "grid", gap: 6 }}>{children}</div>
    </section>
  );
}

function MenuButton({ item, onPick }: { item: MenuItem; onPick: (item: MenuItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      style={{
        width: "100%",
        border: "none",
        borderRadius: 12,
        padding: "10px 12px",
        background: "#fff",
        color: item.group === "Danger zone" ? "#b91c1c" : "#0f172a",
        textAlign: "left",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {item.label}
    </button>
  );
}

export default function ContextMenuTrigger() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 24, y: 24 });
  const [selected, setSelected] = useState("Nothing chosen");

  const grouped = useMemo(() => {
    return ITEMS.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.group] = acc[item.group] ?? [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (open && hostRef.current && target && !hostRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const openMenu = (x: number, y: number) => {
    setMenuPosition({ x, y });
    setOpen(true);
  };

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Context Menu Trigger</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A pointer-aware contextual menu with grouped actions, keyboard dismissal, and clear selection feedback.
          </p>
        </header>

        <div
          ref={hostRef}
          onContextMenu={(event) => {
            event.preventDefault();
            openMenu(event.clientX, event.clientY);
          }}
          style={{
            minHeight: 320,
            borderRadius: 24,
            border: "1px dashed #cbd5e1",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
            padding: 18,
          }}
        >
          <div style={{ textAlign: "center", display: "grid", gap: 10, maxWidth: 500 }}>
            <strong style={{ color: "#0f172a", fontSize: 20 }}>Right click anywhere in this panel</strong>
            <span style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>
              The menu opens near the pointer and closes with Escape or an outside click.
            </span>
            <button
              type="button"
              onClick={(event) => {
                const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
                openMenu(rect.left + 20, rect.bottom + 12);
              }}
              style={{
                width: "fit-content",
                alignSelf: "center",
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                background: "#fff",
                padding: "10px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Open menu
            </button>
          </div>

          {open ? (
            <div
              role="menu"
              aria-label="Context menu"
              style={{
                position: "fixed",
                left: Math.min(menuPosition.x, window.innerWidth - 240),
                top: Math.min(menuPosition.y, window.innerHeight - 260),
                width: 240,
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                background: "#fff",
                boxShadow: "0 18px 48px rgba(15,23,42,0.18)",
                padding: 12,
                display: "grid",
                gap: 12,
                zIndex: 60,
              }}
            >
              {Object.entries(grouped).map(([group, items]) => (
                <MenuSection key={group} title={group}>
                  {items.map((item) => (
                    <MenuButton
                      key={item.id}
                      item={item}
                      onPick={(picked) => {
                        setSelected(picked.label);
                        setOpen(false);
                      }}
                    />
                  ))}
                </MenuSection>
              ))}
            </div>
          ) : null}
        </div>

        <section style={{ borderRadius: 22, border: "1px solid #e2e8f0", background: "#fff", padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Current selection</h3>
          <div style={{ color: "#334155", fontSize: 14, lineHeight: "22px" }}>{selected}</div>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The trigger area can be used on items, rows, cards, or document surfaces.</div>
          <div>The menu groups make it easier to separate safe actions from destructive actions.</div>
          <div>Pointer coordinates determine where the menu opens.</div>
          <div>Outside click and Escape behavior keep the interaction tidy.</div>
          <div>The selected item label updates immediately after choosing an option.</div>
          <div>The component can fit into file managers, lists, or content editors.</div>
          <div>The menu uses native buttons so each action is still a real target.</div>
          <div>Positioning is clamped to the viewport edges to avoid clipping.</div>
          <div>The same pattern can be adapted for touch long-press in mobile flows.</div>
          <div>Grouping helps the user scan related actions more quickly.</div>
          <div>The card surface demonstrates the interaction in a safe sandbox.</div>
          <div>The architecture is simple enough for reuse inside item rows.</div>
          <div>The contextual surface stays lightweight and focused.</div>
          <div>Users get a familiar right-click experience without extra chrome.</div>
          <div>The implementation is suitable for item lists and file explorers.</div>
        </section>
      </section>
    </main>
  );
}
