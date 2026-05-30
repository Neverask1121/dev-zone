import React, { KeyboardEvent, useEffect, useId, useMemo, useState } from "react";

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
};

function useControllableBoolean({
  value,
  defaultValue,
  onChange,
}: {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [internalValue, setInternalValue] = useState(Boolean(defaultValue));
  const controlled = typeof value === "boolean";
  const current = controlled ? Boolean(value) : internalValue;

  const set = (next: boolean) => {
    if (!controlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  return [current, set] as const;
}

function StateBadge({ active, text }: { active: boolean; text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: active ? "#166534" : "#334155",
        background: active ? "#dcfce7" : "#e2e8f0",
      }}
    >
      {text}
    </span>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  labelledBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  labelledBy: string;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange(!checked);
    }
    if (event.key === "ArrowRight") {
      onChange(true);
    }
    if (event.key === "ArrowLeft") {
      onChange(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onKeyDown={handleKeyDown}
      style={{
        width: 62,
        height: 36,
        padding: 4,
        borderRadius: 999,
        border: "1px solid " + (checked ? "#16a34a" : "#cbd5e1"),
        background: disabled ? "#f8fafc" : checked ? "#dcfce7" : "#e2e8f0",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 180ms ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.08)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: disabled ? "#94a3b8" : "#ffffff",
          boxShadow: "0 3px 8px rgba(15, 23, 42, 0.18)",
          transform: checked ? "translateX(0)" : "translateX(0)",
          transition: "transform 180ms ease, background 180ms ease",
        }}
      />
    </button>
  );
}

export function ToggleControl({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  onLabel = "On",
  offLabel = "Off",
  disabled = false,
}: ToggleProps) {
  const [value, setValue] = useControllableBoolean({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const id = useId();
  const descriptionId = useMemo(() => `${id}-description`, [id]);
  const statusText = value ? onLabel : offLabel;

  useEffect(() => {
    if (disabled && value) {
      onCheckedChange?.(false);
    }
  }, [disabled, value, onCheckedChange]);

  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: 16,
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        background: "#fff",
        maxWidth: 520,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <div id={id} style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            {label}
          </div>
          {description ? (
            <div id={descriptionId} style={{ fontSize: 14, lineHeight: "22px", color: "#475569" }}>
              {description}
            </div>
          ) : null}
        </div>
        <ToggleSwitch checked={value} onChange={setValue} disabled={disabled} labelledBy={id} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <StateBadge active={value} text={statusText} />
        <span style={{ fontSize: 13, color: "#64748b" }}>
          {disabled ? "Interaction disabled" : "Keyboard accessible"}
        </span>
      </div>

      {description ? (
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: "20px" }}>
          {descriptionId}
        </div>
      ) : null}
    </div>
  );
}

function ToggleDemoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#ffffff",
        padding: 18,
        display: "grid",
        gap: 14,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
      {children}
    </section>
  );
}

export default function ToggleSwitchShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [locked, setLocked] = useState(true);

  return (
    <main style={{ padding: 24, display: "grid", gap: 20, background: "#f8fafc", minHeight: "100%" }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Toggle Switch Control System</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: "24px", maxWidth: 760 }}>
          A controllable switch pattern with labels, state feedback, and keyboard friendly interaction.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <ToggleDemoCard title="Controlled state">
          <ToggleControl
            checked={notifications}
            onCheckedChange={setNotifications}
            label="Notifications"
            description="Receive product updates and important activity alerts."
            onLabel="Enabled"
            offLabel="Muted"
          />
        </ToggleDemoCard>

        <ToggleDemoCard title="Uncontrolled usage">
          <ToggleControl
            defaultChecked={previewMode}
            onCheckedChange={setPreviewMode}
            label="Preview mode"
            description="Toggle a local-only preference without wiring a global store."
            onLabel="Preview on"
            offLabel="Preview off"
          />
        </ToggleDemoCard>

        <ToggleDemoCard title="Disabled state">
          <div style={{ display: "grid", gap: 12 }}>
            <ToggleControl
              checked={locked}
              onCheckedChange={setLocked}
              label="Critical setting"
              description="This configuration is locked until the admin unlocks it."
              disabled
              onLabel="Locked"
              offLabel="Unlocked"
            />
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: "20px" }}>
              The disabled example keeps the switch visible while preventing interaction.
            </div>
          </div>
        </ToggleDemoCard>
      </div>

      <section style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "#fff", padding: 18, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Behavior summary</h3>
        <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The switch responds to click, keyboard, and arrow key input.</div>
          <div>Controlled and uncontrolled usage are both supported through a shared hook.</div>
          <div>State badges communicate the current mode without requiring extra text.</div>
          <div>Accessibility roles and labels make the control screen-reader friendly.</div>
          <div>The composition keeps display logic separate from interaction logic.</div>
          <div>Design tokens such as colors and spacing can be adjusted at the component boundary.</div>
          <div>Layout stays compact so the component works well in settings panels.</div>
          <div>Descriptions are optional, letting the same API suit simple and rich use cases.</div>
          <div>Disabled styles preserve clarity while preventing accidental changes.</div>
          <div>The sample layout shows how the same control can serve multiple product surfaces.</div>
        </div>
      </section>
    </main>
  );
}
