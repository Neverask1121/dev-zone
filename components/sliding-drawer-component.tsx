import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface SlidingDrawerComponentProps {
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

function SectionTitle({ title, description }: Pick<SlidingDrawerComponentProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Drawer"}</h2>
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

export interface SlidingDrawerComponentProps extends __COMP__Props {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";
}

export default function SlidingDrawerComponent({
  open,
  onClose,
  side = "right",
  children,
  className,
}: SlidingDrawerComponentProps) {
  useEscapeKey(onClose);

  const sideClass = useMemo(() => {
    switch (side) {
      case "left": return "left-0 top-0 h-full w-80";
      case "top": return "top-0 left-0 w-full h-72";
      case "bottom": return "bottom-0 left-0 w-full h-72";
      default: return "right-0 top-0 h-full w-80";
    }
  }, [side]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close drawer" />
      <aside className={cx("absolute bg-white p-6 shadow-2xl", sideClass, className)}>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2">Close</button>
        </div>
        <div className="mt-4">{children}</div>
      </aside>
    </div>
  );
}

export default function SlidingDrawerComponent({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: SlidingDrawerComponentProps) {
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


export const drawerVariants = ["default", "primary", "secondary", "ghost"] as const;
export const drawerSizes = ["sm", "md", "lg"] as const;
export function isSlidingDrawerComponentInteractive(disabled?: boolean) { return !disabled; }
export function drawerLabel(index: number) { return `drawer item ${index + 1}`; }
