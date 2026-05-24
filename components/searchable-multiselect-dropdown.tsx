import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface SearchableMultiSelectDropdownProps {
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

function SectionTitle({ title, description }: Pick<SearchableMultiSelectDropdownProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Multiselect"}</h2>
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

type Item = { id: string; label: string; disabled?: boolean };

const defaultItems: Item[] = [
  { id: "react", label: "React" },
  { id: "ts", label: "TypeScript" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "accessibility", label: "Accessibility" },
  { id: "testing", label: "Testing" },
];

function selectionSummary(selected: string[]) {
  return selected.length ? `${selected.length} selected` : "Nothing selected";
}

export default function SearchableMultiSelectDropdown({ className }: __COMP__Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const rootRef = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  const filtered = useMemo(() => {
    return defaultItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const toggleItem = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }, []);

  return (
    <div ref={rootRef} className={cx("rounded-2xl border p-4", className)}>
      <SectionTitle title="Searchable multi-select" description="Pick multiple values and filter them instantly." />
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-4 rounded-lg border px-3 py-2">
        {open ? "Close" : "Open"}
      </button>
      {open ? (
        <div className="mt-4 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border px-3 py-2"
          />
          <div className="max-h-48 overflow-auto rounded-xl border p-2">
            {filtered.map((item) => (
              <label key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  disabled={item.disabled}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => (
              <span key={id} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                {id}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500">{selectionSummary(selected)}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchableMultiSelectDropdown({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: SearchableMultiSelectDropdownProps) {
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


export const multiselectVariants = ["default", "primary", "secondary", "ghost"] as const;
export const multiselectSizes = ["sm", "md", "lg"] as const;
export function isSearchableMultiSelectDropdownInteractive(disabled?: boolean) { return !disabled; }
export function multiselectLabel(index: number) { return `multiselect item ${index + 1}`; }
