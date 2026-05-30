import React, { useMemo, useState } from "react";

type Step = {
  id: string;
  label: string;
  description: string;
  extra: string;
};

const steps: Step[] = [
  { id: "account", label: "Account", description: "Create the main account identity.", extra: "Email, username, and password." },
  { id: "profile", label: "Profile", description: "Set appearance and personal details.", extra: "Avatar, display name, and role." },
  { id: "billing", label: "Billing", description: "Choose a plan and payment method.", extra: "Invoice or card details." },
  { id: "preferences", label: "Preferences", description: "Select notifications and defaults.", extra: "Tone, language, and reminders." },
  { id: "confirm", label: "Confirm", description: "Review everything before submitting.", extra: "Check each section carefully." },
];

function StepBadge({ active, done, index }: { active: boolean; done: boolean; index: number }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: active ? "2px solid #2563eb" : "2px solid transparent",
        background: done ? "#dcfce7" : active ? "#dbeafe" : "#e2e8f0",
        color: done ? "#166534" : active ? "#1d4ed8" : "#64748b",
        fontWeight: 900,
      }}
    >
      {done ? "✓" : index + 1}
    </div>
  );
}

function StepCard({
  step,
  index,
  active,
  done,
  onSelect,
}: {
  step: Step;
  index: number;
  active: boolean;
  done: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: active ? "#f8fafc" : "#fff",
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      <StepBadge active={active} done={done} index={index} />
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ color: "#0f172a", fontSize: 15 }}>
          {index + 1}. {step.label}
        </strong>
        <div style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{step.description}</div>
        <div style={{ color: "#64748b", fontSize: 13 }}>{step.extra}</div>
      </div>
    </button>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, color: "#334155" }}>
        <span>Completion</span>
        <strong>{value}%</strong>
      </div>
      <div style={{ height: 12, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: "linear-gradient(90deg, #2563eb, #0ea5e9)" }} />
      </div>
    </div>
  );
}

export default function StepIndicatorFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = steps[currentIndex];

  const progress = useMemo(() => {
    if (steps.length <= 1) return 100;
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  }, [currentIndex]);

  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < steps.length - 1;

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Step Indicator Flow</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: "24px", fontSize: 15 }}>
            A sequential stepper for onboarding, setup, and checkout experiences with clear progress awareness.
          </p>
        </header>

        <ProgressBar value={progress} />

        <div style={{ display: "grid", gap: 12 }}>
          {steps.map((step, index) => {
            const active = index === currentIndex;
            const done = index < currentIndex;
            return (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                active={active}
                done={done}
                onSelect={() => setCurrentIndex(index)}
              />
            );
          })}
        </div>

        <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, background: "#f8fafc", display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Current step details</h3>
          <div style={{ display: "grid", gap: 6 }}>
            <strong style={{ color: "#0f172a" }}>{currentStep.label}</strong>
            <div style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{currentStep.description}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{currentStep.extra}</div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button
            type="button"
            onClick={() => canGoBack && setCurrentIndex((value) => value - 1)}
            disabled={!canGoBack}
            style={{
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: canGoBack ? "#fff" : "#f1f5f9",
              color: "#0f172a",
              padding: "10px 14px",
              cursor: canGoBack ? "pointer" : "not-allowed",
              fontWeight: 800,
            }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => canGoNext && setCurrentIndex((value) => value + 1)}
            disabled={!canGoNext}
            style={{
              borderRadius: 12,
              border: "none",
              background: canGoNext ? "#2563eb" : "#93c5fd",
              color: "#fff",
              padding: "10px 14px",
              cursor: canGoNext ? "pointer" : "not-allowed",
              fontWeight: 800,
            }}
          >
            Next
          </button>
        </div>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px", borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
          <div>The active step is highlighted while completed steps show a check mark.</div>
          <div>The progress bar is derived from the current index rather than a separate state source.</div>
          <div>Each step row can be clicked directly, which is useful for non-linear review modes.</div>
          <div>The detail panel keeps the user oriented without moving them away from the flow.</div>
          <div>Back and next controls support linear movement through the sequence.</div>
          <div>Extra metadata gives room for helper hints or secondary instructions.</div>
          <div>The layout can be reused in both onboarding and transaction flows.</div>
          <div>Because the component is data-driven, additional steps can be added without changing the structure.</div>
          <div>The card presentation keeps the interface clean and readable.</div>
          <div>Spacing is comfortable for desktop while still compressing well on smaller widths.</div>
          <div>The same pattern can support vertical or horizontal variants later.</div>
          <div>Color and typography provide clear step hierarchy at a glance.</div>
          <div>The current step detail can be used to render form content or review text.</div>
          <div>The component stays simple enough for product teams to extend.</div>
          <div>Responsive wrapping keeps the UI coherent when width is limited.</div>
          <div>State transitions are limited to one current step, which simplifies logic.</div>
          <div>Accessible button semantics make step selection predictable.</div>
          <div>The design is practical for guided setup screens and long workflows.</div>
        </section>
      </section>
    </main>
  );
}
