import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface EnterpriseDataTableProps {
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

function SectionTitle({ title, description }: Pick<EnterpriseDataTableProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Table"}</h2>
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

type Column<T> = { key: keyof T; label: string; sortable?: boolean };
type Row = { id: number; name: string; role: string; score: number };

const rows: Row[] = [
  { id: 1, name: "Asha", role: "Designer", score: 94 },
  { id: 2, name: "Ravi", role: "Developer", score: 88 },
  { id: 3, name: "Nina", role: "QA", score: 79 },
  { id: 4, name: "Sam", role: "PM", score: 91 },
];

const columns: Column<Row>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "score", label: "Score", sortable: true },
];

export default function EnterpriseDataTable({ className }: __COMP__Props) {
  const [sortKey, setSortKey] = useState<keyof Row>("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...rows].sort((a, b) => {
      const left = String(a[sortKey]);
      const right = String(b[sortKey]);
      return direction === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });
    return copy;
  }, [direction, sortKey]);

  const paged = useMemo(() => sorted.slice((page - 1) * 2, page * 2), [page, sorted]);

  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="border-b p-2 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setSortKey(column.key);
                    setDirection((current) => (current === "asc" ? "desc" : "asc"));
                  }}
                >
                  {column.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row) => (
            <tr key={row.id}>
              <td className="border-b p-2">{row.name}</td>
              <td className="border-b p-2">{row.role}</td>
              <td className="border-b p-2">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-2">Prev</button>
        <button type="button" onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2">Next</button>
      </div>
    </div>
  );
}

export default function EnterpriseDataTable({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: EnterpriseDataTableProps) {
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


export const tableVariants = ["default", "primary", "secondary", "ghost"] as const;
export const tableSizes = ["sm", "md", "lg"] as const;
export function isEnterpriseDataTableInteractive(disabled?: boolean) { return !disabled; }
export function tableLabel(index: number) { return `table item ${index + 1}`; }
