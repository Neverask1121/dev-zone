import React, { useMemo, useState } from "react";

type Row = {
  id: number;
  name: string;
  category: string;
  owner: string;
  status: string;
  location: string;
};

const DATA: Row[] = [
  { id: 1, name: "Aurora Panel", category: "Dashboard", owner: "Mina", status: "Active", location: "Bengaluru" },
  { id: 2, name: "Command Rail", category: "Control", owner: "Arun", status: "Draft", location: "Delhi" },
  { id: 3, name: "Widget Stack", category: "Dashboard", owner: "Sara", status: "Active", location: "Pune" },
  { id: 4, name: "Insight Grid", category: "Analytics", owner: "Neha", status: "Review", location: "Mumbai" },
  { id: 5, name: "Flow Map", category: "Navigation", owner: "Ravi", status: "Active", location: "Chennai" },
  { id: 6, name: "Policy Center", category: "Settings", owner: "Isha", status: "Paused", location: "Hyderabad" },
  { id: 7, name: "Summary Deck", category: "Analytics", owner: "Aman", status: "Active", location: "Kolkata" },
  { id: 8, name: "Rule Builder", category: "Control", owner: "Tara", status: "Draft", location: "Jaipur" },
  { id: 9, name: "Pulse Board", category: "Dashboard", owner: "Kiran", status: "Review", location: "Indore" },
  { id: 10, name: "Signal Matrix", category: "Analytics", owner: "Meera", status: "Active", location: "Surat" },
  { id: 11, name: "Route Lens", category: "Navigation", owner: "Noah", status: "Paused", location: "Nagpur" },
  { id: 12, name: "Forms Lab", category: "Settings", owner: "Zoya", status: "Active", location: "Ahmedabad" },
];

const fields = ["name", "category", "owner", "status", "location"] as const;

function includesValue(source: string, query: string) {
  return source.toLowerCase().includes(query.toLowerCase());
}

function highlight(value: string, query: string) {
  if (!query) return value;
  const lower = value.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return value;
  const before = value.slice(0, idx);
  const hit = value.slice(idx, idx + query.length);
  const after = value.slice(idx + query.length);
  return (
    <>
      {before}
      <mark style={{ background: "rgba(250, 204, 21, 0.35)", padding: "0 2px", borderRadius: 4 }}>{hit}</mark>
      {after}
    </>
  );
}

export default function SearchFilterBar() {
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState<(typeof fields)[number] | "all">("all");
  const [compact, setCompact] = useState(false);
  const [onlyActive, setOnlyActive] = useState(false);

  const filtered = useMemo(() => {
    return DATA.filter((row) => {
      const haystack = [row.name, row.category, row.owner, row.status, row.location].join(" ");
      const matchesSearch = search.trim() ? includesValue(haystack, search.trim()) : true;
      const matchesField =
        activeField === "all" ? true : includesValue(String(row[activeField]), search.trim());
      const matchesState = onlyActive ? row.status === "Active" : true;
      return matchesSearch && matchesField && matchesState;
    });
  }, [search, activeField, onlyActive]);

  const total = DATA.length;
  const shown = filtered.length;

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Issue 77</div>
            <h2 style={titleStyle}>Intelligent Search Filter Bar</h2>
            <p style={subtitleStyle}>Live search across multiple fields with matched text emphasis and empty state handling.</p>
          </div>
          <div style={statsStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total</div>
              <div style={statValueStyle}>{total}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Visible</div>
              <div style={statValueStyle}>{shown}</div>
            </div>
          </div>
        </div>

        <div style={toolbarStyle}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, category, owner, status, or location"
            style={inputStyle}
          />
          <select value={activeField} onChange={(e) => setActiveField(e.target.value as any)} style={selectStyle}>
            <option value="all">All fields</option>
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
          <label style={toggleStyle}>
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Active only
          </label>
          <label style={toggleStyle}>
            <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
            Compact
          </label>
        </div>

        {filtered.length === 0 ? (
          <div style={emptyStyle}>
            <div style={emptyTitleStyle}>No matching records</div>
            <div style={emptyTextStyle}>Try a different search term or switch back to all fields.</div>
          </div>
        ) : compact ? (
          <div style={compactGridStyle}>
            {filtered.map((row) => (
              <article key={row.id} style={compactCardStyle}>
                <div style={compactTopStyle}>
                  <strong>{highlight(row.name, search.trim())}</strong>
                  <span style={pillStyle}>{row.status}</span>
                </div>
                <div style={compactMetaStyle}>{highlight(row.category, search.trim())}</div>
                <div style={compactMetaStyle}>{highlight(row.owner, search.trim())}</div>
                <div style={compactMetaStyle}>{highlight(row.location, search.trim())}</div>
              </article>
            ))}
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Owner</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{highlight(row.name, search.trim())}</td>
                  <td style={tdStyle}>{highlight(row.category, search.trim())}</td>
                  <td style={tdStyle}>{highlight(row.owner, search.trim())}</td>
                  <td style={tdStyle}>
                    <span style={pillStyle}>{row.status}</span>
                  </td>
                  <td style={tdStyle}>{highlight(row.location, search.trim())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#0f172a",
};

const shellStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  background: "white",
  borderRadius: 24,
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: "#6366f1",
  marginBottom: 8,
  fontWeight: 700,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  lineHeight: 1.1,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  color: "#475569",
  maxWidth: 700,
};

const statsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const statCardStyle: React.CSSProperties = {
  minWidth: 100,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const statValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  marginTop: 6,
};

const toolbarStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(240px, 1fr) 160px auto auto",
  gap: 12,
  marginTop: 24,
  marginBottom: 18,
};

const inputStyle: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "0 12px",
  background: "white",
};

const toggleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "0 10px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  color: "#334155",
  minHeight: 46,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  color: "#64748b",
  borderBottom: "1px solid #e2e8f0",
  padding: "14px 12px",
};

const tdStyle: React.CSSProperties = {
  padding: "15px 12px",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "top",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 10px",
  borderRadius: 999,
  background: "#e0e7ff",
  color: "#3730a3",
  fontSize: 12,
  fontWeight: 700,
};

const emptyStyle: React.CSSProperties = {
  padding: "42px 18px",
  borderRadius: 18,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  textAlign: "center",
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
};

const emptyTextStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#64748b",
};

const compactGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const compactCardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  padding: 16,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
};

const compactTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const compactMetaStyle: React.CSSProperties = {
  marginTop: 10,
  color: "#475569",
};
