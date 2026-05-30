import React from "react";

type Suggestion = {
  title: string;
  description: string;
};

const SUGGESTIONS: Suggestion[] = [
  { title: "Create a first item", description: "Start by adding your first entry to the board." },
  { title: "Import existing data", description: "Bring content from a CSV or another source." },
  { title: "Explore templates", description: "Choose a layout that matches the workflow." },
  { title: "Invite collaborators", description: "Ask teammates to help populate the space." },
  { title: "Review sample data", description: "Load a demo set to understand the expected shape." },
  { title: "Connect an API", description: "Fetch live data instead of using static content." },
  { title: "Set up filters", description: "Prepare the view for search and segmentation." },
  { title: "Add a welcome note", description: "Explain what the user should do next." },
  { title: "Choose a date range", description: "Make the dashboard feel immediately useful." },
  { title: "Open documentation", description: "Provide a path to learn more about the screen." },
  { title: "Import a starter kit", description: "Give users a faster entry point." },
  { title: "Try a demo project", description: "Show how the screen behaves with data." },
];

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <button
      type="button"
      style={{
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        background: "#fff",
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gap: 6,
      }}
    >
      <strong style={{ color: "#0f172a", fontSize: 14 }}>{suggestion.title}</strong>
      <span style={{ color: "#475569", fontSize: 13, lineHeight: "21px" }}>{suggestion.description}</span>
    </button>
  );
}

function EmptyIllustration() {
  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: "50%",
        background: "radial-gradient(circle at top, #dbeafe, #cbd5e1)",
        display: "grid",
        placeItems: "center",
        color: "#1d4ed8",
        fontSize: 42,
        fontWeight: 900,
        boxShadow: "inset 0 8px 24px rgba(255,255,255,0.6)",
      }}
    >
      ∅
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "start", color: "#334155", fontSize: 14, lineHeight: "22px" }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", marginTop: 7, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

export default function ResponsiveEmptyStateCanvas() {
  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1020, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Responsive Empty State Canvas</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A calm empty state that explains what is missing and points users toward a next step.
          </p>
        </header>

        <div
          style={{
            borderRadius: 28,
            border: "1px solid #e2e8f0",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            padding: 24,
            display: "grid",
            gap: 18,
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <EmptyIllustration />
          <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
            <h3 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>Nothing here yet</h3>
            <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
              This area is empty because there is no data to show right now. Create something new, import records, or choose a template to begin.
            </p>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: "22px" }}>
              The canvas stays useful by combining explanation, visual breathing room, and direct actions.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" style={{ borderRadius: 14, border: "none", background: "#2563eb", color: "#fff", padding: "11px 14px", fontWeight: 800, cursor: "pointer" }}>
              Create item
            </button>
            <button type="button" style={{ borderRadius: 14, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", padding: "11px 14px", fontWeight: 800, cursor: "pointer" }}>
              Import data
            </button>
          </div>
        </div>

        <section style={{ display: "grid", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Suggested next steps</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {SUGGESTIONS.map((suggestion) => (
              <SuggestionCard key={suggestion.title} suggestion={suggestion} />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <Bullet>The illustration area scales cleanly because the content is centered in a flexible container.</Bullet>
          <Bullet>The message explains why the state is empty instead of only stating that it is empty.</Bullet>
          <Bullet>The next-step buttons give users a path forward without clutter.</Bullet>
          <Bullet>The suggestion cards can be swapped for contextual actions when needed.</Bullet>
          <Bullet>The canvas is suitable for dashboards, lists, and blank project screens.</Bullet>
          <Bullet>Responsive sizing keeps the layout calm on both small and large screens.</Bullet>
          <Bullet>The same empty state can be reused across many sections of an app.</Bullet>
          <Bullet>Color, iconography, and spacing remain intentionally simple.</Bullet>
          <Bullet>The component is useful when a product needs a friendly no-data state.</Bullet>
          <Bullet>The supporting options help convert an empty surface into a useful starting point.</Bullet>
          <Bullet>Typography and padding keep the attention on the guidance text.</Bullet>
          <Bullet>It feels like part of the product, not a placeholder screen.</Bullet>
          <Bullet>The layout can support onboarding, lists, catalogs, and report pages.</Bullet>
          <Bullet>Actions are direct so the user never gets stuck at a blank boundary.</Bullet>
          <Bullet>Because the structure is data-driven, the suggestions can change by page context.</Bullet>
          <Bullet>The panel can be reused as a first-run experience in admin tools or consumer apps.</Bullet>
          <Bullet>Empty states become useful when they explain, reassure, and guide in one view.</Bullet>
          <Bullet>Consistent spacing makes the screen look polished even with little content.</Bullet>
          <Bullet>The empty canvas can also carry a short note about expected data timing.</Bullet>
          <Bullet>Developers can insert charts, tables, or cards later without changing the shell.</Bullet>
          <Bullet>The illustration is intentionally abstract so it works in many products.</Bullet>
          <Bullet>Action buttons stay compact to preserve a calm visual hierarchy.</Bullet>
          <Bullet>The entire composition supports a graceful first-time experience.</Bullet>
          <Bullet>When data arrives, the empty canvas can simply be replaced with content.</Bullet>
          <Bullet>The same empty-state shell can back a dashboard, a support page, or a project board.</Bullet>
          <Bullet>Subtle contrast keeps the interface friendly instead of alarming.</Bullet>
          <Bullet>The result is more helpful than a blank white box.</Bullet>
          <Bullet>The panel can carry onboarding instructions for first-time users.</Bullet>
          <Bullet>Teams can customize the primary action based on the page objective.</Bullet>
        </section>
      </section>
    </main>
  );
}
