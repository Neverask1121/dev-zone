import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface DynamicRangeSliderProps {
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

function SectionTitle({ title, description }: Pick<DynamicRangeSliderProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Slider"}</h2>
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

type SliderProps = __COMP__Props & {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  showValue?: boolean;
  onChange?: (value: number) => void;
};

function formatValue(value: number) {
  return new Intl.NumberFormat().format(value);
}

export default function DynamicRangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  showValue = true,
  onChange,
  className,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const trackRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max);
      if (value === undefined) setInternalValue(clamped);
      onChange?.(clamped);
    },
    [max, min, onChange, value]
  );

  const marks = useMemo(() => {
    const length = 5;
    return Array.from({ length }, (_, index) => min + ((max - min) / (length - 1)) * index);
  }, [max, min]);

  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div ref={trackRef} className={cx("rounded-2xl border p-4", className)}>
      <SectionTitle title="Range slider" description="Drag or use keyboard arrows to update the value." />
      <div className="mt-4 space-y-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(event) => handleChange(Number(event.target.value))}
          className="w-full"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
        />
        {showValue ? <p className="text-sm">Value: {formatValue(current)}</p> : null}
        <div className="relative h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          {marks.map((mark) => (
            <span key={mark}>{formatValue(mark)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DynamicRangeSlider({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: DynamicRangeSliderProps) {
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


export const sliderVariants = ["default", "primary", "secondary", "ghost"] as const;
export const sliderSizes = ["sm", "md", "lg"] as const;
export function isDynamicRangeSliderInteractive(disabled?: boolean) { return !disabled; }
export function sliderLabel(index: number) { return `slider item ${index + 1}`; }
