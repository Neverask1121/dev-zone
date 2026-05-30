import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Placement = "top" | "bottom" | "left" | "right";

type TooltipConfig = {
  id: string;
  label: string;
  content: string;
  placement: Placement;
  delay: number;
};

const configs: TooltipConfig[] = [
  { id: "alpha", label: "Storage", content: "Shows how much storage is available for uploads and previews.", placement: "top", delay: 120 },
  { id: "beta", label: "Priority", content: "Controls ordering of alerts and important updates.", placement: "right", delay: 220 },
  { id: "gamma", label: "Visibility", content: "Defines when a helper hint appears and how long it stays visible.", placement: "bottom", delay: 180 },
  { id: "delta", label: "Routing", content: "Adapts to the available viewport space before positioning itself.", placement: "left", delay: 150 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computePlacement(anchor: DOMRect, bubble: DOMRect, placement: Placement, margin: number) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const positions = {
    top: {
      left: clamp(anchor.left + anchor.width / 2 - bubble.width / 2, margin, viewportWidth - bubble.width - margin),
      top: clamp(anchor.top - bubble.height - 12, margin, viewportHeight - bubble.height - margin),
    },
    bottom: {
      left: clamp(anchor.left + anchor.width / 2 - bubble.width / 2, margin, viewportWidth - bubble.width - margin),
      top: clamp(anchor.bottom + 12, margin, viewportHeight - bubble.height - margin),
    },
    left: {
      left: clamp(anchor.left - bubble.width - 12, margin, viewportWidth - bubble.width - margin),
      top: clamp(anchor.top + anchor.height / 2 - bubble.height / 2, margin, viewportHeight - bubble.height - margin),
    },
    right: {
      left: clamp(anchor.right + 12, margin, viewportWidth - bubble.width - margin),
      top: clamp(anchor.top + anchor.height / 2 - bubble.height / 2, margin, viewportHeight - bubble.height - margin),
    },
  };

  return positions[placement];
}

function FloatingTooltip({
  anchorRect,
  text,
  placement,
  visible,
  delay,
}: {
  anchorRect: DOMRect | null;
  text: string;
  placement: Placement;
  visible: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, transform: "translateY(4px)" });

  useLayoutEffect(() => {
    if (!visible || !anchorRect || !ref.current) return;
    const bubble = ref.current.getBoundingClientRect();
    const next = computePlacement(anchorRect, bubble, placement, 12);
    setStyle({
      position: "fixed",
      left: next.left,
      top: next.top,
      opacity: 1,
      transform: "translateY(0px)",
      transition: `opacity ${Math.max(80, delay)}ms ease, transform ${Math.max(80, delay)}ms ease`,
      zIndex: 100,
    });
  }, [visible, anchorRect, placement, delay]);

  if (!visible) return null;

  return (
    <div ref={ref} style={{ ...bubbleStyle, ...style }}>
      {text}
    </div>
  );
}

export default function TooltipSystem() {
  const [active, setActive] = useState<TooltipConfig | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);
  const [followCursor, setFollowCursor] = useState(false);
  const [dense, setDense] = useState(false);

  useEffect(() => {
    const clear = () => setActive(null);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    return () => {
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("resize", clear);
    };
  }, []);

  const widgets = useMemo(() => configs, []);

  function openTooltip(config: TooltipConfig, rect: DOMRect) {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    const timer = window.setTimeout(() => {
      setActive(config);
      setAnchorRect(rect);
    }, config.delay);
    setHoverTimer(timer);
  }

  function closeTooltip() {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    setActive(null);
  }

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Issue 78</div>
            <h2 style={titleStyle}>Contextual Tooltip System</h2>
            <p style={subtitleStyle}>Smart placement, hover delay control, and viewport-aware positioning without clipping.</p>
          </div>
          <div style={controlsStyle}>
            <label style={controlPillStyle}>
              <input type="checkbox" checked={followCursor} onChange={(e) => setFollowCursor(e.target.checked)} />
              Cursor mode
            </label>
            <label style={controlPillStyle}>
              <input type="checkbox" checked={dense} onChange={(e) => setDense(e.target.checked)} />
              Dense layout
            </label>
          </div>
        </header>

        <div style={{ ...gridStyle, gridTemplateColumns: dense ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))" }}>
          {widgets.map((item) => (
            <button
              key={item.id}
              style={cardStyle}
              onMouseEnter={(e) => openTooltip(item, e.currentTarget.getBoundingClientRect())}
              onMouseLeave={closeTooltip}
              onFocus={(e) => {
                setActive(item);
                setAnchorRect(e.currentTarget.getBoundingClientRect());
              }}
              onBlur={closeTooltip}
              onMouseMove={(e) => {
                if (!followCursor || !active || active.id !== item.id) return;
                const r = e.currentTarget.getBoundingClientRect();
                setAnchorRect(new DOMRect(e.clientX - 8, e.clientY - 8, r.width, r.height));
              }}
            >
              <span style={cardKickerStyle}>{item.placement.toUpperCase()}</span>
              <strong style={cardTitleStyle}>{item.label}</strong>
              <span style={cardTextStyle}>Hover or focus for hint</span>
            </button>
          ))}
        </div>

        <section style={sampleSectionStyle}>
          <div style={sampleTitleStyle}>Why this pattern works</div>
          <div style={sampleBodyStyle}>
            Tooltips stay lightweight, avoid viewport overflow, and open only after a small delay to reduce flicker.
          </div>
        </section>
      </div>

      <FloatingTooltip
        anchorRect={anchorRect}
        text={active ? active.content : ""}
        placement={active ? active.placement : "top"}
        visible={Boolean(active)}
        delay={active?.delay ?? 120}
      />
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #eef2ff 0%, #ffffff 55%, #f8fafc 100%)",
  padding: 24,
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#0f172a",
};

const panelStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  background: "white",
  borderRadius: 24,
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
  alignItems: "flex-start",
  marginBottom: 20,
};

const eyebrowStyle: React.CSSProperties = {
  color: "#4f46e5",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  color: "#475569",
  marginTop: 10,
  marginBottom: 0,
  maxWidth: 720,
};

const controlsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const controlPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  padding: "10px 14px",
  background: "#f8fafc",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 18,
  textAlign: "left",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  cursor: "pointer",
  minHeight: 130,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const cardKickerStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6366f1",
  fontWeight: 800,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 18,
};

const cardTextStyle: React.CSSProperties = {
  color: "#64748b",
};

const sampleSectionStyle: React.CSSProperties = {
  marginTop: 22,
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  padding: 18,
  background: "#f8fafc",
};

const sampleTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
};

const sampleBodyStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#475569",
};

const bubbleStyle: React.CSSProperties = {
  position: "fixed",
  maxWidth: 280,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#0f172a",
  color: "white",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
  fontSize: 13,
  lineHeight: 1.5,
  pointerEvents: "none",
};
