import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface PaginationEngineProps {
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

function SectionTitle({ title, description }: Pick<PaginationEngineProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Pagination"}</h2>
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

export interface PaginationEngineProps extends __COMP__Props {
  total: number;
  page: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

function buildPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export default function PaginationEngine({
  total,
  page,
  pageSize = 10,
  onPageChange,
  className,
}: PaginationEngineProps) {
  const totalPages = buildPages(total, pageSize);

  const go = useCallback((next: number) => {
    const clamped = clamp(next, 1, totalPages);
    onPageChange?.(clamped);
  }, [onPageChange, totalPages]);

  const pages = useMemo(() => {
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, start + 2);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

  return (
    <div className={cx("flex items-center gap-2 rounded-2xl border p-4", className)}>
      <button type="button" onClick={() => go(page - 1)} className="rounded-lg border px-3 py-2">Prev</button>
      {pages.map((value) => (
        <button key={value} type="button" onClick={() => go(value)} className={cx("rounded-lg px-3 py-2", value === page ? "bg-slate-900 text-white" : "bg-slate-100")}>
          {value}
        </button>
      ))}
      <button type="button" onClick={() => go(page + 1)} className="rounded-lg border px-3 py-2">Next</button>
    </div>
  );
}

export default function PaginationEngine({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: PaginationEngineProps) {
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


export const paginationVariants = ["default", "primary", "secondary", "ghost"] as const;
export const paginationSizes = ["sm", "md", "lg"] as const;
export function isPaginationEngineInteractive(disabled?: boolean) { return !disabled; }
export function paginationLabel(index: number) { return `pagination item ${index + 1}`; }
