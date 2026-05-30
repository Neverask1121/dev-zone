import React, { useEffect, useMemo, useReducer } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  tone: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: number;
};

type Action =
  | { type: "seed"; items: Notification[] }
  | { type: "dismiss"; id: string }
  | { type: "markRead"; id: string }
  | { type: "markAllRead" }
  | { type: "push"; item: Notification }
  | { type: "tick" };

function reducer(state: Notification[], action: Action): Notification[] {
  switch (action.type) {
    case "seed":
      return action.items;
    case "dismiss":
      return state.filter((item) => item.id !== action.id);
    case "markRead":
      return state.map((item) => (item.id === action.id ? { ...item, read: true } : item));
    case "markAllRead":
      return state.map((item) => ({ ...item, read: true }));
    case "push":
      return [action.item, ...state].slice(0, 8);
    case "tick":
      return state.map((item) => item.read ? item : { ...item });
    default:
      return state;
  }
}

const initialNotifications: Notification[] = [
  { id: "1", title: "Deployment complete", message: "Production build finished successfully.", tone: "success", read: false, createdAt: Date.now() - 120000 },
  { id: "2", title: "Storage threshold", message: "Usage reached 82 percent of quota.", tone: "warning", read: false, createdAt: Date.now() - 300000 },
  { id: "3", title: "Daily summary", message: "You have 14 tasks waiting in review.", tone: "info", read: true, createdAt: Date.now() - 720000 },
];

function toneStyles(tone: Notification["tone"]) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200";
    case "error":
      return "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200";
    default:
      return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200";
  }
}

export default function RealTimeNotificationCenter() {
  const [items, dispatch] = useReducer(reducer, initialNotifications);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextId = String(Date.now());
      const tones: Notification["tone"][] = ["info", "success", "warning", "error"];
      const tone = tones[Math.floor(Math.random() * tones.length)];
      const item: Notification = {
        id: nextId,
        title: tone === "error" ? "Sync failed" : tone === "warning" ? "Review needed" : tone === "success" ? "Task complete" : "New activity",
        message: tone === "error" ? "A background sync failed and needs attention." : "A new event arrived in the activity stream.",
        tone,
        read: false,
        createdAt: Date.now(),
      };
      dispatch({ type: "push", item });
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);

  return (
    <div className="min-h-screen bg-zinc-100 p-4 text-zinc-950 dark:bg-zinc-900 dark:text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Notification Center</h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Real-time notifications with unread counts, dismiss actions, and readable message cards.
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-zinc-950">
              Unread: {unread}
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className={`rounded-3xl border p-5 shadow-sm ${item.read ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" : toneStyles(item.tone)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-current" />}
                    </div>
                    <p className="mt-2 text-sm opacity-90">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "markRead", id: item.id })}
                      className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-medium hover:bg-white dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
                    >
                      Mark read
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "dismiss", id: item.id })}
                      className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-medium hover:bg-white dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "markAllRead" })}
                  className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                >
                  Mark all read
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "push",
                      item: {
                        id: String(Date.now()),
                        title: "Manual alert",
                        message: "This alert was added from the control panel.",
                        tone: "info",
                        read: false,
                        createdAt: Date.now(),
                      },
                    })
                  }
                  className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Add notification
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold">Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <p>Total messages: {items.length}</p>
                <p>Unread messages: {unread}</p>
                <p>New alerts appear at the top of the list.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
