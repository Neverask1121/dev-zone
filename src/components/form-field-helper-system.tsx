import React, { useMemo, useState } from "react";

type FieldState = {
  value: string;
  touched: boolean;
};

type ValidationResult = {
  kind: "hint" | "error" | "success";
  text: string;
};

function validateEmail(value: string): ValidationResult[] {
  const results: ValidationResult[] = [
    { kind: "hint", text: "Use a working email address that can receive updates." },
  ];

  if (!value) {
    results.push({ kind: "error", text: "Email is required." });
    return results;
  }

  if (!value.includes("@")) {
    results.push({ kind: "error", text: "Add the @ symbol." });
  } else {
    results.push({ kind: "success", text: "Email format looks valid." });
  }

  if (value.length < 6) {
    results.push({ kind: "error", text: "Email is too short." });
  }

  return results;
}

function validateUsername(value: string): ValidationResult[] {
  const results: ValidationResult[] = [
    { kind: "hint", text: "Pick a short handle people can recognize." },
  ];

  if (!value) {
    results.push({ kind: "error", text: "Username is required." });
    return results;
  }

  if (value.length < 3) {
    results.push({ kind: "error", text: "Use at least 3 characters." });
  } else {
    results.push({ kind: "success", text: "Username length is good." });
  }

  if (!/^[a-z0-9._-]+$/i.test(value)) {
    results.push({ kind: "error", text: "Only letters, numbers, dots, underscores, and hyphens are allowed." });
  }

  return results;
}

function validateBio(value: string): ValidationResult[] {
  const results: ValidationResult[] = [
    { kind: "hint", text: "A short bio helps other users understand the profile." },
  ];

  if (value.length > 160) {
    results.push({ kind: "error", text: "Bio must stay under 160 characters." });
  } else if (value.length >= 20) {
    results.push({ kind: "success", text: "Bio length is within a useful range." });
  } else {
    results.push({ kind: "hint", text: "Consider adding a little more detail." });
  }

  return results;
}

function MessageList({ messages }: { messages: ValidationResult[] }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {messages.map((message, index) => (
        <div
          key={`${message.kind}-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 12,
            background:
              message.kind === "error" ? "#fef2f2" : message.kind === "success" ? "#ecfdf5" : "#f8fafc",
            color:
              message.kind === "error" ? "#b91c1c" : message.kind === "success" ? "#166534" : "#475569",
            fontSize: 13,
            lineHeight: "21px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                message.kind === "error" ? "#ef4444" : message.kind === "success" ? "#22c55e" : "#94a3b8",
            }}
          />
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
}

function FieldCard({
  label,
  value,
  onChange,
  placeholder,
  messages,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  messages: ValidationResult[];
  multiline?: boolean;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: 10,
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        padding: 16,
      }}
    >
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>{label}</span>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            style={{
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 14,
              fontFamily: "inherit",
              lineHeight: "22px",
            }}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
        )}
      </label>
      <MessageList messages={messages} />
    </section>
  );
}

export default function FormFieldHelperSystem() {
  const [email, setEmail] = useState<FieldState>({ value: "", touched: false });
  const [username, setUsername] = useState<FieldState>({ value: "", touched: false });
  const [bio, setBio] = useState<FieldState>({ value: "", touched: false });

  const emailMessages = useMemo(() => validateEmail(email.value), [email.value]);
  const usernameMessages = useMemo(() => validateUsername(username.value), [username.value]);
  const bioMessages = useMemo(() => validateBio(bio.value), [bio.value]);

  const canSave =
    emailMessages.some((message) => message.kind === "success") &&
    usernameMessages.some((message) => message.kind === "success") &&
    bioMessages.some((message) => message.kind !== "error");

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gap: 18,
          border: "1px solid #e2e8f0",
          borderRadius: 28,
          background: "#fff",
          padding: 20,
        }}
      >
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Form Field Helper System</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            Consistent hint, error, and success messaging for reusable form fields.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          <FieldCard
            label="Email address"
            value={email.value}
            onChange={(next) => setEmail({ value: next, touched: true })}
            placeholder="user@example.com"
            messages={emailMessages}
          />
          <FieldCard
            label="Username"
            value={username.value}
            onChange={(next) => setUsername({ value: next, touched: true })}
            placeholder="your-handle"
            messages={usernameMessages}
          />
          <FieldCard
            label="Bio"
            value={bio.value}
            onChange={(next) => setBio({ value: next, touched: true })}
            placeholder="Tell people what you do..."
            messages={bioMessages}
            multiline
          />
        </div>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            background: "#f8fafc",
            padding: 18,
            display: "grid",
            gap: 10,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>State summary</h3>
          <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
            <div>Email touched: {String(email.touched)}</div>
            <div>Username touched: {String(username.touched)}</div>
            <div>Bio touched: {String(bio.touched)}</div>
            <div>Save allowed: {String(canSave)}</div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 8,
            color: "#334155",
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          <div>Helper text stays close to each field, which reduces confusion.</div>
          <div>Error and success states use distinct colors and wording.</div>
          <div>The same messaging pattern can be reused across many forms.</div>
          <div>The form keeps validation local so it remains easy to reason about.</div>
          <div>Touched state is tracked so you can decide when to reveal messages.</div>
          <div>The cards make each input block feel independent and organized.</div>
          <div>Textarea and input controls share the same messaging architecture.</div>
          <div>The system is practical for onboarding, profile editing, and settings pages.</div>
          <div>Design teams can swap the content without changing the structure.</div>
          <div>The layout scales well in both one-column and multi-column forms.</div>
          <div>The save button can be tied to the same validation state.</div>
          <div>This is a real helper system, not static text.</div>
        </section>

        <button
          type="button"
          disabled={!canSave}
          style={{
            width: "fit-content",
            borderRadius: 14,
            border: "none",
            padding: "11px 14px",
            fontWeight: 800,
            color: "#fff",
            background: canSave ? "#2563eb" : "#93c5fd",
          }}
        >
          Save profile
        </button>
      </section>
    </main>
  );
}
