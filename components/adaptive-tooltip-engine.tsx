import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface AdaptiveTooltipEngineProps {
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

function SectionTitle({ title, description }: Pick<AdaptiveTooltipEngineProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Tooltip"}</h2>
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

export interface AdaptiveTooltipEngineProps extends __COMP__Props {
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

export default function AdaptiveTooltipEngine({
  content,
  placement = "top",
  children,
  className,
}: AdaptiveTooltipEngineProps) {
  const [visible, setVisible] = useState(false);

  const placementClass = useMemo(() => {
    switch (placement) {
      case "bottom": return "translate-y-2 top-full";
      case "left": return "-translate-x-2 right-full";
      case "right": return "translate-x-2 left-full";
      default: return "-translate-y-2 bottom-full";
    }
  }, [placement]);

  return (
    <span
      className={cx("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible ? (
        <span className={cx("absolute z-20 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg", placementClass)}>
          {content}
        </span>
      ) : null}
    </span>
  );
}

export default function AdaptiveTooltipEngine({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: AdaptiveTooltipEngineProps) {
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


export const tooltipVariants = ["default", "primary", "secondary", "ghost"] as const;
export const tooltipSizes = ["sm", "md", "lg"] as const;
export function isAdaptiveTooltipEngineInteractive(disabled?: boolean) { return !disabled; }
export function tooltipLabel(index: number) { return `tooltip item ${index + 1}`; }
