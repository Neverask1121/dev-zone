import React, { CSSProperties, useMemo } from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

type SpinnerVariant = "primary" | "muted" | "success" | "warning";

type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  centered?: boolean;
  inline?: boolean;
  thickness?: number;
  speedMs?: number;
  className?: string;
  style?: CSSProperties;
};

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 22,
  lg: 32,
  xl: 44,
};

const variantBorderMap: Record<SpinnerVariant, string> = {
  primary: "#2563eb",
  muted: "#64748b",
  success: "#16a34a",
  warning: "#d97706",
};

function SpinnerRing({
  size,
  thickness,
  borderColor,
  speedMs,
}: {
  size: number;
  thickness: number;
  borderColor: string;
  speedMs: number;
}) {
  const style = useMemo<CSSProperties>(
    () => ({
      width: size,
      height: size,
      borderRadius: "999px",
      borderStyle: "solid",
      borderWidth: thickness,
      borderColor: "rgba(148, 163, 184, 0.18)",
      borderTopColor: borderColor,
      animation: `spin ${speedMs}ms linear infinite`,
      boxSizing: "border-box",
      flexShrink: 0,
    }),
    [size, thickness, borderColor, speedMs]
  );

  return <div aria-hidden="true" style={style} />;
}

function SpinnerLabel({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span
      style={{
        fontSize: 14,
        lineHeight: "20px",
        color: "#334155",
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function SpinnerStack({
  centered,
  inline,
  children,
}: {
  centered?: boolean;
  inline?: boolean;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    display: inline ? "inline-flex" : "flex",
    alignItems: "center",
    justifyContent: centered ? "center" : "flex-start",
    gap: 10,
    width: inline ? "auto" : "100%",
    minHeight: inline ? undefined : 44,
  };
  return <div style={style}>{children}</div>;
}

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  label,
  centered = false,
  inline = false,
  thickness = 3,
  speedMs = 900,
  className,
  style,
}: SpinnerProps) {
  const px = sizeMap[size];
  const borderColor = variantBorderMap[variant];

  const wrapperStyle: CSSProperties = {
    ...style,
    padding: inline ? 0 : 8,
    borderRadius: 16,
    background: inline ? "transparent" : "rgba(248, 250, 252, 0.9)",
    border: inline ? "none" : "1px solid rgba(226, 232, 240, 0.9)",
    boxShadow: inline ? "none" : "0 6px 18px rgba(15, 23, 42, 0.06)",
  };

  return (
    <div className={className} style={wrapperStyle}>
      <SpinnerStack centered={centered} inline={inline}>
        <SpinnerRing
          size={px}
          thickness={thickness}
          borderColor={borderColor}
          speedMs={speedMs}
        />
        <SpinnerLabel label={label} />
      </SpinnerStack>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

type SpinnerExampleCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SpinnerExampleCard({ title, description, children }: SpinnerExampleCardProps) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: 18,
        background: "#ffffff",
        display: "grid",
        gap: 14,
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: 18, lineHeight: "26px", color: "#0f172a" }}>{title}</h3>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#475569", lineHeight: "22px" }}>
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export default function SpinnerLibraryShowcase() {
  return (
    <main
      style={{
        display: "grid",
        gap: 20,
        padding: 24,
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        minHeight: "100%",
        color: "#0f172a",
      }}
    >
      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: "36px" }}>Loading Spinner Library</h2>
        <p style={{ margin: 0, color: "#475569", maxWidth: 760, lineHeight: "24px" }}>
          A compact spinner toolkit with variants, labels, inline usage, and centered presentation.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <SpinnerExampleCard
          title="Inline usage"
          description="Use inside buttons, cards, or small UI slots without shifting layout."
        >
          <LoadingSpinner size="xs" inline label="Saving" />
        </SpinnerExampleCard>

        <SpinnerExampleCard
          title="Centered page state"
          description="Center a larger loader while waiting for data or navigation."
        >
          <LoadingSpinner size="xl" centered label="Loading dashboard" />
        </SpinnerExampleCard>

        <SpinnerExampleCard
          title="Variant support"
          description="Change the tone to fit success, warning, or quiet loading states."
        >
          <div style={{ display: "grid", gap: 12 }}>
            <LoadingSpinner size="sm" variant="success" label="Syncing" />
            <LoadingSpinner size="sm" variant="warning" label="Processing" />
            <LoadingSpinner size="sm" variant="muted" label="Refreshing" />
          </div>
        </SpinnerExampleCard>
      </div>

      <section
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: 18,
          background: "#fff",
          display: "grid",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18 }}>Implementation notes</h3>
        <div style={{ display: "grid", gap: 10, color: "#334155", lineHeight: "24px", fontSize: 14 }}>
          <div>Multiple sizes support both compact controls and full-page loading states.</div>
          <div>The ring is rendered as pure CSS, keeping the component light and dependency free.</div>
          <div>Labels are optional, making the component flexible across app surfaces.</div>
          <div>The outer wrapper can be used directly or nested inside existing layouts.</div>
          <div>Style props let teams adapt the loader without changing the internal structure.</div>
          <div>Animation timing can be tuned for calmer or faster motion preferences.</div>
          <div>Inline mode avoids padding so the spinner can sit naturally inside text flows.</div>
          <div>Centered mode is useful when the loading state owns the whole viewport.</div>
          <div>The variant map keeps tone management in one place instead of spreading CSS rules.</div>
          <div>Size mapping keeps the public API simple while producing predictable visual steps.</div>
          <div>The component can be dropped into forms, cards, drawers, or page shells.</div>
          <div>Label color uses neutral text so the focus stays on the loading feedback.</div>
          <div>All layout spacing is handled in component state rather than external utilities.</div>
          <div>The showcase section demonstrates how the same primitive can serve many use cases.</div>
          <div>Because the structure is small, it is easy to embed in design systems or app codebases.</div>
          <div>The animation is defined inside the file to keep the component self-contained.</div>
          <div>Accessibility is supported through aria-hidden on the animated visual element.</div>
          <div>Optional label text offers context for screen readers through surrounding content.</div>
          <div>The wrapper can be themed by changing background, border, or shadow values.</div>
          <div>Thickness control allows subtle or bold ring styling depending on product needs.</div>
        </div>
      </section>
    </main>
  );
}
