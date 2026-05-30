import React, { useEffect, useMemo, useRef, useState } from "react";

type Range = {
  min: number;
  max: number;
};

type Handle = "start" | "end";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value);

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function percentToValue(percent: number, min: number, max: number) {
  return min + ((max - min) * percent) / 100;
}

export default function HighPrecisionRangeSelector() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState<Range>({ min: 15, max: 75 });
  const [dragging, setDragging] = useState<Handle | null>(null);
  const [limit, setLimit] = useState({ min: 0, max: 100 });

  useEffect(() => {
    const resize = () => {
      setLimit({ min: 0, max: 100 });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const activeRange = useMemo(
    () => ({
      startPct: valueToPercent(bounds.min, limit.min, limit.max),
      endPct: valueToPercent(bounds.max, limit.min, limit.max),
    }),
    [bounds, limit]
  );

  const setValueFromPointer = (clientX: number, handle: Handle) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const next = round(percentToValue(percent, limit.min, limit.max));
    setBounds((current) => {
      if (handle === "start") {
        return { min: clamp(next, limit.min, current.max), max: current.max };
      }
      return { min: current.min, max: clamp(next, current.min, limit.max) };
    });
  };

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      setValueFromPointer(event.clientX, dragging);
    };
    const up = () => setDragging(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  const nudge = (handle: Handle, delta: number) => {
    setBounds((current) => {
      if (handle === "start") {
        const next = clamp(current.min + delta, limit.min, current.max);
        return { min: next, max: current.max };
      }
      const next = clamp(current.max + delta, current.min, limit.max);
      return { min: current.min, max: next };
    });
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4 text-zinc-950 dark:bg-zinc-900 dark:text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Range Selector
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Dual handle interval control</h1>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            Selected range: {bounds.min} — {bounds.max}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div className="space-y-5">
            <div
              ref={trackRef}
              className="relative h-3 rounded-full bg-zinc-200 dark:bg-zinc-800"
              onPointerDown={(event) => {
                const rect = trackRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = event.clientX - rect.left;
                const startPx = (activeRange.startPct / 100) * rect.width;
                const endPx = (activeRange.endPct / 100) * rect.width;
                const target: Handle = Math.abs(x - startPx) < Math.abs(x - endPx) ? "start" : "end";
                setDragging(target);
                setValueFromPointer(event.clientX, target);
              }}
            >
              <div
                className="absolute h-3 rounded-full bg-zinc-950 dark:bg-white"
                style={{
                  left: `${activeRange.startPct}%`,
                  width: `${activeRange.endPct - activeRange.startPct}%`,
                }}
              />
              <button
                type="button"
                aria-label="Minimum value"
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-white shadow-md dark:border-white dark:bg-zinc-950"
                style={{ left: `calc(${activeRange.startPct}% - 12px)` }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setDragging("start");
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") nudge("start", -1);
                  if (event.key === "ArrowRight") nudge("start", 1);
                }}
              />
              <button
                type="button"
                aria-label="Maximum value"
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-white shadow-md dark:border-white dark:bg-zinc-950"
                style={{ left: `calc(${activeRange.endPct}% - 12px)` }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setDragging("end");
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") nudge("end", -1);
                  if (event.key === "ArrowRight") nudge("end", 1);
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Drag the handles or use arrow keys</span>
              <span>{dragging ? `Dragging ${dragging}` : "Idle"}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Values</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="space-y-2">
                  <span className="text-xs text-zinc-500">Minimum</span>
                  <input
                    value={bounds.min}
                    onChange={(event) => setBounds((current) => ({ min: clamp(Number(event.target.value), limit.min, current.max), max: current.max }))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    type="number"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs text-zinc-500">Maximum</span>
                  <input
                    value={bounds.max}
                    onChange={(event) => setBounds((current) => ({ min: current.min, max: clamp(Number(event.target.value), current.min, limit.max) }))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    type="number"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Usage</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li>Range is clamped to valid limits.</li>
                <li>Keyboard arrows change the focused handle.</li>
                <li>Pointer dragging updates both ends independently.</li>
                <li>The selected interval is shown above the control.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
