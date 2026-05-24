import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Variant = "default" | "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface DynamicAvatarSystemProps {
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

function SectionTitle({ title, description }: Pick<DynamicAvatarSystemProps, "title" | "description">) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold">{title ?? "Avatar"}</h2>
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

export interface DynamicAvatarSystemProps extends __COMP__Props {
  name?: string;
  src?: string;
  status?: "online" | "offline" | "busy";
  sizePx?: number;
}

function initials(name?: string) {
  return (name ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DynamicAvatarSystem({
  name,
  src,
  status = "offline",
  sizePx = 48,
  className,
}: DynamicAvatarSystemProps) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={cx("inline-flex items-center gap-3", className)}>
      <div
        style={{ width: sizePx, height: sizePx }}
        className="relative grid place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold"
      >
        {src && !broken ? (
          <img src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" onError={() => setBroken(true)} />
        ) : (
          <span>{initials(name)}</span>
        )}
        <span
          className={cx(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
            status === "online" ? "bg-emerald-500" : status === "busy" ? "bg-amber-500" : "bg-slate-400"
          )}
        />
      </div>
      <div>
        <p className="font-medium">{name ?? "Anonymous"}</p>
        <p className="text-xs text-slate-500">{status}</p>
      </div>
    </div>
  );
}

export default function DynamicAvatarSystem({
  title,
  description,
  className,
  disabled = false,
  variant = "default",
  size = "md",
  children,
}: DynamicAvatarSystemProps) {
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


export const avatarVariants = ["default", "primary", "secondary", "ghost"] as const;
export const avatarSizes = ["sm", "md", "lg"] as const;
export function isDynamicAvatarSystemInteractive(disabled?: boolean) { return !disabled; }
export function avatarLabel(index: number) { return `avatar item ${index + 1}`; }
