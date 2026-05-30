import React, { useMemo, useState } from "react";

type Rule = {
  label: string;
  satisfied: boolean;
};

function analyzePassword(value: string) {
  const rules: Rule[] = [
    { label: "At least 8 characters", satisfied: value.length >= 8 },
    { label: "Contains uppercase", satisfied: /[A-Z]/.test(value) },
    { label: "Contains lowercase", satisfied: /[a-z]/.test(value) },
    { label: "Contains number", satisfied: /[0-9]/.test(value) },
    { label: "Contains symbol", satisfied: /[^A-Za-z0-9]/.test(value) },
  ];
  const score = rules.filter((rule) => rule.satisfied).length;
  return { rules, score };
}

function strengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score <= 3) return "Moderate";
  return "Strong";
}

function Meter({ score }: { score: number }) {
  const width = `${Math.max(12, score * 20)}%`;
  const tone = score <= 1 ? "#ef4444" : score <= 3 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "#334155" }}>
        <span>Password strength</span>
        <strong>{strengthLabel(score)}</strong>
      </div>
      <div style={{ height: 12, borderRadius: 999, overflow: "hidden", background: "#e2e8f0" }}>
        <div style={{ width, height: "100%", background: tone }} />
      </div>
    </div>
  );
}

function RuleRow({ rule }: { rule: Rule }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "#334155", fontSize: 14 }}>{rule.label}</span>
      <strong style={{ color: rule.satisfied ? "#16a34a" : "#94a3b8", fontSize: 13 }}>{rule.satisfied ? "Pass" : "Pending"}</strong>
    </div>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: 13, lineHeight: "21px" }}>
      {text}
    </div>
  );
}

export default function SecurePasswordField() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const canContinue = analysis.score >= 4;

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Secure Password Field Module</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A secure password input with visibility control, live validation, and a readable strength meter.
          </p>
        </header>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>Password</span>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              style={{
                flex: 1,
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                padding: "12px 14px",
                fontSize: 15,
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              style={{ borderRadius: 16, border: "1px solid #cbd5e1", background: "#fff", padding: "12px 14px", cursor: "pointer", fontWeight: 800 }}
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <Meter score={analysis.score} />

        <section style={{ display: "grid", gap: 10, border: "1px solid #e2e8f0", borderRadius: 20, padding: 16, background: "#f8fafc" }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Validation rules</h3>
          {analysis.rules.map((rule) => <RuleRow key={rule.label} rule={rule} />)}
        </section>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Hint text="The field is controlled, so form state can be lifted into a parent registration flow." />
          <Hint text="Visibility toggling preserves usability without forcing the user to retype the value." />
          <Hint text="The checklist explains exactly which requirements are still missing." />
          <Hint text="Strength analysis updates immediately as the user types more characters." />
        </div>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The rule list is easy to extend with organization-specific password policies.</div>
          <div>The strength bar gives a fast visual indication without adding noise.</div>
          <div>The button and field sit on the same row for quick interaction.</div>
          <div>The component works cleanly in signup, reset, and account settings forms.</div>
          <div>The layout keeps guidance visible instead of hiding it behind errors only.</div>
          <div>Because the logic is local, the component remains straightforward to reuse.</div>
          <div>ARIA-friendly native inputs keep the control accessible.</div>
          <div>The simple scoring model can be upgraded to entropy-based checks later.</div>
          <div>Color contrast remains readable even in compact layouts.</div>
          <div>The same panel can be embedded inside a card, drawer, or page section.</div>
          <div>Clear labels reduce confusion for first-time users.</div>
          <div>The design avoids over-decoration and stays focused on safety.</div>
          <div>Validation state is deterministic and easy to test.</div>
          <div>Helper text can be swapped for localization without changing the structure.</div>
          <div>The confirmation button only enables when the password quality is good enough.</div>
          <div>The UI keeps the experience calm while still being informative.</div>
        </section>

        <button
          type="button"
          disabled={!canContinue}
          style={{
            width: "fit-content",
            borderRadius: 14,
            border: "none",
            padding: "11px 14px",
            fontWeight: 800,
            color: "#fff",
            background: canContinue ? "#2563eb" : "#93c5fd",
          }}
        >
          {canContinue ? "Continue" : "Improve password"}
        </button>
      </section>
    </main>
  );
}
