import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ToastManagementSystemProps {
  title?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  children?: React.ReactNode;
}

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEscape]);
}

function useOutsideClick<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handler]);

  return ref;
}

function SectionTitle({ title, description }: Pick<ToastManagementSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Toast"}</h2>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </header>
  );
}

function resolvedVariantClass(variant: Variant) {
  switch (variant) {
    case "primary":
      return "border-blue-200 bg-blue-50";
    case "secondary":
      return "border-slate-300 bg-slate-50";
    case "ghost":
      return "border-transparent bg-transparent";
    default:
      return "border-slate-200 bg-white";
  }
}

function resolvedSizeClass(size: Size) {
  switch (size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "text-lg";
    default:
      return "text-base";
  }
}

type ToastItem = {
  id: string;
  message: string;
  tone: "success" | "info" | "error";
};

export default function ToastManagementSystem({ className }: __COMP__Props) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const createToast = useCallback((message: string, tone: ToastItem["tone"]) => {
    const id = Math.random().toString(36).slice(2);
    const item = { id, message, tone };
    setItems((current) => [...current, item]);
    window.setTimeout(() => {
      setItems((current) => current.filter((entry) => entry.id !== id));
    }, 3000);
  }, []);

  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      <SectionTitle title="Toast manager" description="Queue messages and auto-dismiss them." />
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => createToast("Saved", "success")} className="rounded-lg border px-3 py-2">Success</button>
        <button type="button" onClick={() => createToast("Heads up", "info")} className="rounded-lg border px-3 py-2">Info</button>
        <button type="button" onClick={() => createToast("Something failed", "error")} className="rounded-lg border px-3 py-2">Error</button>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((toast) => (
          <div key={toast.id} className="rounded-xl border p-3 text-sm">
            <strong className="mr-2">{toast.tone}</strong>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToastManagementSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: ToastManagementSystemProps) {
  const [active, setActive] = useState(false);
  const outerRef = useOutsideClick<HTMLDivElement>(() => setActive(false));
  useEscapeKey(() => setActive(false));

  const toggle = useCallback(() => {
    if (!disabled) setActive((value) => !value);
  }, [disabled]);

  return (
    <div
      ref={outerRef}
      className={cx(
        "rounded-2xl border p-4 shadow-sm transition",
        resolvedVariantClass(variant),
        resolvedSizeClass(size),
        disabled && "pointer-events-none opacity-60",
        className
      )}
      data-active={active}
      aria-disabled={disabled}
    >
      <SectionTitle title={title} description={description} />
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium"
        >
          {active ? "Collapse" : "Expand"}
        </button>
        <div className={cx("transition-all", active ? "block" : "hidden")}>
          {children}
        </div>
      </div>
    </div>
  );
}


export const toastVariants = ["default", "primary", "secondary", "ghost"] as const;
export const toastSizes = ["sm", "md", "lg"] as const;
export function isToastManagementSystemInteractive(disabled?: boolean) { return !disabled; }
export function toastLabel(index: number) { return `toast item ${index + 1}`; }
