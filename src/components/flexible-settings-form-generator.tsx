import React, { useMemo, useState } from "react";

type FieldType = "text" | "email" | "select" | "toggle" | "textarea";

type Field = {
  key: string;
  label: string;
  type: FieldType;
  section: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

const schema: Field[] = [
  { key: "company", label: "Company Name", type: "text", section: "Profile", required: true, placeholder: "Acme Inc." },
  { key: "website", label: "Website", type: "text", section: "Profile", placeholder: "https://example.com" },
  { key: "support", label: "Support Email", type: "email", section: "Support", required: true, placeholder: "help@example.com" },
  { key: "timezone", label: "Timezone", type: "select", section: "General", options: ["UTC", "Asia/Kolkata", "Europe/London", "America/New_York"] },
  { key: "newsletter", label: "Newsletter", type: "toggle", section: "General" },
  { key: "notes", label: "Internal Notes", type: "textarea", section: "Support", placeholder: "Write team-specific guidance..." },
];

function createInitialValues() {
  return {
    company: "",
    website: "",
    support: "",
    timezone: "Asia/Kolkata",
    newsletter: true,
    notes: "",
  };
}

function validate(values: Record<string, string | boolean>) {
  const errors: Record<string, string> = {};
  if (!String(values.company).trim()) errors.company = "Company name is required.";
  if (!String(values.support).includes("@")) errors.support = "Please enter a valid email address.";
  if (String(values.website) && !String(values.website).startsWith("http")) errors.website = "Use a full URL starting with http.";
  return errors;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function FlexibleSettingsFormGenerator() {
  const [values, setValues] = useState<Record<string, string | boolean>>(createInitialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const sections = useMemo(
    () => Array.from(new Set(schema.map((field) => field.section))),
    []
  );

  const updateValue = (key: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4 text-zinc-950 dark:bg-zinc-900 dark:text-white">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-4">
          <header className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-3xl font-semibold">Settings Form Generator</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              A schema-driven editor with grouped sections, validation, and reusable field rendering.
            </p>
          </header>

          {sections.map((section) => (
            <SectionCard key={section} title={section}>
              {schema
                .filter((field) => field.section === section)
                .map((field) => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    error={errors[field.key]}
                    onChange={updateValue}
                  />
                ))}
            </SectionCard>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <p>Company: {String(values.company || "Not set")}</p>
              <p>Email: {String(values.support || "Not set")}</p>
              <p>Timezone: {String(values.timezone)}</p>
              <p>Newsletter: {values.newsletter ? "Enabled" : "Disabled"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Validation</h2>
            <div className="mt-4 space-y-2 text-sm">
              {Object.keys(errors).length ? (
                Object.entries(errors).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-red-50 px-4 py-3 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    {value}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  No validation issues detected.
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="w-full rounded-3xl bg-zinc-950 px-5 py-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
          >
            Save Settings
          </button>

          {submitted && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-sm font-medium">Saved</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                The generator keeps section grouping and form state in a simple reusable pattern.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | boolean;
  error?: string;
  onChange: (key: string, value: string | boolean) => void;
}) {
  const base = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition";
  const invalid = error
    ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
    : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900";

  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{field.label}</span>
        {field.required && <span className="text-xs text-zinc-500">Required</span>}
      </div>

      {field.type === "text" || field.type === "email" ? (
        <input
          type={field.type}
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${base} ${invalid}`}
        />
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${base} min-h-28 ${invalid}`}
        />
      ) : null}

      {field.type === "select" ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${base} ${invalid}`}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}

      {field.type === "toggle" ? (
        <button
          type="button"
          onClick={() => onChange(field.key, !Boolean(value))}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${invalid}`}
        >
          <span>{Boolean(value) ? "Enabled" : "Disabled"}</span>
          <span className="text-xs text-zinc-500">Click to toggle</span>
        </button>
      ) : null}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </label>
  );
}
