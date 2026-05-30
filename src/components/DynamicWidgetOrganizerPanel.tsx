import React, { useMemo, useState } from "react";

type Widget = {
  id: string;
  title: string;
  summary: string;
  tone: string;
};

type Slot = Widget | null;

const sourceWidgets: Widget[] = [
  { id: "weather", title: "Weather", summary: "Forecast and temperature trend", tone: "from-sky-500 to-cyan-600" },
  { id: "calendar", title: "Calendar", summary: "Upcoming events and reminders", tone: "from-violet-500 to-purple-600" },
  { id: "finance", title: "Finance", summary: "Market movement and balance view", tone: "from-emerald-500 to-teal-600" },
  { id: "news", title: "News", summary: "Fresh headlines and alerts", tone: "from-rose-500 to-orange-600" },
  { id: "tasks", title: "Tasks", summary: "Immediate work queue", tone: "from-amber-500 to-yellow-600" },
  { id: "notes", title: "Notes", summary: "Quick capture area", tone: "from-slate-600 to-slate-800" },
  { id: "traffic", title: "Traffic", summary: "Commute conditions and route status", tone: "from-lime-500 to-green-600" },
  { id: "metrics", title: "Metrics", summary: "Compact performance summary", tone: "from-indigo-500 to-blue-600" },
];

const initialSlots: Slot[] = [
  sourceWidgets[0],
  sourceWidgets[1],
  null,
  sourceWidgets[2],
  null,
  sourceWidgets[3],
  sourceWidgets[4],
  null,
];

const emptySlots = 8;

const slotLabel = (index: number) => `Slot ${index + 1}`;

const moveArrayItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const copy = [...items];
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
};

export default function DynamicWidgetOrganizerPanel() {
  const [pool, setPool] = useState<Widget[]>(sourceWidgets.slice(5));
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [dragWidget, setDragWidget] = useState<Widget | null>(null);
  const [dragSource, setDragSource] = useState<{ kind: "pool" | "slot"; index: number } | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const occupied = useMemo(() => slots.filter(Boolean).length, [slots]);

  const assignToSlot = (widget: Widget, index: number) => {
    setSlots((current) => {
      const next = [...current];
      next[index] = widget;
      return next;
    });
    setPool((current) => current.filter((item) => item.id !== widget.id));
  };

  const returnToPool = (widget: Widget) => {
    setPool((current) => {
      if (current.some((item) => item.id === widget.id)) return current;
      return [...current, widget];
    });
  };

  const removeFromSlot = (index: number) => {
    const widget = slots[index];
    if (!widget) return;
    setSlots((current) => current.map((slot, slotIndex) => (slotIndex === index ? null : slot)));
    setPool((current) => [...current, widget]);
  };

  const swapSlots = (from: number, to: number) => {
    if (from === to) return;
    setSlots((current) => moveArrayItem(current, from, to));
  };

  const clearBoard = () => {
    const allWidgets = [...sourceWidgets];
    setPool([]);
    setSlots(Array.from({ length: emptySlots }, (_, index) => allWidgets[index] ?? null));
  };

  const restoreDefault = () => {
    setPool(sourceWidgets.slice(5));
    setSlots(initialSlots);
    setActiveSlotIndex(null);
  };

  const fillFirstEmpty = (widget: Widget) => {
    const emptyIndex = slots.findIndex((slot) => slot === null);
    if (emptyIndex >= 0) {
      assignToSlot(widget, emptyIndex);
      return;
    }
    setPool((current) => [...current, widget]);
  };

  const onWidgetPick = (widget: Widget, source: "pool" | "slot", index: number) => {
    setDragWidget(widget);
    setDragSource({ kind: source, index });
  };

  const onDropOnSlot = (index: number) => {
    if (!dragWidget || !dragSource) return;
    const existing = slots[index];
    if (dragSource.kind === "slot") {
      const from = dragSource.index;
      if (existing) {
        const next = [...slots];
        next[from] = existing;
        next[index] = dragWidget;
        setSlots(next);
      } else {
        const next = [...slots];
        next[from] = null;
        next[index] = dragWidget;
        setSlots(next);
      }
    } else {
      if (existing) {
        returnToPool(existing);
      }
      assignToSlot(dragWidget, index);
    }
    setDragWidget(null);
    setDragSource(null);
  };

  const onDropOnPool = () => {
    if (!dragWidget || !dragSource) return;
    if (dragSource.kind === "slot") {
      removeFromSlot(dragSource.index);
      returnToPool(dragWidget);
    }
    setDragWidget(null);
    setDragSource(null);
  };

  const renderWidgetCard = (widget: Widget, source: "pool" | "slot", index: number) => {
    return (
      <button
        key={widget.id + source + index}
        draggable
        onDragStart={() => onWidgetPick(widget, source, index)}
        onClick={() => {
          if (source === "pool") fillFirstEmpty(widget);
          else setActiveSlotIndex(index);
        }}
        className="w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className={`h-2 rounded-full bg-gradient-to-r ${widget.tone}`} />
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{widget.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{widget.summary}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500">
            {source}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dynamic Widget Organizer Panel</h1>
              <p className="mt-2 text-sm text-slate-600">
                Arrange widgets by dragging them between the library and the active board, then keep the
                layout aligned with the work you care about most.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={restoreDefault} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
                Restore default
              </button>
              <button onClick={clearBoard} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                Fill from start
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_2fr]">
          <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Widget library</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{pool.length} items</span>
            </div>
            <div className="mt-4 grid gap-3">
              {pool.length ? pool.map((widget, index) => renderWidgetCard(widget, "pool", index)) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  All widgets are placed on the board.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Board</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Drop widgets into a slot, swap them between positions, or click to focus a slot for editing.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {occupied}/{slots.length} occupied
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {slots.map((slot, index) => (
                <div
                  key={slotLabel(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDropOnSlot(index)}
                  className={`min-h-[150px] rounded-3xl border-2 border-dashed p-3 transition ${
                    activeSlotIndex === index ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{slotLabel(index)}</div>
                    {slot ? (
                      <button
                        onClick={() => removeFromSlot(index)}
                        className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500 shadow-sm"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    {slot ? renderWidgetCard(slot, "slot", index) : (
                      <div className="flex h-[102px] items-center justify-center rounded-2xl bg-white text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
                        Empty slot
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={onDropOnPool}
              className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="text-sm font-medium text-slate-700">Drop zone</div>
              <p className="mt-1 text-sm text-slate-500">
                Release a widget here to return it back to the pool, or click a slot card to mark it for
                quick focus.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
