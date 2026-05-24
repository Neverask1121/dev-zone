import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface CollapsibleSidebarFrameworkProps {
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

function SectionTitle({ title, description }: Pick<CollapsibleSidebarFrameworkProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Sidebar"}</h2>
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

type SidebarItem = { id: string; label: string; group?: string };

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", group: "Main" },
  { id: "components", label: "Components", group: "Main" },
  { id: "settings", label: "Settings", group: "Meta" },
];

export default function CollapsibleSidebarFramework({ className }: __COMP__Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");

  return (
    <aside className={cx("rounded-2xl border p-4", className)} data-collapsed={collapsed}>
      <div className="flex items-center justify-between">
        <strong>Sidebar</strong>
        <button type="button" onClick={() => setCollapsed((v) => !v)} className="rounded-lg border px-3 py-2">
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      <nav className="mt-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cx(
              "block w-full rounded-lg px-3 py-2 text-left text-sm",
              active === item.id ? "bg-slate-900 text-white" : "bg-slate-100"
            )}
          >
            {collapsed ? item.label[0] : item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function CollapsibleSidebarFramework({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: CollapsibleSidebarFrameworkProps) {
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


export const sidebarVariants = ["default", "primary", "secondary", "ghost"] as const;
export const sidebarSizes = ["sm", "md", "lg"] as const;
export function isCollapsibleSidebarFrameworkInteractive(disabled?: boolean) { return !disabled; }
export function sidebarLabel(index: number) { return `sidebar item ${index + 1}`; }
