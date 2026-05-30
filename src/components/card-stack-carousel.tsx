import React, { useMemo, useState } from "react";

type CardItem = {
  id: string;
  title: string;
  body: string;
  tag: string;
};

const cards: CardItem[] = [
  { id: "1", title: "Feature preview", body: "A focused card with motion-friendly emphasis for featured content.", tag: "Preview" },
  { id: "2", title: "Team update", body: "A short snapshot that surfaces the most important information first.", tag: "Update" },
  { id: "3", title: "Release note", body: "A compact summary that is easy to scan on touch devices.", tag: "Release" },
  { id: "4", title: "Campaign spot", body: "A highlight card for marketing or recommendation surfaces.", tag: "Spotlight" },
  { id: "5", title: "Saved item", body: "An item that stays in the stack until the user moves forward.", tag: "Saved" },
];

function StackCard({
  item,
  active,
  offset,
  onClick,
}: {
  item: CardItem;
  active: boolean;
  offset: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${offset}px) scale(${active ? 1 : 0.94})`,
        opacity: active ? 1 : 0.62,
        zIndex: active ? 3 : 1,
        transition: "transform 220ms ease, opacity 220ms ease",
        border: "1px solid #e2e8f0",
        borderRadius: 24,
        background: active ? "#ffffff" : "#f8fafc",
        padding: 20,
        textAlign: "left",
        cursor: "pointer",
        boxShadow: active ? "0 14px 36px rgba(15,23,42,0.14)" : "0 6px 16px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 14,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          padding: "6px 10px",
          borderRadius: 999,
          background: "#dbeafe",
          color: "#1d4ed8",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {item.tag}
      </span>
      <div style={{ display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: 22 }}>{item.title}</h3>
        <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>{item.body}</p>
      </div>
    </button>
  );
}

function StackDots({ total, current, jump }: { total: number; current: number; jump: (index: number) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => jump(index)}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "none",
            background: index === current ? "#2563eb" : "#cbd5e1",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}

export default function CardStackCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = useMemo(() => cards[currentIndex], [currentIndex]);
  const prev = () => setCurrentIndex((value) => (value - 1 + cards.length) % cards.length);
  const next = () => setCurrentIndex((value) => (value + 1) % cards.length);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Card Stack Carousel</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: "24px", fontSize: 15 }}>
            A focused stack pattern with one active card, smooth transitions, and compact snap-friendly presentation.
          </p>
        </header>

        <div style={{ position: "relative", minHeight: 260, padding: "8px 0" }}>
          {cards.map((item, index) => {
            const distance = index - currentIndex;
            const offset = distance * 24;
            const active = index === currentIndex;
            return (
              <StackCard
                key={item.id}
                item={item}
                active={active}
                offset={offset}
                onClick={() => setCurrentIndex(index)}
              />
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button
            type="button"
            onClick={prev}
            style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={next}
            style={{ border: "none", background: "#2563eb", color: "#fff", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}
          >
            Next
          </button>
        </div>

        <StackDots total={cards.length} current={currentIndex} jump={setCurrentIndex} />

        <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#f8fafc", padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Focused card</h3>
          <strong style={{ color: "#0f172a" }}>{current.title}</strong>
          <div style={{ color: "#475569", fontSize: 14, lineHeight: "22px" }}>{current.body}</div>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px", borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
          <div>The active card is emphasized with stronger shadow and full opacity.</div>
          <div>Inactive cards stay visible to preserve spatial context.</div>
          <div>Navigation buttons and dots give two ways to move through the set.</div>
          <div>The stack offset creates a layered presentation without needing a heavy animation library.</div>
          <div>Each card is a data item, making the carousel easy to feed from API content.</div>
          <div>The structure is compact enough for featured content, previews, or editorial blocks.</div>
          <div>Because the current card is isolated, adding swipe logic later is straightforward.</div>
          <div>Cards can hold descriptions, labels, or metadata while keeping a consistent footprint.</div>
          <div>The component avoids complex state and focuses on clear motion cues.</div>
          <div>The layout adapts to narrow widths by keeping the content centered and bounded.</div>
          <div>Pointer selection on a card can immediately bring it into focus.</div>
          <div>Tag badges help distinguish categories at a glance.</div>
          <div>The result feels natural for featured items and lightweight showcase rails.</div>
          <div>Accessibility remains friendly because the controls are plain buttons.</div>
          <div>All presentation logic lives in one file for easy reuse.</div>
          <div>The implementation balances simple motion with a polished stacked look.</div>
        </section>
      </section>
    </main>
  );
}
