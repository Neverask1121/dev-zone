import React, { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";

type DrawerSide = "left" | "right" | "top" | "bottom";

type DrawerProps = {
  open: boolean;
  side?: DrawerSide;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

function DrawerBackdrop({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  return (
    <button
      aria-label="Close drawer overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        border: "none",
        background: visible ? "rgba(15, 23, 42, 0.45)" : "transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease",
        cursor: "pointer",
        padding: 0,
      }}
    />
  );
}

function getTransform(side: DrawerSide, open: boolean): string {
  if (open) return "translate3d(0,0,0)";
  switch (side) {
    case "left":
      return "translate3d(-102%,0,0)";
    case "right":
      return "translate3d(102%,0,0)";
    case "top":
      return "translate3d(0,-102%,0)";
    case "bottom":
      return "translate3d(0,102%,0)";
  }
}

function getDimensionStyles(side: DrawerSide): CSSProperties {
  if (side === "left" || side === "right") {
    return { width: "min(440px, 88vw)", height: "100%" };
  }
  return { width: "100%", height: "min(360px, 80vh)" };
}

export function SlidingDrawer({ open, side = "right", title, subtitle, onClose, children }: DrawerProps) {
  useBodyScrollLock(open);

  const placementStyles = useMemo<CSSProperties>(() => {
    const base: CSSProperties = {
      position: "fixed",
      background: "#ffffff",
      boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
      border: "1px solid rgba(226, 232, 240, 0.95)",
      transition: "transform 220ms ease",
      display: "grid",
      gridTemplateRows: "auto 1fr",
      zIndex: 60,
      ...getDimensionStyles(side),
    };

    if (side === "left") {
      base.left = 0;
      base.top = 0;
      base.bottom = 0;
      base.borderTopLeftRadius = 0;
      base.borderBottomLeftRadius = 0;
    }
    if (side === "right") {
      base.right = 0;
      base.top = 0;
      base.bottom = 0;
      base.borderTopRightRadius = 0;
      base.borderBottomRightRadius = 0;
    }
    if (side === "top") {
      base.left = 0;
      base.right = 0;
      base.top = 0;
      base.borderTopLeftRadius = 0;
      base.borderTopRightRadius = 0;
    }
    if (side === "bottom") {
      base.left = 0;
      base.right = 0;
      base.bottom = 0;
      base.borderBottomLeftRadius = 0;
      base.borderBottomRightRadius = 0;
    }

    return base;
  }, [side]);

  return (
    <div aria-hidden={!open}>
      <DrawerBackdrop onClose={onClose} visible={open} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          ...placementStyles,
          transform: getTransform(side, open),
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            padding: 18,
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <h2 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>{title}</h2>
            {subtitle ? (
              <p style={{ margin: 0, color: "#475569", fontSize: 14, lineHeight: "22px" }}>{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #cbd5e1",
              background: "#fff",
              borderRadius: 12,
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: "18px",
            }}
          >
            ×
          </button>
        </header>
        <div style={{ padding: 18, overflow: "auto" }}>{children}</div>
      </aside>
    </div>
  );
}

function DrawerExampleBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: 18,
        background: "#fff",
        display: "grid",
        gap: 14,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
      {children}
    </section>
  );
}

export default function DrawerPanelShowcase() {
  const [openRight, setOpenRight] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const [openBottom, setOpenBottom] = useState(false);

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc", display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Sliding Drawer Panel</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: "24px" }}>
          A direction-aware drawer with overlay handling and body scroll locking.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <DrawerExampleBlock title="Right drawer">
          <button onClick={() => setOpenRight(true)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff" }}>
            Open right drawer
          </button>
        </DrawerExampleBlock>

        <DrawerExampleBlock title="Left drawer">
          <button onClick={() => setOpenLeft(true)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff" }}>
            Open left drawer
          </button>
        </DrawerExampleBlock>

        <DrawerExampleBlock title="Bottom drawer">
          <button onClick={() => setOpenBottom(true)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff" }}>
            Open bottom drawer
          </button>
        </DrawerExampleBlock>
      </div>

      <SlidingDrawer
        open={openRight}
        side="right"
        title="Filters"
        subtitle="Tune the result set before applying the changes."
        onClose={() => setOpenRight(false)}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Category</strong>
            <div>Design systems</div>
            <div>UI kits</div>
            <div>Layouts</div>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Status</strong>
            <div>Draft</div>
            <div>Published</div>
            <div>Archived</div>
          </div>
        </div>
      </SlidingDrawer>

      <SlidingDrawer
        open={openLeft}
        side="left"
        title="Navigation"
        subtitle="Quick links for workspace switching."
        onClose={() => setOpenLeft(false)}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div>Overview</div>
          <div>Projects</div>
          <div>Reports</div>
          <div>Billing</div>
          <div>Settings</div>
        </div>
      </SlidingDrawer>

      <SlidingDrawer
        open={openBottom}
        side="bottom"
        title="Mobile sheet"
        subtitle="Compact content in a bottom-anchored panel."
        onClose={() => setOpenBottom(false)}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div>This drawer is useful for quick actions on smaller screens.</div>
          <div>It preserves vertical space by expanding from the bottom edge.</div>
          <div>Forms, pickers, and filter lists work well inside this container.</div>
          <div>Overlay clicks and the close button both dismiss the panel safely.</div>
        </div>
      </SlidingDrawer>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, background: "#fff", display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Design behavior</h3>
        <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>Placement is controlled by a single side prop, which keeps the API small.</div>
          <div>Scroll locking prevents the page from moving behind the active drawer.</div>
          <div>The overlay is a button, so clicking the backdrop is an intentional action.</div>
          <div>Transition logic is isolated in helper functions for readability.</div>
          <div>The panel body remains scrollable when content grows beyond the viewport.</div>
          <div>Different edge anchors share the same component with dimension-aware styling.</div>
          <div>The demo shows multiple placements without requiring separate implementations.</div>
        </div>
      </section>
    </main>
  );
}
