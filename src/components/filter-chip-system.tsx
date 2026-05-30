import React, { useMemo, useState } from "react";

type ChipGroup = "category" | "status" | "tag";

type Chip = {
  id: string;
  label: string;
  group: ChipGroup;
};

const availableChips: Chip[] = [
  { id: "ui", label: "UI", group: "category" },
  { id: "infra", label: "Infra", group: "category" },
  { id: "api", label: "API", group: "category" },
  { id: "open", label: "Open", group: "status" },
  { id: "closed", label: "Closed", group: "status" },
  { id: "review", label: "In review", group: "status" },
  { id: "frontend", label: "Frontend", group: "tag" },
  { id: "backend", label: "Backend", group: "tag" },
  { id: "urgent", label: "Urgent", group: "tag" },
  { id: "design", label: "Design", group: "tag" },
  { id: "research", label: "Research", group: "tag" },
];

function SelectableChip({
  chip,
  active,
  onToggle,
}: {
  chip: Chip;
  active: boolean;
  onToggle: (chip: Chip) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(chip)}
      style={{
        borderRadius: 999,
        padding: "8px 12px",
        border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
        background: active ? "#dbeafe" : "#fff",
        color: active ? "#1d4ed8" : "#0f172a",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {chip.label}
    </button>
  );
}

function ActiveChip({
  chip,
  onRemove,
}: {
  chip: Chip;
  onRemove: (chip: Chip) => void;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        padding: "8px 12px",
        background: "#0f172a",
        color: "#fff",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {chip.label}
      <button
        type="button"
        onClick={() => onRemove(chip)}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.16)",
          color: "#fff",
          cursor: "pointer",
          lineHeight: "20px",
        }}
      >
        ×
      </button>
    </span>
  );
}

export default function FilterChipSystem() {
  const [selected, setSelected] = useState<Chip[]>([availableChips[0], availableChips[3]]);

  const groups = useMemo(
    () => ({
      category: availableChips.filter((chip) => chip.group === "category"),
      status: availableChips.filter((chip) => chip.group === "status"),
      tag: availableChips.filter((chip) => chip.group === "tag"),
    }),
    []
  );

  const isActive = (chip: Chip) => selected.some((item) => item.id === chip.id);

  const toggle = (chip: Chip) => {
    setSelected((current) =>
      current.some((item) => item.id === chip.id)
        ? current.filter((item) => item.id !== chip.id)
        : [...current, chip]
    );
  };

  const clearAll = () => setSelected([]);

  const counts = useMemo(
    () => ({
      category: selected.filter((item) => item.group === "category").length,
      status: selected.filter((item) => item.group === "status").length,
      tag: selected.filter((item) => item.group === "tag").length,
    }),
    [selected]
  );

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Filter Chip System</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: "24px", fontSize: 15 }}>
            Multi-select chip controls with removable selections, grouped options, and a clear-all action for search and browsing interfaces.
          </p>
        </header>

        <section style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Current selections</h3>
            <button type="button" onClick={clearAll} style={{ borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", padding: "8px 12px", cursor: "pointer", fontWeight: 800 }}>
              Clear all
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {selected.length ? selected.map((chip) => <ActiveChip key={chip.id} chip={chip} onRemove={toggle} />) : <span style={{ color: "#64748b" }}>No filters selected</span>}
          </div>
        </section>

        <section style={{ display: "grid", gap: 14 }}>
          {Object.entries(groups).map(([groupName, chips]) => (
            <div key={groupName} style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a", textTransform: "capitalize" }}>{groupName}</h3>
                <span style={{ color: "#64748b", fontSize: 13 }}>{counts[groupName as ChipGroup]} selected</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {chips.map((chip) => (
                  <SelectableChip key={chip.id} chip={chip} active={isActive(chip)} onToggle={toggle} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The active chips stay visible at the top so users always know which filters are applied.</div>
          <div>Removing a chip is one tap, which keeps the interaction fast during browsing sessions.</div>
          <div>The grouped palette scales well as more categories are added.</div>
          <div>Selected state is rendered with a dark pill, while available chips remain light.</div>
          <div>The component can be connected to query-string state or a search store later.</div>
          <div>Counts by group help the user understand where their selections are concentrated.</div>
          <div>The same chip model can serve tags, status filters, or content categories.</div>
          <div>Wrapping keeps the layout compact without sacrificing tap targets.</div>
          <div>The clear-all control gives a predictable reset path.</div>
          <div>Spacing and contrast are set for quick scanning in dense interfaces.</div>
          <div>The chip list is easy to swap for asynchronous data from a backend.</div>
          <div>The model remains small enough to reuse in analytics, search, or catalogs.</div>
          <div>Because each chip is data driven, rendering remains consistent as the set grows.</div>
          <div>It is suitable for both desktop dashboards and touch-first interfaces.</div>
          <div>The layout remains readable even when several selections are active.</div>
          <div>State changes are localized, which makes the component easy to maintain.</div>
        </section>
      </section>
    </main>
  );
}
