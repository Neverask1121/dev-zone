import React, { ReactNode } from "react";

type TimelineItem = {
  id: string;
  time: string;
  title: string;
  note?: string;
  kind: "milestone" | "update" | "warning" | "system";
  meta?: string;
};

type TimelineProps = {
  items: TimelineItem[];
  header?: string;
};

function kindStyle(kind: TimelineItem["kind"]) {
  switch (kind) {
    case "milestone":
      return { dot: "#2563eb", badge: "#dbeafe", text: "#1d4ed8" };
    case "update":
      return { dot: "#16a34a", badge: "#dcfce7", text: "#166534" };
    case "warning":
      return { dot: "#d97706", badge: "#fef3c7", text: "#b45309" };
    case "system":
      return { dot: "#7c3aed", badge: "#ede9fe", text: "#6d28d9" };
  }
}

function Badge({ label, kind }: { label: string; kind: TimelineItem["kind"] }) {
  const style = kindStyle(kind);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: style.badge,
        color: style.text,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

export function ActivityTimeline({ items, header = "Activity Timeline" }: TimelineProps) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        padding: 18,
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>{header}</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: "24px", fontSize: 14 }}>
          Events are grouped in chronological order with visual emphasis for notable moments.
        </p>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {items.map((item, index) => {
          const style = kindStyle(item.kind);
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "92px 24px 1fr", columnGap: 14 }}>
              <div style={{ fontSize: 13, color: "#64748b", paddingTop: 2 }}>{item.time}</div>
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: style.dot,
                    marginTop: 4,
                    boxShadow: `0 0 0 4px ${style.badge}`,
                    zIndex: 1,
                  }}
                />
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 18,
                      bottom: -18,
                      width: 2,
                      background: "#e2e8f0",
                    }}
                  />
                ) : null}
              </div>
              <article style={{ display: "grid", gap: 8, paddingBottom: isLast ? 0 : 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{item.title}</h3>
                  <Badge label={item.kind} kind={item.kind} />
                </div>
                {item.note ? (
                  <p style={{ margin: 0, color: "#334155", lineHeight: "24px", fontSize: 14 }}>{item.note}</p>
                ) : null}
                {item.meta ? <div style={{ color: "#64748b", fontSize: 13 }}>{item.meta}</div> : null}
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

type TimelineSectionProps = {
  title: string;
  children: ReactNode;
};

function TimelineSection({ title, children }: TimelineSectionProps) {
  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, background: "#fff", display: "grid", gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
      {children}
    </section>
  );
}

const demoItems: TimelineItem[] = [
  {
    id: "1",
    time: "08:20",
    title: "Workspace opened",
    note: "The user resumed a saved workspace with the previous arrangement restored.",
    kind: "system",
    meta: "Session restored successfully",
  },
  {
    id: "2",
    time: "09:05",
    title: "Primary milestone completed",
    note: "The first major deliverable was finished and marked for review.",
    kind: "milestone",
    meta: "Completed by product team",
  },
  {
    id: "3",
    time: "11:10",
    title: "New configuration saved",
    note: "A new panel arrangement and filter set were applied to the dashboard.",
    kind: "update",
    meta: "Autosaved locally",
  },
  {
    id: "4",
    time: "14:45",
    title: "Attention needed",
    note: "One integration reported an intermittent delay and should be checked.",
    kind: "warning",
    meta: "Monitoring flagged the condition",
  },
  {
    id: "5",
    time: "16:00",
    title: "Daily summary generated",
    note: "The system compiled the day's timeline into a compact activity record.",
    kind: "system",
    meta: "Ready for export",
  },
];

export default function ActivityTimelineShowcase() {
  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc", display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Activity Timeline Component</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: "24px" }}>
          A chronological display with emphasis markers for important events and metadata.
        </p>
      </header>

      <TimelineSection title="Chronological feed">
        <ActivityTimeline items={demoItems} />
      </TimelineSection>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 18, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Why this structure works</h3>
        <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>Time, connector, and content are separated into a stable three-column layout.</div>
          <div>Event kinds map to different tones without changing the item model.</div>
          <div>The line connector automatically stops on the last item.</div>
          <div>Metadata remains optional, so the component can handle both compact and rich logs.</div>
          <div>The badge reinforces the type of event while keeping the row readable.</div>
          <div>The display is well suited for audit trails, histories, or system logs.</div>
          <div>Structure stays simple enough to adapt to mobile stacks or denser desktop timelines.</div>
        </div>
      </section>
    </main>
  );
}
