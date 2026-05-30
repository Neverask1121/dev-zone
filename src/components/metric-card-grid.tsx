import React, { useMemo, useState } from "react";

type Trend = "up" | "down" | "flat";

type Metric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  detail: string;
};

const initialMetrics: Metric[] = [
  { id: "revenue", label: "Revenue", value: "$128K", delta: "+12.4%", trend: "up", detail: "Month over month performance" },
  { id: "conversion", label: "Conversion", value: "4.9%", delta: "+0.8%", trend: "up", detail: "Landing page conversion" },
  { id: "retention", label: "Retention", value: "73%", delta: "-1.2%", trend: "down", detail: "Weekly cohort retention" },
  { id: "tickets", label: "Support tickets", value: "42", delta: "flat", trend: "flat", detail: "Open requests today" },
  { id: "uptime", label: "Uptime", value: "99.98%", delta: "+0.01%", trend: "up", detail: "Thirty day system health" },
  { id: "latency", label: "Latency", value: "84ms", delta: "-6ms", trend: "down", detail: "Median API response time" },
  { id: "engagement", label: "Engagement", value: "61%", delta: "+3.1%", trend: "up", detail: "Active users this week" },
  { id: "pipeline", label: "Pipeline", value: "18", delta: "+2", trend: "up", detail: "Sales opportunities moving" },
];

function Arrow({ trend }: { trend: Trend }) {
  const symbol = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";
  const color = trend === "down" ? "#16a34a" : trend === "up" ? "#2563eb" : "#64748b";
  return <span style={{ color, fontWeight: 900 }}>{symbol}</span>;
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        padding: 18,
        display: "grid",
        gap: 12,
        minHeight: 160,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{metric.label}</span>
          <strong style={{ fontSize: 31, lineHeight: "36px", color: "#0f172a" }}>{metric.value}</strong>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            padding: "6px 10px",
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <Arrow trend={metric.trend} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{metric.delta}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, lineHeight: "22px", color: "#475569" }}>{metric.detail}</div>
    </article>
  );
}

function LegendItem({ label, tone }: { label: string; tone: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: tone }} />
      <span style={{ color: "#334155", fontSize: 13 }}>{label}</span>
    </div>
  );
}

export default function MetricCardGrid() {
  const [items] = useState(initialMetrics);

  const summary = useMemo(
    () => ({
      positive: items.filter((item) => item.trend === "up").length,
      negative: items.filter((item) => item.trend === "down").length,
      flat: items.filter((item) => item.trend === "flat").length,
    }),
    [items]
  );

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Metric Card Grid</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: "#475569", maxWidth: 860 }}>
            A responsive metric grid with trend indicators, compact comparison states, and balanced card sizing.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              background: "#fff",
              padding: 18,
              display: "grid",
              gap: 10,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Comparison summary</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <LegendItem label={`Positive trends: ${summary.positive}`} tone="#2563eb" />
              <LegendItem label={`Negative trends: ${summary.negative}`} tone="#16a34a" />
              <LegendItem label={`Flat trends: ${summary.flat}`} tone="#64748b" />
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              background: "#fff",
              padding: 18,
              display: "grid",
              gap: 10,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Presentation notes</h3>
            <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              <div>The card height is kept consistent so the grid reads evenly.</div>
              <div>Delta badges make positive and negative movement easy to scan.</div>
              <div>Details give context without forcing the user to open another screen.</div>
              <div>The same pattern works in finance, growth, operations, or admin dashboards.</div>
              <div>Cards can be rearranged or grouped into sections without changing the base model.</div>
            </div>
          </div>
        </section>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            background: "#fff",
            padding: 18,
            display: "grid",
            gap: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Implementation behavior</h3>
          <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
            <div>Metric data remains isolated from the view layer so it is easy to swap with API results.</div>
            <div>The arrow glyphs communicate direction without needing a chart.</div>
            <div>Spacing inside each card keeps the content readable even when values are large.</div>
            <div>The summary section gives a fast overview of how many metrics are trending up or down.</div>
            <div>All layout behavior is responsive through native CSS grid.</div>
            <div>The same card can be extended with spark lines or comparison bars later.</div>
            <div>Contrast is kept high enough for clear dashboards and dense content areas.</div>
            <div>The component is suitable for admin, analytics, and health-monitoring screens.</div>
            <div>The labels remain short, while details can grow as needed.</div>
            <div>Different trend states are separated through a single type-safe model.</div>
            <div>The design leaves room for future filters or time range controls.</div>
            <div>Cards can be placed inside a dashboard shell without additional wrapper logic.</div>
            <div>The grid changes from many columns to fewer columns naturally at smaller widths.</div>
            <div>Because the component is declarative, composition stays easy to maintain.</div>
            <div>Persistent consistency makes the layout feel trustworthy and organized.</div>
          </div>
        </section>
      </section>
    </main>
  );
}
