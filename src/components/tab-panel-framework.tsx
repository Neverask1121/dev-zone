import React, { useEffect, useMemo, useState } from "react";

type Panel = {
  id: string;
  label: string;
  description: string;
  accent: string;
  content: React.ReactNode;
};

const initialPanels: Panel[] = [
  {
    id: "overview",
    label: "Overview",
    description: "A summary and quick state snapshot.",
    accent: "#4f46e5",
    content: <PanelContent title="Overview" body="This panel focuses on live content and a persistent active state. Switching tabs keeps the layout responsive and the content slot reusable." />,
  },
  {
    id: "activity",
    label: "Activity",
    description: "Recent updates and dynamic feed loading.",
    accent: "#0891b2",
    content: <PanelContent title="Activity" body="Dynamic content can be swapped in without changing the outer shell. This makes the framework suitable for settings, analytics, and account areas." />,
  },
  {
    id: "security",
    label: "Security",
    description: "Authentication and permissions details.",
    accent: "#dc2626",
    content: <PanelContent title="Security" body="The active tab remains visible and keyboard navigation stays predictable. You can extend the same structure to support async panel loading." />,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Plans, invoices, and usage controls.",
    accent: "#16a34a",
    content: <PanelContent title="Billing" body="Tabbed interfaces work best when state is centralized. This layout keeps the selected panel, descriptions, and decorative accents aligned." />,
  },
];

function PanelContent({ title, body }: { title: string; body: string }) {
  return (
    <div style={contentBlockStyle}>
      <h3 style={contentTitleStyle}>{title}</h3>
      <p style={contentTextStyle}>{body}</p>
      <div style={contentGridStyle}>
        <div style={infoCardStyle}>
          <div style={infoLabelStyle}>Load strategy</div>
          <div style={infoValueStyle}>Immediate</div>
        </div>
        <div style={infoCardStyle}>
          <div style={infoLabelStyle}>Focus mode</div>
          <div style={infoValueStyle}>Keyboard ready</div>
        </div>
        <div style={infoCardStyle}>
          <div style={infoLabelStyle}>State</div>
          <div style={infoValueStyle}>Persistent</div>
        </div>
      </div>
    </div>
  );
}

export default function TabPanelFramework() {
  const [activeId, setActiveId] = useState(initialPanels[0].id);
  const [lazyMode, setLazyMode] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({ [initialPanels[0].id]: true });

  const activePanel = useMemo(() => initialPanels.find((p) => p.id === activeId) ?? initialPanels[0], [activeId]);

  useEffect(() => {
    if (loaded[activeId]) return;
    const timer = window.setTimeout(() => {
      setLoaded((prev) => ({ ...prev, [activeId]: true }));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activeId, loaded]);

  return (
    <div style={pageStyle}>
      <div style={frameStyle}>
        <div style={topStyle}>
          <div>
            <div style={eyebrowStyle}>Issue 79</div>
            <h2 style={titleStyle}>Advanced Tab Panel Framework</h2>
            <p style={subtitleStyle}>Dynamic content switching with stable active-state management and extensible panel rendering.</p>
          </div>
          <div style={switchRowStyle}>
            <label style={switchStyle}>
              <input type="checkbox" checked={lazyMode} onChange={(e) => setLazyMode(e.target.checked)} />
              Lazy loading
            </label>
            <label style={switchStyle}>
              <input type="checkbox" checked={vertical} onChange={(e) => setVertical(e.target.checked)} />
              Vertical layout
            </label>
          </div>
        </div>

        <div style={vertical ? verticalLayoutStyle : horizontalLayoutStyle}>
          <nav style={tabListStyle}>
            {initialPanels.map((panel) => {
              const active = panel.id === activeId;
              return (
                <button
                  key={panel.id}
                  onClick={() => setActiveId(panel.id)}
                  style={{
                    ...tabButtonStyle,
                    borderColor: active ? panel.accent : "#e2e8f0",
                    background: active ? `${panel.accent}12` : "white",
                  }}
                >
                  <span style={{ ...dotStyle, background: panel.accent }} />
                  <span style={tabTextWrapStyle}>
                    <strong style={tabLabelStyle}>{panel.label}</strong>
                    <span style={tabDescStyle}>{panel.description}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <section style={panelShellStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <div style={{ ...panelBadgeStyle, color: activePanel.accent }}>Active panel</div>
                <h3 style={panelHeadingStyle}>{activePanel.label}</h3>
              </div>
              <div style={{ ...accentPillStyle, background: `${activePanel.accent}14`, color: activePanel.accent }}>
                {activePanel.id}
              </div>
            </div>

            <div style={bodyWrapStyle}>
              {lazyMode && !loaded[activeId] ? (
                <div style={loadingStateStyle}>
                  <div style={loadingTitleStyle}>Loading panel...</div>
                  <div style={loadingTextStyle}>The framework keeps the selection visible while content is prepared.</div>
                </div>
              ) : (
                activePanel.content
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#0f172a",
};

const frameStyle: React.CSSProperties = {
  maxWidth: 1140,
  margin: "0 auto",
  background: "white",
  borderRadius: 24,
  boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
  padding: 24,
};

const topStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  flexWrap: "wrap",
  marginBottom: 24,
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: "#4f46e5",
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
  maxWidth: 760,
};

const switchRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const switchStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "10px 14px",
  borderRadius: 999,
};

const horizontalLayoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "300px 1fr",
  gap: 18,
};

const verticalLayoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 18,
};

const tabListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  alignContent: "start",
};

const tabButtonStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  background: "white",
  textAlign: "left",
  cursor: "pointer",
};

const dotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
  marginTop: 5,
  flexShrink: 0,
};

const tabTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const tabLabelStyle: React.CSSProperties = {
  fontSize: 16,
};

const tabDescStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.4,
};

const panelShellStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  padding: 20,
};

const panelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 16,
};

const panelBadgeStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 1.1,
  marginBottom: 6,
};

const panelHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
};

const accentPillStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 12,
};

const bodyWrapStyle: React.CSSProperties = {
  minHeight: 320,
};

const contentBlockStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const contentTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
};

const contentTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.7,
  maxWidth: 760,
};

const contentGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const infoCardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const infoLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
};

const infoValueStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 15,
  fontWeight: 700,
};

const loadingStateStyle: React.CSSProperties = {
  borderRadius: 18,
  padding: 20,
  background: "#eff6ff",
  border: "1px solid #dbeafe",
};

const loadingTitleStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 16,
};

const loadingTextStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#334155",
};
