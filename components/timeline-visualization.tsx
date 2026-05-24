import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface TimelineVisualizationProps {
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

function SectionTitle({ title, description }: Pick<TimelineVisualizationProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Timeline"}</h2>
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

type Event = { id: string; title: string; date: string; note: string };

const events: Event[] = [
  { id: "1", title: "Plan", date: "2025-01-01", note: "Initial planning." },
  { id: "2", title: "Build", date: "2025-02-01", note: "Core implementation." },
  { id: "3", title: "Launch", date: "2025-03-01", note: "Release milestone." },
];

export default function TimelineVisualization({ className }: __COMP__Props) {
  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4">
            <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-slate-500">{event.date}</p>
              <p className="text-sm">{event.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimelineVisualization({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: TimelineVisualizationProps) {
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


export const timelineVariants = ["default", "primary", "secondary", "ghost"] as const;
export const timelineSizes = ["sm", "md", "lg"] as const;
export function isTimelineVisualizationInteractive(disabled?: boolean) { return !disabled; }
export function timelineLabel(index: number) { return `timeline item ${index + 1}`; }
