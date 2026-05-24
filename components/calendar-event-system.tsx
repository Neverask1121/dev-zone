import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface CalendarEventSystemProps {
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

function SectionTitle({ title, description }: Pick<CalendarEventSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Calendar"}</h2>
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

type CalendarEvent = { id: string; date: string; title: string };

const calendarEvents: CalendarEvent[] = [
  { id: "1", date: "2025-05-05", title: "Release review" },
  { id: "2", date: "2025-05-12", title: "Design sync" },
  { id: "3", date: "2025-05-18", title: "Sprint planning" },
];

function sameDay(dateA: Date, dateB: Date) {
  return dateA.toDateString() === dateB.toDateString();
}

export default function CalendarEventSystem({ className }: __COMP__Props) {
  const today = new Date();
  const monthDays = useMemo(() => {
    const days: Date[] = [];
    const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    while (cursor.getMonth() === today.getMonth()) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [today]);

  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {["S","M","T","W","T","F","S"].map((day) => <div key={day} className="font-semibold">{day}</div>)}
        {monthDays.map((day) => {
          const eventsForDay = calendarEvents.filter((event) => sameDay(new Date(event.date), day));
          return (
            <button key={day.toISOString()} type="button" className="min-h-20 rounded-lg border p-2 text-left">
              <div className="text-xs font-medium">{day.getDate()}</div>
              {eventsForDay.map((event) => <div key={event.id} className="mt-1 rounded bg-blue-50 px-2 py-1 text-[10px]">{event.title}</div>)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarEventSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: CalendarEventSystemProps) {
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


export const calendarVariants = ["default", "primary", "secondary", "ghost"] as const;
export const calendarSizes = ["sm", "md", "lg"] as const;
export function isCalendarEventSystemInteractive(disabled?: boolean) { return !disabled; }
export function calendarLabel(index: number) { return `calendar item ${index + 1}`; }
