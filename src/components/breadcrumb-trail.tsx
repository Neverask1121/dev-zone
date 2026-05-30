import React, { useMemo, useState } from "react";

type Crumb = {
  id: string;
  label: string;
  href?: string;
};

const base: Crumb[] = [
  { id: "home", label: "Home", href: "#" },
  { id: "workspace", label: "Workspace", href: "#" },
  { id: "projects", label: "Projects", href: "#" },
  { id: "design-system", label: "Design System", href: "#" },
  { id: "components", label: "Components", href: "#" },
  { id: "breadcrumbs", label: "Breadcrumb Trail", href: "#" },
];

function shorten(label: string, max: number) {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}

export default function BreadcrumbTrail() {
  const [compact, setCompact] = useState(false);
  const [truncate, setTruncate] = useState(true);
  const [limit, setLimit] = useState(4);

  const visible = useMemo(() => {
    if (!compact) return base;
    if (base.length <= limit) return base;
    const head = base.slice(0, 1);
    const tail = base.slice(base.length - (limit - 2));
    return [...head, { id: "ellipsis", label: "…", href: undefined }, ...tail];
  }, [compact, limit]);

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Issue 81</div>
            <h2 style={titleStyle}>Compact Breadcrumb Trail Component</h2>
            <p style={subtitleStyle}>Deep routing awareness with overflow handling and a clean, compact navigation path.</p>
          </div>
          <div style={controlsStyle}>
            <label style={controlStyle}>
              <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
              Compact mode
            </label>
            <label style={controlStyle}>
              <input type="checkbox" checked={truncate} onChange={(e) => setTruncate(e.target.checked)} />
              Truncate labels
            </label>
            <label style={controlStyle}>
              <span>Window</span>
              <input type="range" min={3} max={6} value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
            </label>
          </div>
        </div>

        <nav aria-label="Breadcrumb" style={navStyle}>
          <ol style={listStyle}>
            {visible.map((crumb, index) => {
              const isLast = index === visible.length - 1;
              const label = truncate ? shorten(crumb.label, compact ? 12 : 18) : crumb.label;
              return (
                <li key={crumb.id} style={itemWrapStyle}>
                  {crumb.href && !isLast ? (
                    <a href={crumb.href} style={linkStyle}>
                      {label}
                    </a>
                  ) : (
                    <span style={isLast ? currentStyle : staticStyle}>{label}</span>
                  )}
                  {!isLast && <span style={separatorStyle}>/</span>}
                </li>
              );
            })}
          </ol>
        </nav>

        <section style={contentStyle}>
          <div style={sectionTitleStyle}>Route intelligence</div>
          <div style={cardsStyle}>
            <div style={cardStyle}>
              <div style={cardLabelStyle}>Depth</div>
              <div style={cardValueStyle}>{base.length} levels</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabelStyle}>Mode</div>
              <div style={cardValueStyle}>{compact ? "Compact" : "Expanded"}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardLabelStyle}>Overflow</div>
              <div style={cardValueStyle}>{compact && base.length > limit ? "Collapsed" : "Visible"}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 45%, #eef2ff 100%)",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#0f172a",
};

const panelStyle: React.CSSProperties = {
  maxWidth: 1040,
  margin: "0 auto",
  background: "white",
  borderRadius: 24,
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  flexWrap: "wrap",
  marginBottom: 22,
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: "#ea580c",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  color: "#475569",
  maxWidth: 740,
};

const controlsStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  minWidth: 240,
};

const controlStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "10px 12px",
  background: "#f8fafc",
};

const navStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 4,
};

const itemWrapStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const linkStyle: React.CSSProperties = {
  color: "#1d4ed8",
  textDecoration: "none",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
};

const currentStyle: React.CSSProperties = {
  color: "#0f172a",
  background: "#e0e7ff",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 700,
};

const staticStyle: React.CSSProperties = {
  color: "#334155",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 14,
};

const separatorStyle: React.CSSProperties = {
  color: "#94a3b8",
  margin: "0 2px",
};

const contentStyle: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gap: 14,
};

const sectionTitleStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 16,
};

const cardsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "#f8fafc",
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const cardValueStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 16,
  fontWeight: 700,
};
