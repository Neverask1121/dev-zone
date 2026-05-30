import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LayoutMode = "grid" | "focus" | "stack" | "masonry";

type Panel = {
  id: string;
  title: string;
  body: string;
  accent: string;
  span: number;
};

type DragState = {
  panelId: string;
  startX: number;
  startSpan: number;
};

const STORAGE_KEY = "adaptive-dashboard-layout-v1";

const seedPanels: Panel[] = [
  {
    id: "overview",
    title: "Overview",
    body: "Daily summaries, alerts, and the most important system signals stay visible here.",
    accent: "from-slate-700 to-slate-900",
    span: 2,
  },
  {
    id: "activity",
    title: "Activity",
    body: "A running stream of events, interactions, and operational updates appears in one place.",
    accent: "from-indigo-600 to-sky-700",
    span: 2,
  },
  {
    id: "tasks",
    title: "Tasks",
    body: "Task tracking, priorities, and progress cards can be arranged for quick scanning.",
    accent: "from-emerald-600 to-teal-700",
    span: 1,
  },
  {
    id: "insights",
    title: "Insights",
    body: "Charts and analytical snapshots can be resized to give more room to deeper analysis.",
    accent: "from-violet-600 to-fuchsia-700",
    span: 2,
  },
  {
    id: "notes",
    title: "Notes",
    body: "A flexible note surface keeps supporting information close to the main workspace.",
    accent: "from-amber-500 to-orange-600",
    span: 1,
  },
  {
    id: "messages",
    title: "Messages",
    body: "Live communication and status updates can be expanded when response work takes priority.",
    accent: "from-cyan-600 to-blue-700",
    span: 1,
  },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const loadState = (): { panels: Panel[]; mode: LayoutMode } => {
  if (typeof window === "undefined") {
    return { panels: seedPanels, mode: "grid" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { panels: seedPanels, mode: "grid" };
    }
    const parsed = JSON.parse(raw) as { panels?: Panel[]; mode?: LayoutMode };
    const panels = Array.isArray(parsed.panels) && parsed.panels.length ? parsed.panels : seedPanels;
    const mode = parsed.mode ?? "grid";
    return {
      panels: panels.map((panel) => ({
        ...panel,
        span: clamp(panel.span ?? 1, 1, 3),
      })),
      mode: ["grid", "focus", "stack", "masonry"].includes(mode) ? mode : "grid",
    };
  } catch {
    return { panels: seedPanels, mode: "grid" };
  }
};

const saveState = (panels: Panel[], mode: LayoutMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ panels, mode }));
};

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const copy = [...items];
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
};

const ModeButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      {label}
    </button>
  );
};

export default function AdaptiveDashboardLayoutComposer() {
  const [{ panels: initialPanels, mode: initialMode }] = useState(loadState);
  const [panels, setPanels] = useState<Panel[]>(initialPanels);
  const [mode, setMode] = useState<LayoutMode>(initialMode);
  const [activePanel, setActivePanel] = useState<string>(initialPanels[0]?.id ?? "");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    saveState(panels, mode);
  }, [panels, mode]);

  useEffect(() => {
    const onResize = () => {
      setContainerWidth(wrapperRef.current?.clientWidth ?? window.innerWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visiblePanels = useMemo(() => {
    if (mode === "focus") {
      return panels.filter((panel) => panel.id === activePanel).length
        ? panels.filter((panel) => panel.id === activePanel)
        : panels.slice(0, 1);
    }
    return panels;
  }, [activePanel, mode, panels]);

  const columns = useMemo(() => {
    if (mode === "stack") return 1;
    if (containerWidth < 640) return 1;
    if (containerWidth < 960) return 2;
    return 3;
  }, [containerWidth, mode]);

  const gridTemplateColumns = useMemo(() => {
    if (columns === 1) return "1fr";
    if (columns === 2) return "repeat(2, minmax(0, 1fr))";
    return "repeat(3, minmax(0, 1fr))";
  }, [columns]);

  const persistPanels = useCallback((nextPanels: Panel[]) => {
    setPanels(nextPanels);
  }, []);

  const movePanel = useCallback(
    (fromId: string, toId: string) => {
      const fromIndex = panels.findIndex((panel) => panel.id === fromId);
      const toIndex = panels.findIndex((panel) => panel.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      persistPanels(reorder(panels, fromIndex, toIndex));
    },
    [panels, persistPanels]
  );

  const adjustSpan = useCallback(
    (id: string, delta: number) => {
      persistPanels(
        panels.map((panel) => {
          if (panel.id !== id) return panel;
          return { ...panel, span: clamp(panel.span + delta, 1, 3) };
        })
      );
    },
    [panels, persistPanels]
  );

  const removePanel = useCallback(
    (id: string) => {
      const next = panels.filter((panel) => panel.id !== id);
      persistPanels(next.length ? next : seedPanels.slice(0, 1));
      if (activePanel === id) {
        setActivePanel(next[0]?.id ?? seedPanels[0].id);
      }
    },
    [activePanel, panels, persistPanels]
  );

  const resetLayout = () => {
    setPanels(seedPanels);
    setMode("grid");
    setActivePanel(seedPanels[0].id);
  };

  const addPanel = () => {
    const id = `custom-${Date.now()}`;
    const nextPanel: Panel = {
      id,
      title: "Custom Panel",
      body: "This panel can be customized for any team-specific dashboard workflow.",
      accent: "from-slate-600 to-zinc-800",
      span: 1,
    };
    const next = [...panels, nextPanel];
    persistPanels(next);
    setActivePanel(id);
  };

  const onPanelDragStart = (panelId: string) => {
    if (mode === "stack") return;
    setDragState({
      panelId,
      startX: window.innerWidth,
      startSpan: panels.find((panel) => panel.id === panelId)?.span ?? 1,
    });
  };

  const onPanelDragEnd = () => {
    setDragState(null);
  };

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!dragState) return;
      const panel = panels.find((item) => item.id === dragState.panelId);
      if (!panel) return;
      const delta = event.clientX - dragState.startX;
      const change = delta > 80 ? 1 : delta < -80 ? -1 : 0;
      if (!change) return;
      adjustSpan(panel.id, change);
      setDragState(null);
    },
    [adjustSpan, dragState, panels]
  );

  useEffect(() => {
    if (!dragState) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPanelDragEnd, { once: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [dragState, onPointerMove]);

  return (
    <div ref={wrapperRef} className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Adaptive Dashboard Layout Composer</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Reorder panels, resize the workspace, and keep the layout persisted for future visits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ModeButton active={mode === "grid"} label="Grid" onClick={() => setMode("grid")} />
              <ModeButton active={mode === "focus"} label="Focus" onClick={() => setMode("focus")} />
              <ModeButton active={mode === "stack"} label="Stack" onClick={() => setMode("stack")} />
              <ModeButton active={mode === "masonry"} label="Masonry" onClick={() => setMode("masonry")} />
              <button
                onClick={addPanel}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Add panel
              </button>
              <button
                onClick={resetLayout}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        <section
          className="grid gap-4"
          style={{
            gridTemplateColumns,
          }}
        >
          {visiblePanels.map((panel) => {
            const selected = panel.id === activePanel;
            return (
              <article
                key={panel.id}
                draggable={mode !== "stack"}
                onDragStart={() => onPanelDragStart(panel.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => movePanel(activePanel, panel.id)}
                onClick={() => setActivePanel(panel.id)}
                className={`group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition ${
                  selected ? "ring-2 ring-slate-900" : ""
                }`}
                style={{
                  gridColumn: mode === "masonry" ? `span ${clamp(panel.span, 1, columns)}` : "auto",
                }}
              >
                <div className={`bg-gradient-to-r ${panel.accent} p-5 text-white`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{panel.title}</h2>
                      <p className="mt-1 text-sm text-white/80">Panel {panel.id}</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-wider">
                      {mode}
                    </span>
                  </div>
                </div>
                <div className="flex h-full flex-col gap-4 p-5">
                  <p className="text-sm leading-6 text-slate-600">{panel.body}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          adjustSpan(panel.id, -1);
                        }}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        Narrower
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          adjustSpan(panel.id, 1);
                        }}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        Wider
                      </button>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        removePanel(panel.id);
                      }}
                      className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span>Span {panel.span}</span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        movePanel(panel.id, panels[0]?.id ?? panel.id);
                      }}
                      className="underline decoration-slate-300 underline-offset-4"
                    >
                      Move to front
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold">Workspace controls</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Click a panel to focus it, drag it to reorder, and use the resize actions to change how much
              room each section receives. The chosen arrangement is saved locally and restored on reload.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-700">Current mode</div>
            <div className="text-2xl font-semibold capitalize">{mode}</div>
            <div className="text-xs text-slate-500">Active panel: {activePanel || "none"}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
