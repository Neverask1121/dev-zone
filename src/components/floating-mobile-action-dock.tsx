import React, { useState } from "react";

type DockAction = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

const DOCK_ACTIONS: DockAction[] = [
  { id: "home", label: "Home", icon: "⌂", description: "Jump to the main view." },
  { id: "search", label: "Search", icon: "⌕", description: "Find content quickly." },
  { id: "create", label: "Create", icon: "+", description: "Start a new item." },
  { id: "alerts", label: "Alerts", icon: "!", description: "See current notifications." },
  { id: "profile", label: "Profile", icon: "◉", description: "Open account details." },
];

function DockButton({
  action,
  active,
  onClick,
}: {
  action: DockAction;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 18,
        border: active ? "1px solid #2563eb" : "1px solid transparent",
        background: active ? "#dbeafe" : "#fff",
        padding: "10px 8px",
        cursor: "pointer",
        display: "grid",
        gap: 4,
        justifyItems: "center",
        color: "#0f172a",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 900 }}>{action.icon}</span>
      <span style={{ fontSize: 12, fontWeight: 800 }}>{action.label}</span>
    </button>
  );
}

function ContentBlock({ index }: { index: number }) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        padding: 16,
        display: "grid",
        gap: 8,
      }}
    >
      <strong style={{ color: "#0f172a" }}>Scrollable content block {index}</strong>
      <span style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>
        The dock stays visible while the user reads, scrolls, or interacts with the page.
      </span>
    </article>
  );
}

function Hint({ text }: { text: string }) {
  return <div style={{ color: "#334155", fontSize: 14, lineHeight: "22px" }}>{text}</div>;
}

export default function FloatingMobileActionDock() {
  const [activeId, setActiveId] = useState("create");

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: 24, position: "relative" }}>
      <section style={{ maxWidth: 940, margin: "0 auto", display: "grid", gap: 18, paddingBottom: 120 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Floating Mobile Action Dock</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A bottom dock for mobile-first apps with compact actions and touch-friendly spacing.
          </p>
        </header>

        <section style={{ display: "grid", gap: 12 }}>
          {Array.from({ length: 12 }, (_, index) => (
            <ContentBlock key={index} index={index + 1} />
          ))}
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <Hint>The dock remains visible even when the page becomes long.</Hint>
          <Hint>Touch targets are large enough for mobile interaction.</Hint>
          <Hint>The dock is centered and does not stretch across the whole viewport.</Hint>
          <Hint>Each icon supports a simple high-frequency navigation task.</Hint>
          <Hint>Selected state shows the current active section clearly.</Hint>
          <Hint>The component works well for compact mobile workflows.</Hint>
          <Hint>The floating surface stays above the content without blocking it entirely.</Hint>
          <Hint>The layout is easy to adapt for apps, dashboards, or mobile web tools.</Hint>
          <Hint>Users can switch actions quickly without leaving the current screen.</Hint>
          <Hint>The dock can be expanded later with labels, badges, or counts.</Hint>
          <Hint>Icon-only spacing keeps the control small and practical.</Hint>
          <Hint>It is a real bottom action system rather than a decorative footer.</Hint>
          <Hint>Clear state handling keeps the interaction predictable.</Hint>
          <Hint>The active action can map to routes or filtered views.</Hint>
          <Hint>The dock pairs well with long scrolling content and quick navigation.</Hint>
          <Hint>It can also support unread counts or other lightweight badges.</Hint>
          <Hint>The fixed placement keeps high-priority actions one tap away.</Hint>
          <Hint>Spacing protects the actions from accidental taps.</Hint>
          <Hint>The layout stays calm instead of competing with the page body.</Hint>
          <Hint>Consistency helps users learn the dock quickly.</Hint>
        </section>
      </section>

      <nav
        aria-label="Mobile action dock"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          width: "min(560px, calc(100vw - 24px))",
          borderRadius: 26,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 14px 40px rgba(15,23,42,0.16)",
          padding: 12,
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 8,
          backdropFilter: "blur(10px)",
        }}
      >
        {DOCK_ACTIONS.map((action) => (
          <DockButton
            key={action.id}
            action={action}
            active={action.id === activeId}
            onClick={() => setActiveId(action.id)}
          />
        ))}
      </nav>

      <section
        style={{
          position: "fixed",
          right: 18,
          top: 18,
          borderRadius: 18,
          background: "#fff",
          border: "1px solid #e2e8f0",
          padding: "10px 14px",
          boxShadow: "0 8px 20px rgba(15,23,42,0.10)",
          color: "#334155",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Active: {activeId}
      </section>
    </main>
  );
}
