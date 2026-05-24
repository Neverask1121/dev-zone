import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ResponsiveMultiLevelNavbarProps {
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

function SectionTitle({ title, description }: Pick<ResponsiveMultiLevelNavbarProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Navbar"}</h2>
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

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const links: NavItem[] = [
  { label: "Home", href: "#" },
  {
    label: "Components",
    children: [
      { label: "Buttons", href: "#" },
      { label: "Cards", href: "#" },
      { label: "Forms", href: "#" },
    ],
  },
  { label: "Docs", href: "#" },
  { label: "About", href: "#" },
];

function NavGroup({
  item,
  active,
  onToggle,
}: {
  item: NavItem;
  active: string | null;
  onToggle: (label: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const open = active === item.label;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(item.label)}
        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
      >
        {item.label}
      </button>
      {hasChildren && open ? (
        <div className="absolute mt-2 min-w-48 rounded-xl border bg-white p-2 shadow-lg">
          {item.children!.map((child) => (
            <a key={child.label} href={child.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
              {child.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ResponsiveMultiLevelNavbar({ className }: __COMP__Props) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const toggleGroup = useCallback((label: string) => {
    setActiveGroup((current) => (current === label ? null : label));
  }, []);

  return (
    <nav className={cx("border-b bg-white p-4", className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="font-bold">Brand</div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg border px-3 py-2 md:hidden">
          Menu
        </button>
        <div className={cx("gap-2 md:flex", open ? "block" : "hidden md:flex")}>
          {links.map((item) => (
            <NavGroup key={item.label} item={item} active={activeGroup} onToggle={toggleGroup} />
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function ResponsiveMultiLevelNavbar({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: ResponsiveMultiLevelNavbarProps) {
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


export const navbarVariants = ["default", "primary", "secondary", "ghost"] as const;
export const navbarSizes = ["sm", "md", "lg"] as const;
export function isResponsiveMultiLevelNavbarInteractive(disabled?: boolean) { return !disabled; }
export function navbarLabel(index: number) { return `navbar item ${index + 1}`; }
