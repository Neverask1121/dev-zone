import React, { useMemo, useState } from "react";

type ActionTone = "neutral" | "accent" | "danger";
type ActionKind = "primary" | "secondary";

type ActionItem = {
  id: string;
  label: string;
  shortcut: string;
  kind: ActionKind;
  tone: ActionTone;
  hint: string;
};

const actions: ActionItem[] = [
  { id: "create", label: "Create task", shortcut: "C", kind: "primary", tone: "accent", hint: "Start a new workflow" },
  { id: "share", label: "Share link", shortcut: "S", kind: "primary", tone: "neutral", hint: "Copy or publish access" },
  { id: "refresh", label: "Refresh view", shortcut: "R", kind: "primary", tone: "neutral", hint: "Reload current content" },
  { id: "export", label: "Export data", shortcut: "E", kind: "secondary", tone: "neutral", hint: "Download a portable copy" },
  { id: "archive", label: "Archive item", shortcut: "A", kind: "secondary", tone: "danger", hint: "Move away from active view" },
  { id: "duplicate", label: "Duplicate card", shortcut: "D", kind: "secondary", tone: "neutral", hint: "Clone the current item" },
  { id: "pin", label: "Pin to top", shortcut: "P", kind: "secondary", tone: "accent", hint: "Keep the item visible" },
  { id: "tag", label: "Apply label", shortcut: "L", kind: "secondary", tone: "neutral", hint: "Organize for future filtering" },
];

const toneStyle: Record<ActionTone, { background: string; text: string; border: string }> = {
  neutral: { background: "#e2e8f0", text: "#334155", border: "#cbd5e1" },
  accent: { background: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  danger: { background: "#fee2e2", text: "#b91c1c", border: "#fecaca" },
};

function Chip({ tone }: { tone: ActionTone }) {
  const style = toneStyle[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        background: style.background,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {tone}
    </span>
  );
}

function ShortcutKey({ value }: { value: string }) {
  return (
    <span
      style={{
        minWidth: 30,
        height: 30,
        borderRadius: 10,
        border: "1px solid #cbd5e1",
        background: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 800,
        color: "#0f172a",
        boxShadow: "0 1px 2px rgba(15,23,42,0.08)",
      }}
    >
      {value}
    </span>
  );
}

function ActionCard({ action, onPick }: { action: ActionItem; onPick: (item: ActionItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(action)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: 14,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        background: action.kind === "primary" ? "#ffffff" : "#f8fafc",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div style={{ display: "grid", gap: 5 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{action.label}</div>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: "20px" }}>{action.hint}</div>
        <Chip tone={action.tone} />
      </div>
      <ShortcutKey value={action.shortcut} />
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: "22px" }}>{subtitle}</p>
    </div>
  );
}

export default function QuickActionPanel() {
  const [picked, setPicked] = useState<ActionItem | null>(null);

  const groups = useMemo(
    () => ({
      primary: actions.filter((item) => item.kind === "primary"),
      secondary: actions.filter((item) => item.kind === "secondary"),
    }),
    []
  );

  const mostUsed = useMemo(() => {
    const base = [actions[0], actions[2], actions[4]];
    return base;
  }, []);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          borderRadius: 28,
          background: "#fff",
          border: "1px solid #e2e8f0",
          padding: 20,
          display: "grid",
          gap: 20,
        }}
      >
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Quick Action Panel</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: "#475569", maxWidth: 820 }}>
            A compact command surface for high-frequency actions. The layout keeps primary and secondary actions separated while giving each action a visible shortcut and a descriptive hint.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <section style={{ display: "grid", gap: 12 }}>
            <SectionHeader title="Primary lane" subtitle="Actions used most often should be fast to find and easy to tap." />
            {groups.primary.map((action) => (
              <ActionCard key={action.id} action={action} onPick={setPicked} />
            ))}
          </section>

          <section style={{ display: "grid", gap: 12 }}>
            <SectionHeader title="Secondary lane" subtitle="Support actions stay available without competing with core work." />
            {groups.secondary.map((action) => (
              <ActionCard key={action.id} action={action} onPick={setPicked} />
            ))}
          </section>

          <aside style={{ display: "grid", gap: 12 }}>
            <SectionHeader title="Frequently used" subtitle="A small compact stack can be reused in dashboards or productivity views." />
            {mostUsed.map((action) => (
              <div
                key={action.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  padding: 14,
                  background: "#f8fafc",
                  display: "grid",
                  gap: 6,
                }}
              >
                <strong style={{ color: "#0f172a", fontSize: 14 }}>{action.label}</strong>
                <span style={{ color: "#475569", fontSize: 13, lineHeight: "20px" }}>{action.hint}</span>
              </div>
            ))}
          </aside>
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            borderTop: "1px solid #e2e8f0",
            paddingTop: 12,
          }}
        >
          <div style={{ color: "#64748b", fontSize: 14 }}>Last action</div>
          <strong style={{ color: "#0f172a" }}>{picked ? picked.label : "None selected"}</strong>
        </footer>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>Each button is self-contained and can be wired to a handler or a global command bus.</div>
          <div>The action tone is intentionally separate from the action group.</div>
          <div>Shortcut keys are displayed but do not depend on any particular keyboard library.</div>
          <div>The panel can be embedded inside a page shell or a modal action sheet.</div>
          <div>Content spacing is consistent so the component reads well even with many actions.</div>
          <div>The structure is built to scale without collapsing the visual hierarchy.</div>
          <div>Items can be rearranged or swapped without changing the card architecture.</div>
          <div>Descriptions help the panel serve as both a launcher and a light help surface.</div>
          <div>Responsive columns reduce clutter on smaller screens.</div>
          <div>The selected state footer gives immediate feedback after interaction.</div>
          <div>Because the data model is explicit, adding permissions or disable states is straightforward.</div>
          <div>The style set is small enough to adapt to multiple product themes.</div>
          <div>The component works for admin panels, dashboards, and workflow toolbars.</div>
          <div>Spacing between lanes preserves visual breathing room.</div>
          <div>The panel surface uses a card look to separate actions from surrounding page content.</div>
          <div>Action order can be changed based on usage frequency or business priority.</div>
          <div>Keyboard support can be added on top of the data model without reshaping the UI tree.</div>
          <div>The chip labels offer a quick tone cue for the selected action category.</div>
          <div>Overall, the layout is compact, structured, and ready for extension.</div>
        </section>
      </section>
    </main>
  );
}
