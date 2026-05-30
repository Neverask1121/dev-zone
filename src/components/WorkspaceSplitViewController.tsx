import React, { useEffect, useMemo, useRef, useState } from "react";

type SplitMode = "horizontal" | "vertical";

type SnapPoint = {
  label: string;
  ratio: number;
};

const STORAGE_KEY = "workspace-split-view-v1";

const snapPoints: SnapPoint[] = [
  { label: "20 / 80", ratio: 0.2 },
  { label: "30 / 70", ratio: 0.3 },
  { label: "40 / 60", ratio: 0.4 },
  { label: "50 / 50", ratio: 0.5 },
  { label: "60 / 40", ratio: 0.6 },
  { label: "70 / 30", ratio: 0.7 },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const loadLayout = (): { mode: SplitMode; ratio: number } => {
  if (typeof window === "undefined") return { mode: "horizontal", ratio: 0.45 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mode: "horizontal", ratio: 0.45 };
    const parsed = JSON.parse(raw) as { mode?: SplitMode; ratio?: number };
    return {
      mode: parsed.mode === "vertical" ? "vertical" : "horizontal",
      ratio: clamp(parsed.ratio ?? 0.45, 0.2, 0.8),
    };
  } catch {
    return { mode: "horizontal", ratio: 0.45 };
  }
};

const saveLayout = (mode: SplitMode, ratio: number) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, ratio }));
};

function Pane({
  title,
  body,
  tone,
  size,
}: {
  title: string;
  body: string;
  tone: string;
  size: string;
}) {
  return (
    <div className={`flex h-full flex-col rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${size}`}>
      <div className={`rounded-t-3xl bg-gradient-to-r ${tone} px-5 py-4 text-white`}>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm leading-6 text-slate-600">{body}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-400">Focus</div>
            <div className="mt-2 text-sm font-medium text-slate-800">Workspace ready</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-400">Status</div>
            <div className="mt-2 text-sm font-medium text-slate-800">Synced</div>
          </div>
        </div>
        <div className="mt-auto rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          The pane can host editors, previews, or inspection tools without changing the split controller.
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceSplitViewController() {
  const [{ mode: initialMode, ratio: initialRatio }] = useState(loadLayout);
  const [mode, setMode] = useState<SplitMode>(initialMode);
  const [ratio, setRatio] = useState(initialRatio);
  const [dragging, setDragging] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    saveLayout(mode, ratio);
  }, [mode, ratio]);

  useEffect(() => {
    const updateSize = () => {
      const rect = shellRef.current?.getBoundingClientRect();
      if (rect) {
        setDimension({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const primaryStyle = useMemo(() => {
    if (mode === "horizontal") {
      return { flexBasis: `${ratio * 100}%`, minWidth: 240 };
    }
    return { flexBasis: `${ratio * 100}%`, minHeight: 240 };
  }, [mode, ratio]);

  const secondaryStyle = useMemo(() => {
    if (mode === "horizontal") {
      return { flexBasis: `${(1 - ratio) * 100}%`, minWidth: 240 };
    }
    return { flexBasis: `${(1 - ratio) * 100}%`, minHeight: 240 };
  }, [mode, ratio]);

  const applySnap = (next: number) => {
    let closest = snapPoints[0].ratio;
    let distance = Math.abs(next - closest);
    for (const snap of snapPoints) {
      const currentDistance = Math.abs(next - snap.ratio);
      if (currentDistance < distance) {
        closest = snap.ratio;
        distance = currentDistance;
      }
    }
    setRatio(closest);
  };

  const updateRatioFromPointer = (clientX: number, clientY: number) => {
    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (mode === "horizontal") {
      const next = clamp((clientX - rect.left) / rect.width, 0.2, 0.8);
      setRatio(next);
    } else {
      const next = clamp((clientY - rect.top) / rect.height, 0.2, 0.8);
      setRatio(next);
    }
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => updateRatioFromPointer(event.clientX, event.clientY);
    const onUp = () => {
      setDragging(false);
      applySnap(ratio);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [dragging, mode, ratio]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Workspace Split View Controller</h1>
              <p className="mt-2 text-sm text-slate-600">
                Resize the panes, switch orientation, and preserve the current ratio so the workspace feels
                stable between visits.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode("horizontal")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  mode === "horizontal" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Horizontal
              </button>
              <button
                onClick={() => setMode("vertical")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  mode === "vertical" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Vertical
              </button>
              {snapPoints.map((snap) => (
                <button
                  key={snap.label}
                  onClick={() => setRatio(snap.ratio)}
                  className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  {snap.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={shellRef}
          className={`mt-6 flex overflow-hidden rounded-3xl bg-slate-200 shadow-sm ring-1 ring-slate-200 ${
            mode === "horizontal" ? "min-h-[72vh] flex-row" : "min-h-[72vh] flex-col"
          }`}
        >
          <div
            style={primaryStyle}
            className={`relative ${mode === "horizontal" ? "min-w-[240px]" : "min-h-[240px]"}`}
          >
            <Pane
              title="Primary pane"
              body="This area is ideal for the main editor, a detailed inspector, or the most important workflow
                surface. The pane size is adjustable by dragging the divider."
              tone="from-slate-800 to-slate-950"
              size="h-full"
            />
          </div>

          <div
            onPointerDown={() => setDragging(true)}
            onDoubleClick={() => setRatio(0.5)}
            className={`flex items-center justify-center bg-slate-300 transition ${
              mode === "horizontal"
                ? "w-3 cursor-col-resize"
                : "h-3 cursor-row-resize"
            }`}
          >
            <div className={`rounded-full bg-slate-500 ${mode === "horizontal" ? "h-16 w-1.5" : "h-1.5 w-16"}`} />
          </div>

          <div
            style={secondaryStyle}
            className={`relative ${mode === "horizontal" ? "min-w-[240px]" : "min-h-[240px]"}`}
          >
            <Pane
              title="Secondary pane"
              body="Use this side for notes, a live preview, command output, or related tools. The snap points
                make common layouts easy to restore after resizing."
              tone="from-indigo-600 to-violet-700"
              size="h-full"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">Mode</div>
            <div className="mt-2 text-xl font-semibold capitalize">{mode}</div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">Ratio</div>
            <div className="mt-2 text-xl font-semibold">{Math.round(ratio * 100)}%</div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">Workspace size</div>
            <div className="mt-2 text-xl font-semibold">
              {Math.round(dimension.width)} × {Math.round(dimension.height)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
