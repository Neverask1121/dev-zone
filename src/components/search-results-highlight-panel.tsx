import React, { useMemo, useState } from "react";

type Result = {
  id: string;
  type: string;
  title: string;
  snippet: string;
  meta: string;
};

const RESULTS: Result[] = [
  { id: "r1", type: "Docs", title: "How search indexing works", snippet: "Search terms are expanded and ranked using a weighted scoring model.", meta: "Updated 2 days ago" },
  { id: "r2", type: "API", title: "Global search endpoint", snippet: "The endpoint returns grouped matches and ranking metadata.", meta: "Reference" },
  { id: "r3", type: "Guide", title: "Building filters for tables", snippet: "Highlight matched values to help users scan long results quickly.", meta: "Tutorial" },
  { id: "r4", type: "Docs", title: "Result highlighting patterns", snippet: "Matched phrases are wrapped without breaking layout flow.", meta: "Design note" },
  { id: "r5", type: "API", title: "Search suggestions", snippet: "Suggestion data includes label, category, and match confidence.", meta: "Reference" },
  { id: "r6", type: "Guide", title: "Keyboard navigation for results", snippet: "Arrow keys move through rows while Enter opens the target item.", meta: "Tutorial" },
];

function highlightText(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const index = lower.indexOf(q.toLowerCase());
  if (index < 0) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + q.length);
  const after = text.slice(index + q.length);
  return (
    <>
      {before}
      <mark style={{ background: "#fef08a", padding: "0 2px", borderRadius: 4 }}>{match}</mark>
      {after}
    </>
  );
}

function GroupHeader({ type }: { type: string }) {
  return <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{type}</h3>;
}

function ResultRow({ result, query, active, onSelect }: { result: Result; query: string; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 18,
        border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
        background: active ? "#eff6ff" : "#fff",
        padding: 14,
        cursor: "pointer",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <strong style={{ color: "#0f172a", fontSize: 15 }}>{highlightText(result.title, query)}</strong>
        <span style={{ fontSize: 12, color: "#64748b" }}>{result.type}</span>
      </div>
      <div style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{highlightText(result.snippet, query)}</div>
      <div style={{ color: "#64748b", fontSize: 12 }}>{result.meta}</div>
    </button>
  );
}

export default function SearchResultsHighlightPanel() {
  const [query, setQuery] = useState("search");
  const [activeId, setActiveId] = useState(RESULTS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESULTS;
    return RESULTS.filter((result) =>
      [result.type, result.title, result.snippet, result.meta].some((text) => text.toLowerCase().includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Result[]>>((acc, result) => {
      acc[result.type] = acc[result.type] ?? [];
      acc[result.type].push(result);
      return acc;
    }, {});
  }, [filtered]);

  const active = RESULTS.find((result) => result.id === activeId) ?? RESULTS[0];

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Search Results Highlight Panel</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A grouped results surface with live match highlighting and keyboard-friendly row selection.
          </p>
        </header>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>Filter results</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, snippets, or metadata"
            style={{
              borderRadius: 16,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)", gap: 16, alignItems: "start" }}>
          <section style={{ display: "grid", gap: 14 }}>
            {Object.keys(grouped).length ? (
              Object.entries(grouped).map(([type, items]) => (
                <div key={type} style={{ display: "grid", gap: 10 }}>
                  <GroupHeader type={type} />
                  <div style={{ display: "grid", gap: 10 }}>
                    {items.map((result) => (
                      <ResultRow
                        key={result.id}
                        result={result}
                        query={query}
                        active={result.id === activeId}
                        onSelect={() => setActiveId(result.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, borderRadius: 18, border: "1px dashed #cbd5e1", background: "#f8fafc", color: "#475569" }}>
                No matches found for the current query.
              </div>
            )}
          </section>

          <aside style={{ borderRadius: 22, background: "#f8fafc", border: "1px solid #e2e8f0", padding: 18, display: "grid", gap: 12, alignContent: "start" }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Active result</h3>
            <strong style={{ color: "#0f172a", fontSize: 16 }}>{highlightText(active.title, query)}</strong>
            <div style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{highlightText(active.snippet, query)}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{active.meta}</div>
            <div style={{ display: "grid", gap: 8, marginTop: 6, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              <div>Grouping by result type helps users separate docs, APIs, and guides.</div>
              <div>Highlighted matches keep the scanning path clear.</div>
              <div>The active result panel gives extra context for the selected row.</div>
              <div>The component can be used in global search or local filtering flows.</div>
              <div>Keyboard navigation can be layered onto the same row structure.</div>
              <div>Result metadata provides a quick sense of freshness or origin.</div>
              <div>Highlighted text remains readable because the markup is applied inline.</div>
              <div>The panel keeps the list and detail view aligned without extra chrome.</div>
              <div>It works for support systems, knowledge bases, and search hubs.</div>
              <div>Rows are large enough to tap comfortably on touch devices.</div>
              <div>The empty state is clean and obvious when nothing matches.</div>
              <div>The search input controls the entire display in a predictable way.</div>
              <div>The same structure can support async result loading later.</div>
              <div>Typography stays balanced in both the list and the preview pane.</div>
              <div>It is a practical search results experience rather than a placeholder mock.</div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
