import React, { useState } from "react";

type Detail = {
  title: string;
  text: string;
};

const DETAILS: Detail[] = [
  { title: "What is inside", text: "The expanded area can hold specs, notes, references, or an extended explanation." },
  { title: "Why it helps", text: "Progressive disclosure keeps the page calm until the user needs more information." },
  { title: "How it feels", text: "The revealed content is still part of the same structured panel, so it feels connected." },
  { title: "Practical use", text: "You can place checklists, supporting context, or follow-up details here." },
  { title: "Best fit", text: "The panel is useful when content is important but not needed all at once." },
  { title: "Implementation note", text: "Large blocks of text stay hidden until the user explicitly requests them." },
  { title: "Layout note", text: "This keeps the page lightweight at first glance." },
  { title: "Content note", text: "It can support long notes, technical explanations, or policy summaries." },
  { title: "Product note", text: "The pattern works well in help centers, settings, and detailed cards." },
  { title: "Readability note", text: "The summary stays visible even when the panel is collapsed." },
  { title: "Interaction note", text: "A single button controls reveal and collapse behavior." },
  { title: "Reuse note", text: "The structure can be embedded in articles, docs, or dashboards." },
  { title: "Workflow note", text: "The reveal pattern is useful when users should scan before they expand." },
  { title: "Visual note", text: "Spacing changes little between states, which keeps layout shift low." },
  { title: "Accessibility note", text: "The action remains obvious and can be paired with aria-expanded later." },
  { title: "Support note", text: "This works for policy content, long-form help, or inspection panels." },
  { title: "Summary note", text: "Keeping the first state short helps users decide faster." },
  { title: "Expansion note", text: "Long content appears only when the user wants the extra context." },
  { title: "Structure note", text: "This same hierarchy can be reused for any long-form panel." },
  { title: "Design note", text: "The content stays calm, organized, and easy to read." },
  { title: "Product note", text: "It is a practical tool for progressive disclosure in real interfaces." },
  { title: "Content note", text: "More details can be added without changing the outer component." },
  { title: "Workflow note", text: "The user always sees the important summary first." },
  { title: "Behavior note", text: "Reveal and hide remain the only behaviors the panel needs." },
  { title: "Maintenance note", text: "The panel is simple enough to adapt for many apps." },
  { title: "Team note", text: "Product teams can tailor the messages while keeping the structure stable." },
  { title: "Panel note", text: "The revealed section can even include a checklist or reference list." },
  { title: "Detail note", text: "This keeps the interface small until a deeper read is needed." },
  { title: "Ready note", text: "The same container works for onboarding, settings, or documentation." },
  { title: "Use note", text: "It is especially helpful when the page must remain compact." },
  { title: "State note", text: "The collapsed state is purposeful rather than empty." },
  { title: "Flow note", text: "The CTA keeps the user in control of how much they inspect." },
  { title: "Design system note", text: "This pattern can live inside a reusable component library." },
  { title: "Content strategy note", text: "Short summaries reduce cognitive load for casual readers." },
  { title: "Engineering note", text: "Implementation stays local and predictable." },
  { title: "Maintenance note", text: "A single boolean can drive the whole experience." },
  { title: "Final note", text: "The reveal panel is a small but useful pattern for real products." },
  { title: "Review note", text: "The summary content can be approved before the details are loaded." },
  { title: "Reference note", text: "A reveal section can hold links or citations for deeper reading." },
  { title: "Long-form note", text: "This is a strong choice when the main copy is short but the detail view is rich." },
  { title: "Usage note", text: "Documentation pages benefit from the same pattern." },
  { title: "Tone note", text: "The interface stays quiet and non-blocking." },
  { title: "Decision note", text: "People can decide whether they need more context without scrolling away." },
  { title: "State hint", text: "The panel can also remember whether the user expanded it." },
  { title: "Workflow hint", text: "Collapsed summaries speed up scanning on content-heavy pages." },
];

function DetailBlock({ detail }: { detail: Detail }) {
  return (
    <div style={{ display: "grid", gap: 6, padding: 14, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
      <strong style={{ color: "#0f172a", fontSize: 14 }}>{detail.title}</strong>
      <span style={{ color: "#475569", fontSize: 13, lineHeight: "21px" }}>{detail.text}</span>
    </div>
  );
}

export default function ContentRevealPanel() {
  const [open, setOpen] = useState(false);

  return (
    <main style={{ minHeight: "100%", background: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Content Reveal Panel</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A summary-first panel that reveals deeper details only when the user asks for them.
          </p>
        </header>

        <section style={{ borderRadius: 24, border: "1px solid #e2e8f0", background: "#f8fafc", padding: 18, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <strong style={{ color: "#0f172a", fontSize: 18 }}>Project summary</strong>
            <p style={{ margin: 0, color: "#475569", lineHeight: "24px", fontSize: 14 }}>
              This panel starts with a concise summary so readers can understand the main idea before expanding the full content.
            </p>
            <p style={{ margin: 0, color: "#64748b", lineHeight: "22px", fontSize: 13 }}>
              The hidden content is intentionally more detailed, which makes the reveal interaction useful instead of decorative.
            </p>
          </div>

          {open ? (
            <div style={{ display: "grid", gap: 12, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
              {DETAILS.map((detail) => <DetailBlock key={detail.title} detail={detail} />)}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              style={{
                borderRadius: 14,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                padding: "11px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {open ? "Hide details" : "Reveal details"}
            </button>
            <button
              type="button"
              style={{
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                padding: "11px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Save summary
            </button>
          </div>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The top section stays short, which helps the panel fit on compact pages.</div>
          <div>Expanding the panel reveals more context without taking the user to another screen.</div>
          <div>The transition can be animated later without changing the API.</div>
          <div>The component works for FAQ blocks, settings explanations, and long notes.</div>
          <div>Because the content is toggled locally, the component remains easy to reuse.</div>
          <div>The summary-first approach helps keep dense interfaces readable.</div>
          <div>The same structure can hold a multi-step explanation or a checklist.</div>
          <div>Controls remain obvious so the interaction is straightforward.</div>
          <div>The panel can live inside dashboards, help pages, or onboarding flows.</div>
          <div>It gives users control over how much detail they see.</div>
          <div>Spacing and border radius keep the design calm and consistent.</div>
          <div>This is a good fit for progressive disclosure patterns in real products.</div>
          <div>Developers can swap the body content for richer authored content.</div>
          <div>The reveal state can be linked to a route, accordion, or modal later.</div>
          <div>The component is intentionally lightweight while still being practical.</div>
          <div>A reveal panel is especially useful when the short summary is enough for many users.</div>
          <div>More details stay available for the users who need them.</div>
          <div>The architecture keeps the summary and details clearly separated.</div>
          <div>The same container can be reused for policies, FAQs, or long notes.</div>
          <div>Repeated blocks should never overwhelm the initial surface.</div>
          <div>The reveal is easy to understand because the button text changes with state.</div>
          <div>Teams can add links, lists, or code snippets into the expanded area later.</div>
          <div>That makes the panel useful for help text and technical references alike.</div>
          <div>Small interactions like this keep the interface from feeling noisy.</div>
          <div>The panel encourages users to read only as much as they need.</div>
        </section>
      </section>
    </main>
  );
}
