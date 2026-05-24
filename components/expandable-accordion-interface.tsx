import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ExpandableAccordionInterfaceProps {
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

function SectionTitle({ title, description }: Pick<ExpandableAccordionInterfaceProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Accordion"}</h2>
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

type Item = { id: string; title: string; content: string };

const items: Item[] = [
  { id: "a", title: "Overview", content: "Reusable accordion content." },
  { id: "b", title: "Details", content: "Supports multiple panels and keyboard access." },
  { id: "c", title: "Notes", content: "Works in controlled or uncontrolled patterns." },
];

export default function ExpandableAccordionInterface({ className }: __COMP__Props) {
  const [open, setOpen] = useState<string | null>("a");

  return (
    <div className={cx("rounded-2xl border p-4", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <section key={item.id} className="border-b py-3 last:border-b-0">
            <button type="button" className="flex w-full items-center justify-between" onClick={() => setOpen(isOpen ? null : item.id)}>
              <span>{item.title}</span>
              <span>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <p className="mt-3 text-sm text-slate-600">{item.content}</p> : null}
          </section>
        );
      })}
    </div>
  );
}

export default function ExpandableAccordionInterface({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: ExpandableAccordionInterfaceProps) {
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


export const accordionVariants = ["default", "primary", "secondary", "ghost"] as const;
export const accordionSizes = ["sm", "md", "lg"] as const;
export function isExpandableAccordionInterfaceInteractive(disabled?: boolean) { return !disabled; }
export function accordionLabel(index: number) { return `accordion item ${index + 1}`; }
