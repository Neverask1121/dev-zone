import React, { useState } from "react";

type AccordionItem = {
  id: string;
  title: string;
  body: string;
};

const items: AccordionItem[] = [
  {
    id: "one",
    title: "Getting started",
    body: "Accordion panels can progressively disclose content so users only see what they need right away. This helps dense pages stay readable on smaller screens.",
  },
  {
    id: "two",
    title: "Accessibility",
    body: "Buttons control each section, with clear labels and predictable open and close behavior. This pattern supports keyboard usage and keeps the interaction simple.",
  },
  {
    id: "three",
    title: "Animation",
    body: "The panel height animates by adjusting its maximum expansion value, allowing a smooth transition without introducing layout instability into the page.",
  },
  {
    id: "four",
    title: "Reusable content",
    body: "The same accordion structure can power FAQs, documentation, onboarding prompts, or support centers without changing the core interaction model.",
  },
  {
    id: "five",
    title: "Responsive fit",
    body: "The container grows naturally while preserving spacing and typography balance, which makes it practical for dashboards and marketing pages alike.",
  },
];

export default function AccordionContentSystem() {
  const [openId, setOpenId] = useState<string | null>("one");
  const [singleOpen, setSingleOpen] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);

  function toggle(id: string) {
    setOpenId((current) => {
      if (singleOpen) return current === id ? null : id;
      return id;
    });
  }

  return (
    <div style={pageStyle}>
      <div style={wrapStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Issue 80</div>
            <h2 style={titleStyle}>Fully Responsive Accordion Content System</h2>
            <p style={subtitleStyle}>Smooth expand-collapse behavior with clean structure, keyboard-friendly triggers, and long-form content support.</p>
          </div>
          <div style={settingsStyle}>
            <label style={settingPillStyle}>
              <input type="checkbox" checked={singleOpen} onChange={(e) => setSingleOpen(e.target.checked)} />
              Single open panel
            </label>
            <label style={settingPillStyle}>
              <input type="checkbox" checked={showNumbers} onChange={(e) => setShowNumbers(e.target.checked)} />
              Show numbers
            </label>
          </div>
        </div>

        <div style={accordionStyle}>
          {items.map((item, index) => {
            const open = openId === item.id;
            return (
              <section key={item.id} style={itemStyle}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  style={triggerStyle}
                  aria-expanded={open}
                  aria-controls={`panel-${item.id}`}
                >
                  <div style={triggerLeftStyle}>
                    {showNumbers && <span style={numberBubbleStyle}>{index + 1}</span>}
                    <div style={titleGroupStyle}>
                      <span style={itemTitleStyle}>{item.title}</span>
                      <span style={itemHintStyle}>{open ? "Collapse" : "Expand"}</span>
                    </div>
                  </div>
                  <span style={{ ...chevronStyle, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
                </button>

                <div
                  id={`panel-${item.id}`}
                  style={{
                    ...panelStyle,
                    maxHeight: open ? 260 : 0,
                    opacity: open ? 1 : 0,
                    paddingTop: open ? 14 : 0,
                    paddingBottom: open ? 14 : 0,
                  }}
                >
                  <p style={bodyStyle}>{item.body}</p>
                  <div style={detailGridStyle}>
                    <div style={detailCardStyle}>
                      <div style={detailLabelStyle}>Purpose</div>
                      <div style={detailValueStyle}>Progressive reveal</div>
                    </div>
                    <div style={detailCardStyle}>
                      <div style={detailLabelStyle}>Behavior</div>
                      <div style={detailValueStyle}>Smooth transition</div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
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

const wrapStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  background: "white",
  borderRadius: 24,
  boxShadow: "0 22px 60px rgba(15, 23, 42, 0.08)",
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 22,
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
  maxWidth: 720,
};

const settingsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const settingPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #e2e8f0",
  padding: "10px 14px",
  borderRadius: 999,
  background: "#f8fafc",
};

const accordionStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
};

const itemStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  overflow: "hidden",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
};

const triggerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  background: "transparent",
  border: "none",
  padding: 18,
  cursor: "pointer",
  textAlign: "left",
};

const triggerLeftStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  minWidth: 0,
};

const numberBubbleStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#e0e7ff",
  color: "#4338ca",
  fontWeight: 800,
  flexShrink: 0,
};

const titleGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const itemTitleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 800,
};

const itemHintStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const chevronStyle: React.CSSProperties = {
  transition: "transform 180ms ease",
  fontSize: 20,
  color: "#64748b",
};

const panelStyle: React.CSSProperties = {
  overflow: "hidden",
  transition: "max-height 220ms ease, opacity 220ms ease, padding 220ms ease",
  paddingLeft: 18,
  paddingRight: 18,
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.75,
  maxWidth: 780,
};

const detailGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 16,
  marginBottom: 4,
};

const detailCardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  background: "white",
  padding: 14,
};

const detailLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
};

const detailValueStyle: React.CSSProperties = {
  marginTop: 8,
  fontWeight: 700,
};
