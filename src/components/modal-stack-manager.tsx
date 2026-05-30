import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ModalEntry = {
  id: string;
  title: string;
  body: string;
};

type ModalContextValue = {
  stack: ModalEntry[];
  open: (entry: ModalEntry) => void;
  closeTop: () => void;
  closeById: (id: string) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalStack() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("Modal stack context missing");
  }
  return ctx;
}

function ModalProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<ModalEntry[]>([]);

  const open = (entry: ModalEntry) => setStack((current) => [...current, entry]);
  const closeTop = () => setStack((current) => current.slice(0, -1));
  const closeById = (id: string) => setStack((current) => current.filter((item) => item.id !== id));

  useEffect(() => {
    document.body.style.overflow = stack.length ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stack.length]);

  const value = useMemo(
    () => ({
      stack,
      open,
      closeTop,
      closeById,
    }),
    [stack]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

function BackdropLayer({ depth, onClick }: { depth: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="absolute inset-0"
      style={{
        background: `rgba(0, 0, 0, ${0.35 + depth * 0.08})`,
        backdropFilter: "blur(4px)",
      }}
    />
  );
}

function ModalCard({
  entry,
  depth,
  onClose,
}: {
  entry: ModalEntry;
  depth: number;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${entry.id}`}
      className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-950"
      style={{
        transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.02})`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Layer {depth + 1}
          </p>
          <h2 id={`modal-title-${entry.id}`} className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {entry.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          Close
        </button>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        <p>{entry.body}</p>
        <p>
          The active dialog blocks background scrolling, keeps focus within the stack, and allows overlays
          to close only the topmost layer.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Focus</div>
            <div className="mt-2">The active modal owns the interaction surface.</div>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Stack</div>
            <div className="mt-2">Each new dialog mounts above the previous one.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalViewport() {
  const { stack, closeTop, closeById } = useModalStack();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTop();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeTop]);

  if (!stack.length) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {stack.map((entry, index) => {
        const isTop = index === stack.length - 1;
        return (
          <div
            key={entry.id}
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 50 + index }}
          >
            <BackdropLayer depth={index} onClick={isTop ? closeTop : () => closeById(entry.id)} />
            <div className="relative z-10 w-full flex items-center justify-center">
              <ModalCard entry={entry} depth={index} onClose={isTop ? closeTop : () => closeById(entry.id)} />
            </div>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

function DemoControls() {
  const { open, stack, closeTop } = useModalStack();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <button
        type="button"
        onClick={() =>
          open({
            id: crypto.randomUUID(),
            title: "Project Details",
            body: "Review project metadata, edit notes, and launch follow-up tasks from here.",
          })
        }
        className="rounded-3xl bg-zinc-950 px-5 py-4 text-left text-white shadow-sm dark:bg-white dark:text-zinc-950"
      >
        Open first modal
      </button>
      <button
        type="button"
        onClick={() =>
          open({
            id: crypto.randomUUID(),
            title: "Confirmation Layer",
            body: "This dialog is stacked above the current content and can itself open another layer.",
          })
        }
        className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      >
        Open stacked modal
      </button>
      <button
        type="button"
        onClick={closeTop}
        className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      >
        Close top layer
      </button>
      <div className="lg:col-span-3 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium">Active dialogs: {stack.length}</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          The provider keeps the stack in state and renders the entire layered surface through a portal.
        </p>
      </div>
    </div>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen bg-zinc-100 p-4 text-zinc-950 dark:bg-zinc-900 dark:text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold">Modal Stack Manager</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Layered dialogs with overlay dismissal, escape handling, and focus protection.
          </p>
        </header>
        <DemoControls />
      </div>
      <ModalViewport />
    </div>
  );
}

export default function ModalStackManager() {
  return (
    <ModalProvider>
      <AppShell />
    </ModalProvider>
  );
}
