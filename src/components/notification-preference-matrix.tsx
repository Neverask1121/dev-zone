import React, { useMemo, useState } from "react";

type Channel = "email" | "push" | "sms" | "product";

type Preference = {
  id: string;
  channel: Channel;
  label: string;
  description: string;
  enabled: boolean;
};

const INITIAL: Preference[] = [
  { id: "email-digest", channel: "email", label: "Weekly digest", description: "A summary of important activity.", enabled: true },
  { id: "email-alerts", channel: "email", label: "Security alerts", description: "Sensitive account notifications.", enabled: true },
  { id: "push-mentions", channel: "push", label: "Mentions", description: "A teammate tagged you in a thread.", enabled: true },
  { id: "push-reminders", channel: "push", label: "Reminders", description: "Scheduled reminders and follow-ups.", enabled: false },
  { id: "sms-2fa", channel: "sms", label: "Two-factor auth", description: "Login verification and device prompts.", enabled: true },
  { id: "sms-billing", channel: "sms", label: "Billing notices", description: "Payment-related alerts by text.", enabled: false },
  { id: "product-news", channel: "product", label: "Product updates", description: "New releases and feature announcements.", enabled: true },
  { id: "product-surveys", channel: "product", label: "Survey prompts", description: "Occasional feedback requests.", enabled: false },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 58,
        height: 34,
        borderRadius: 999,
        border: "1px solid " + (checked ? "#2563eb" : "#cbd5e1"),
        background: checked ? "#dbeafe" : "#e2e8f0",
        display: "flex",
        alignItems: "center",
        padding: 4,
        justifyContent: checked ? "flex-end" : "flex-start",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(15,23,42,0.12)",
        }}
      />
    </button>
  );
}

function ChannelCard({
  title,
  items,
  onToggle,
}: {
  title: string;
  items: Preference[];
  onToggle: (id: string) => void;
}) {
  return (
    <section style={{ display: "grid", gap: 12, border: "1px solid #e2e8f0", borderRadius: 20, padding: 16, background: "#fff" }}>
      <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: 14,
              padding: 12,
              borderRadius: 16,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: "#0f172a", fontSize: 14 }}>{item.label}</strong>
              <span style={{ color: "#475569", fontSize: 13, lineHeight: "21px" }}>{item.description}</span>
            </div>
            <Toggle checked={item.enabled} onChange={() => onToggle(item.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function NotificationPreferenceMatrix() {
  const [items, setItems] = useState(INITIAL);

  const grouped = useMemo(() => {
    const channels: Channel[] = ["email", "push", "sms", "product"];
    return channels.map((channel) => ({
      channel,
      items: items.filter((item) => item.channel === channel),
    }));
  }, [items]);

  const enabledCount = items.filter((item) => item.enabled).length;

  const toggle = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Notification Preference Matrix</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            Group notification controls by channel with a clear overview of what is enabled and what is not.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {grouped.map((channel) => (
            <ChannelCard
              key={channel.channel}
              title={channel.channel.toUpperCase()}
              items={channel.items}
              onToggle={toggle}
            />
          ))}
        </div>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
          <span style={{ color: "#64748b", fontSize: 14 }}>Enabled preferences</span>
          <strong style={{ color: "#0f172a" }}>{enabledCount} of {items.length}</strong>
        </footer>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The matrix groups controls by communication channel, which makes settings easier to understand.</div>
          <div>Each switch is controlled from a single state array, so saving the form is straightforward.</div>
          <div>The cards remain compact enough for account settings while still showing descriptions.</div>
          <div>Enablement counts give immediate feedback on how many notifications are active.</div>
          <div>The layout scales by adding another channel card.</div>
          <div>Switches are accessible and use standard button semantics.</div>
          <div>The design works for account preferences, admin controls, or user onboarding.</div>
          <div>Because the structure is grouped, it is easy to compare one channel to another.</div>
          <div>The cards are visually consistent, which helps scanning in dense settings pages.</div>
          <div>Channel labels can be localized without affecting the state model.</div>
          <div>Descriptions clarify the consequences of each toggle.</div>
          <div>The matrix can be connected to a save button or autosave flow later.</div>
          <div>State is kept local, making the component easy to reuse in different products.</div>
          <div>The component avoids nested complexity by flattening updates into a map call.</div>
          <div>Users can quickly see and adjust exactly which notifications they receive.</div>
        </section>

        <button type="button" style={{ width: "fit-content", borderRadius: 14, border: "none", padding: "11px 14px", fontWeight: 800, color: "#fff", background: "#2563eb" }}>
          Save preferences
        </button>
      </section>
    </main>
  );
}
