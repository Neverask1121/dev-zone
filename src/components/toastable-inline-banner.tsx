import React, { useEffect, useMemo, useState } from "react";

type BannerTone = "info" | "success" | "warning" | "danger";

type BannerAction = {
  label: string;
  onClick: () => void;
};

type BannerProps = {
  tone?: BannerTone;
  title: string;
  message: string;
  action?: BannerAction;
  dismissible?: boolean;
  visible: boolean;
  onDismiss: () => void;
};

const toneStyles: Record<BannerTone, { background: string; border: string; title: string; message: string }> = {
  info: { background: "#eff6ff", border: "#bfdbfe", title: "#1d4ed8", message: "#334155" },
  success: { background: "#ecfdf5", border: "#bbf7d0", title: "#166534", message: "#334155" },
  warning: { background: "#fffbeb", border: "#fde68a", title: "#b45309", message: "#334155" },
  danger: { background: "#fef2f2", border: "#fecaca", title: "#b91c1c", message: "#334155" },
};

function BannerBadge({ tone }: { tone: BannerTone }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.65)",
        color: "#0f172a",
        fontSize: 12,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {tone}
    </span>
  );
}

function InlineAction({ action }: { action: BannerAction }) {
  return (
    <button
      type="button"
      onClick={action.onClick}
      style={{
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.12)",
        background: "#fff",
        padding: "9px 12px",
        fontWeight: 800,
        fontSize: 13,
        color: "#0f172a",
        cursor: "pointer",
      }}
    >
      {action.label}
    </button>
  );
}

export function ToastableInlineBanner({
  tone = "info",
  title,
  message,
  action,
  dismissible = true,
  visible,
  onDismiss,
}: BannerProps) {
  const styles = toneStyles[tone];

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        borderRadius: 20,
        border: `1px solid ${styles.border}`,
        background: styles.background,
      }}
    >
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: styles.title }}>{title}</h3>
            <BannerBadge tone={tone} />
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: "22px", color: styles.message }}>{message}</p>
        </div>
        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss banner"
            style={{
              border: "none",
              background: "transparent",
              color: "#334155",
              fontSize: 18,
              fontWeight: 900,
              cursor: "pointer",
              lineHeight: "18px",
              padding: 0,
            }}
          >
            ×
          </button>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {action ? <InlineAction action={action} /> : null}
        <span style={{ fontSize: 13, color: "#475569" }}>The banner stays compact so it can fit inside tight layouts.</span>
      </div>
    </div>
  );
}

function DemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        borderRadius: 22,
        border: "1px solid #e2e8f0",
        background: "#fff",
        padding: 18,
        display: "grid",
        gap: 12,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
      {children}
    </section>
  );
}

export default function ToastableInlineBannerShowcase() {
  const [visible, setVisible] = useState(true);
  const [tone, setTone] = useState<BannerTone>("info");

  const action = useMemo(
    () => ({
      label: "Undo",
      onClick: () => setVisible(false),
    }),
    []
  );

  useEffect(() => {
    setVisible(true);
  }, [tone]);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: 18 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Toastable Inline Banner</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: "#475569" }}>
            A compact banner for status messages, quick recovery actions, and lightweight announcements.
          </p>
        </header>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(["info", "success", "warning", "danger"] as BannerTone[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTone(item)}
              style={{
                borderRadius: 999,
                border: tone === item ? "1px solid #2563eb" : "1px solid #cbd5e1",
                background: tone === item ? "#dbeafe" : "#fff",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <ToastableInlineBanner
          tone={tone}
          title="Changes saved"
          message="Your latest updates were stored successfully and are ready to view across the workspace."
          action={action}
          visible={visible}
          onDismiss={() => setVisible(false)}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <DemoBlock title="Usage details">
            <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              <div>The banner is controlled so parent pages decide when it appears.</div>
              <div>The tone changes the background and text pairing while keeping the layout stable.</div>
              <div>An optional action lets the user recover from a change or continue a flow.</div>
              <div>Dismissal works without forcing a navigation or hard refresh.</div>
              <div>The compact footprint makes the component fit well in cards and dialogs.</div>
              <div>ARIA live status helps screen readers announce the message.</div>
              <div>The design is suitable for success confirmations and soft warnings.</div>
              <div>Spacing remains balanced even when the text gets longer.</div>
            </div>
          </DemoBlock>

          <DemoBlock title="Why this architecture works">
            <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              <div>The tone style map keeps visual rules in one place.</div>
              <div>The action block is isolated so other buttons can be slotted in later.</div>
              <div>The example chooser demonstrates how different message states can reuse the same shell.</div>
              <div>The component can sit above a form, dashboard, or content area.</div>
              <div>Because the markup is simple, state changes remain predictable.</div>
              <div>The title and message hierarchy is clear at a glance.</div>
              <div>Inline banners work well when there is not enough room for a full toast stack.</div>
              <div>The preview section shows practical placement instead of a static mock.</div>
            </div>
          </DemoBlock>
        </div>

        <section style={{ borderRadius: 22, border: "1px solid #e2e8f0", background: "#fff", padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Additional notes</h3>
          <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
            <div>The banner remains visible only while the visible flag is set.</div>
            <div>Alert tone can be switched without remounting the page.</div>
            <div>Dismiss and action are independent, which keeps the component flexible.</div>
            <div>The inline style is intentional so the component is easy to embed anywhere.</div>
            <div>Text content can be replaced with server messages or workflow confirmations.</div>
            <div>It is a practical surface for ephemeral yet important feedback.</div>
            <div>The demo uses real controls instead of filler placeholders.</div>
            <div>Spacing and border treatment keep it compact and legible.</div>
            <div>Multiple use cases can share the same interface contract.</div>
            <div>Visual tone stays consistent across browsers and screen sizes.</div>
          </div>
        </section>
      </section>
    </main>
  );
}
