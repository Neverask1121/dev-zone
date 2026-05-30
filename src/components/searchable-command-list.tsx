import React, { useMemo, useState } from "react";

type Command = {
  id: string;
  category: string;
  title: string;
  description: string;
  shortcut: string;
  keywords: string[];
};

const COMMANDS: Command[] = [
  { id: "create-panel", category: "Workspace", title: "Create dashboard panel", description: "Start a new panel and choose a layout.", shortcut: "C", keywords: ["new", "panel", "dashboard", "layout"] },
  { id: "open-search", category: "Navigation", title: "Open global search", description: "Jump into search instantly.", shortcut: "⌘K", keywords: ["find", "search", "global", "lookup"] },
  { id: "toggle-theme", category: "Preferences", title: "Toggle theme", description: "Switch between bright and dark modes.", shortcut: "T", keywords: ["theme", "dark", "light", "appearance"] },
  { id: "share-workspace", category: "Collaboration", title: "Share workspace", description: "Invite teammates or copy a link.", shortcut: "S", keywords: ["share", "invite", "link", "team"] },
  { id: "export-csv", category: "Data", title: "Export filtered rows", description: "Download the current result set as CSV.", shortcut: "E", keywords: ["export", "csv", "download", "rows"] },
  { id: "focus-mode", category: "Workspace", title: "Enable focus mode", description: "Hide distractions and emphasize the task.", shortcut: "F", keywords: ["focus", "quiet", "mode", "minimal"] },
  { id: "open-help", category: "Support", title: "Open help center", description: "Show support topics and guidance.", shortcut: "?", keywords: ["help", "support", "docs", "guide"] },
  { id: "view-history", category: "Data", title: "View change history", description: "Inspect recent activity and edits.", shortcut: "H", keywords: ["history", "audit", "activity", "recent"] },
  { id: "pin-item", category: "Workspace", title: "Pin selected item", description: "Keep the current item visible.", shortcut: "P", keywords: ["pin", "keep", "visible", "top"] },
  { id: "duplicate-item", category: "Workspace", title: "Duplicate item", description: "Clone the current card or block.", shortcut: "D", keywords: ["duplicate", "clone", "copy"] },
];

function groupCommands(items: Command[]) {
  return items.reduce<Record<string, Command[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

function SearchField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Search commands</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, description, or keyword"
        style={{
          borderRadius: 16,
          border: "1px solid #cbd5e1",
          padding: "12px 14px",
          fontSize: 15,
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}

function CommandRow({
  command,
  active,
  onPick,
}: {
  command: Command;
  active: boolean;
  onPick: (command: Command) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(command)}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        padding: 14,
        borderRadius: 18,
        border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
        background: active ? "#eff6ff" : "#fff",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ color: "#0f172a", fontSize: 15 }}>{command.title}</strong>
        <span style={{ color: "#475569", fontSize: 13, lineHeight: "20px" }}>{command.description}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase" }}>{command.category}</span>
        <kbd style={{ border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", padding: "4px 8px", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
          {command.shortcut}
        </kbd>
      </div>
    </button>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div style={{ padding: 24, borderRadius: 18, background: "#f8fafc", border: "1px dashed #cbd5e1", color: "#475569", display: "grid", gap: 8 }}>
      <strong style={{ color: "#0f172a" }}>No commands matched</strong>
      <span>Try a shorter search term or a different keyword.</span>
      <span>Current query: {query || "empty"}</span>
    </div>
  );
}

export default function SearchableCommandList() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(COMMANDS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((command) =>
      [command.title, command.description, command.category, ...command.keywords].some((token) =>
        token.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const grouped = useMemo(() => groupCommands(filtered), [filtered]);
  const categories = Object.keys(grouped);
  const activeCommand = COMMANDS.find((command) => command.id === activeId) ?? COMMANDS[0];

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1020, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Searchable Command List</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A keyboard-first action surface with live filtering, category grouping, and clear selection feedback.
          </p>
        </header>

        <SearchField value={query} onChange={setQuery} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1.5fr) minmax(260px, 0.9fr)", gap: 16 }}>
          <div style={{ display: "grid", gap: 14 }}>
            {categories.length ? (
              categories.map((category) => (
                <section key={category} style={{ display: "grid", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{category}</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {grouped[category].map((command) => (
                      <CommandRow
                        key={command.id}
                        command={command}
                        active={command.id === activeId}
                        onPick={(picked) => setActiveId(picked.id)}
                      />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <EmptyState query={query} />
            )}
          </div>

          <aside style={{ borderRadius: 22, background: "#f8fafc", border: "1px solid #e2e8f0", padding: 18, display: "grid", gap: 12, alignContent: "start" }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Selected command</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <strong style={{ color: "#0f172a", fontSize: 16 }}>{activeCommand.title}</strong>
              <span style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{activeCommand.description}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>{activeCommand.category}</span>
                <kbd style={{ border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", padding: "4px 8px", fontSize: 12, fontWeight: 700 }}>{activeCommand.shortcut}</kbd>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
              <h4 style={{ margin: 0, fontSize: 15, color: "#0f172a" }}>Why this pattern works</h4>
              <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
                <div>Live filtering keeps the command list fast to scan.</div>
                <div>Category grouping makes larger action sets easier to navigate.</div>
                <div>The selected command preview helps confirm what will happen.</div>
                <div>Keyboard shortcuts stay visible for power users.</div>
                <div>The component can sit inside a modal or a page panel.</div>
                <div>It is suitable for workspace actions, admin tools, or productivity apps.</div>
                <div>The data model separates search tokens from display strings.</div>
                <div>Rows stay compact enough to support long lists.</div>
                <div>The empty state is explicit and user friendly.</div>
                <div>Spacing and borders keep the layout readable.</div>
                <div>Action labels can be localized without changing the structure.</div>
                <div>The component remains easy to test because selection is predictable.</div>
                <div>The same list can be reused for global or local command discovery.</div>
                <div>All state is local and straightforward.</div>
                <div>The result feels like a practical keyboard palette, not a demo shell.</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
