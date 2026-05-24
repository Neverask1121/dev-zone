import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface InteractiveContentCardSystemProps {
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

function SectionTitle({ title, description }: Pick<InteractiveContentCardSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Card"}</h2>
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

type CardItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  actionLabel?: string;
};

const sampleTags = ["UI", "Layout", "Interactive", "Modern", "Reusable"];

function CardMedia({ image, title }: Pick<CardItem, "image" | "title">) {
  if (!image) return null;
  return (
    <div className="overflow-hidden rounded-xl border">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
    </div>
  );
}

function CardTags({ tags }: Pick<CardItem, "tags">) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs">
          {tag}
        </span>
      ))}
    </div>
  );
}

function normalizeCards(items: CardItem[]) {
  return items.map((item, index) => ({
    ...item,
    tags: item.tags?.length ? item.tags : sampleTags.slice(0, 2 + (index % 3)),
  }));
}

export interface InteractiveContentCardSystemProps extends __COMP__Props {
  items: CardItem[];
  onSelect?: (item: CardItem) => void;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border p-4">
      <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function CardToolbar({
  active,
  onReset,
}: {
  active: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs">
      <span>{active ? "A card is selected" : "No selection"}</span>
      <button type="button" onClick={onReset} className="rounded-md border px-2 py-1">
        Reset
      </button>
    </div>
  );
}

export default function InteractiveContentCardSystem({
  items,
  onSelect,
  ...props
}: InteractiveContentCardSystemProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cards = useMemo(() => normalizeCards(items), [items]);

  const handleSelect = useCallback(
    (item: CardItem) => {
      setSelectedId(item.id);
      setExpandedId(item.id);
      onSelect?.(item);
    },
    [onSelect]
  );

  const reset = useCallback(() => {
    setSelectedId(null);
    setExpandedId(null);
  }, []);

  useEffect(() => {
    if (!cards.length) reset();
  }, [cards.length, reset]);

  return (
    <div {...props}>
      <CardToolbar active={!!selectedId} onReset={reset} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => {
          const isSelected = selectedId === item.id;
          const isExpanded = expandedId === item.id;
          return (
            <article
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cx(
                "group cursor-pointer rounded-2xl border p-4 transition",
                isSelected ? "scale-[1.02] border-blue-500 shadow-lg" : "hover:shadow-md"
              )}
              tabIndex={0}
              onKeyDown={(event) => event.key === "Enter" && handleSelect(item)}
              aria-pressed={isSelected}
            >
              <CardMedia image={item.image} title={item.title} />
              <div className="mt-3 space-y-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                <CardTags tags={item.tags} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Card {item.id}
                </span>
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1 text-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    setExpandedId(isExpanded ? null : item.id);
                  }}
                >
                  {isExpanded ? "Hide details" : item.actionLabel ?? "Open"}
                </button>
              </div>
              {isExpanded ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  This card can surface rich content such as notes, actions, badges, and inline metadata.
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function InteractiveContentCardSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: InteractiveContentCardSystemProps) {
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


export const cardVariants = ["default", "primary", "secondary", "ghost"] as const;
export const cardSizes = ["sm", "md", "lg"] as const;
export function isInteractiveContentCardSystemInteractive(disabled?: boolean) { return !disabled; }
export function cardLabel(index: number) { return `card item ${index + 1}`; }
