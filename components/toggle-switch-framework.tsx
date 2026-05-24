import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ToggleSwitchFrameworkProps {
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

function SectionTitle({ title, description }: Pick<ToggleSwitchFrameworkProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Toggle"}</h2>
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

export interface ToggleSwitchFrameworkProps extends __COMP__Props {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ToggleSwitchFramework({
  checked,
  defaultChecked = false,
  onChange,
  className,
}: ToggleSwitchFrameworkProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const current = checked ?? internal;

  const toggle = () => {
    const next = !current;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={current}
      onClick={toggle}
      className={cx("inline-flex w-14 rounded-full p-1 transition", current ? "bg-emerald-500" : "bg-slate-300", className)}
    >
      <span className={cx("h-6 w-6 rounded-full bg-white transition", current ? "translate-x-6" : "translate-x-0")} />
    </button>
  );
}

export default function ToggleSwitchFramework({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: ToggleSwitchFrameworkProps) {
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


export const toggleVariants = ["default", "primary", "secondary", "ghost"] as const;
export const toggleSizes = ["sm", "md", "lg"] as const;
export function isToggleSwitchFrameworkInteractive(disabled?: boolean) { return !disabled; }
export function toggleLabel(index: number) { return `toggle item ${index + 1}`; }
