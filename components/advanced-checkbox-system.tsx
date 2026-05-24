import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface AdvancedCheckboxSystemProps {
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

function SectionTitle({ title, description }: Pick<AdvancedCheckboxSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Checkbox"}</h2>
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

type Option = { id: string; label: string };

const options: Option[] = [
  { id: "design", label: "Design" },
  { id: "dev", label: "Development" },
  { id: "qa", label: "QA" },
];

export default function AdvancedCheckboxSystem({ className }: __COMP__Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggle = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  useEffect(() => {
    setSelectAll(selected.length === options.length);
  }, [selected.length]);

  return (
    <fieldset className={cx("rounded-2xl border p-4", className)}>
      <legend className="px-1 font-semibold">Choose categories</legend>
      <label className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={() => {
            const next = !selectAll;
            setSelectAll(next);
            setSelected(next ? options.map((option) => option.id) : []);
          }}
        />
        <span>Select all</span>
      </label>
      <div className="mt-4 space-y-3">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">Selected: {selected.join(", ") || "none"}</p>
    </fieldset>
  );
}

export default function AdvancedCheckboxSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: AdvancedCheckboxSystemProps) {
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


export const checkboxVariants = ["default", "primary", "secondary", "ghost"] as const;
export const checkboxSizes = ["sm", "md", "lg"] as const;
export function isAdvancedCheckboxSystemInteractive(disabled?: boolean) { return !disabled; }
export function checkboxLabel(index: number) { return `checkbox item ${index + 1}`; }
