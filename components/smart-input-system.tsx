import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface SmartInputSystemProps {
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

function SectionTitle({ title, description }: Pick<SmartInputSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Input"}</h2>
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

type InputProps = __COMP__Props & {
  value?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  onChange?: (value: string) => void;
};

function validate(value: string, minLength: number, maxLength: number) {
  if (value.length < minLength) return `Minimum length is ${minLength}`;
  if (value.length > maxLength) return `Maximum length is ${maxLength}`;
  return "";
}

function HelperChip({ text }: { text: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{text}</span>;
}

export default function SmartInputSystem({
  value,
  defaultValue = "",
  minLength = 3,
  maxLength = 40,
  onChange,
  className,
  title = "Smart input",
}: InputProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const error = useMemo(() => validate(current, minLength, maxLength), [current, maxLength, minLength]);

  const helperText = useMemo(() => {
    const remaining = maxLength - current.length;
    return remaining >= 0 ? `${remaining} characters left` : "Too long";
  }, [current.length, maxLength]);

  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      <SectionTitle title={title} description="Validation, state, and helper messaging included." />
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium">Value</span>
        <input
          value={current}
          onChange={(event) => {
            const next = event.target.value;
            if (value === undefined) setInternal(next);
            onChange?.(next);
          }}
          className="w-full rounded-lg border px-3 py-2"
          aria-invalid={!!error}
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <HelperChip text={`min:${minLength}`} />
        <HelperChip text={`max:${maxLength}`} />
        <HelperChip text={helperText} />
      </div>
      <p className={cx("mt-2 text-sm", error ? "text-red-600" : "text-slate-500")}>{error || "Looks good."}</p>
    </div>
  );
}

export default function SmartInputSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: SmartInputSystemProps) {
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


export const inputVariants = ["default", "primary", "secondary", "ghost"] as const;
export const inputSizes = ["sm", "md", "lg"] as const;
export function isSmartInputSystemInteractive(disabled?: boolean) { return !disabled; }
export function inputLabel(index: number) { return `input item ${index + 1}`; }
