import React, { useMemo, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: string;
};

type Group = {
  id: string;
  title: string;
  items: NavItem[];
};

const groups: Group[] = [
  {
    id: "overview",
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "#dashboard", icon: "◉" },
      { id: "analytics", label: "Analytics", href: "#analytics", icon: "▣" },
      { id: "reports", label: "Reports", href: "#reports", icon: "◧" },
    ],
  },
  {
    id: "management",
    title: "Management",
    items: [
      { id: "users", label: "Users", href: "#users", icon: "◎" },
      { id: "teams", label: "Teams", href: "#teams", icon: "▤" },
      { id: "roles", label: "Roles", href: "#roles", icon: "▥" },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "projects", label: "Projects", href: "#projects", icon: "◆" },
      { id: "tasks", label: "Tasks", href: "#tasks", icon: "◈" },
      { id: "calendar", label: "Calendar", href: "#calendar", icon: "◌" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    items: [
      { id: "preferences", label: "Preferences", href: "#preferences", icon: "⚙" },
      { id: "billing", label: "Billing", href: "#billing", icon: "¤" },
      { id: "security", label: "Security", href: "#security", icon: "⊚" },
    ],
  },
];

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useActiveRoute() {
  const [active, setActive] = useState("dashboard");
  const [compact, setCompact] = useState(false);
  return { active, setActive, compact, setCompact };
}

function MenuItem({
  item,
  active,
  onSelect,
  compact,
}: {
  item: NavItem;
  active: boolean;
  onSelect: (id: string) => void;
  compact: boolean;
}) {
  return (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onSelect(item.id);
      }}
      className={cx(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        active
          ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-black/5 text-base dark:bg-white/10">
        {item.icon}
      </span>
      {!compact && (
        <span className="flex-1 truncate">
          {item.label}
        </span>
      )}
    </a>
  );
}

function GroupSection({
  group,
  active,
  onSelect,
  compact,
  open,
  toggle,
}: {
  group: Group;
  active: string;
  onSelect: (id: string) => void;
  compact: boolean;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={toggle}
        className={cx(
          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left",
          "text-xs font-semibold uppercase tracking-[0.18em]",
          "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        )}
      >
        <span>{group.title}</span>
        <span className="text-[10px]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="space-y-1">
          {group.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              active={active === item.id}
              onSelect={onSelect}
              compact={compact}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RoutePreview({ active }: { active: string }) {
  const activeMeta = useMemo(() => {
    for (const group of groups) {
      const found = group.items.find((item) => item.id === active);
      if (found) return { group: group.title, label: found.label };
    }
    return { group: "Unknown", label: "Unknown" };
  }, [active]);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Current Route
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
          {activeMeta.label}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Group: {activeMeta.group}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Route Summary
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>This panel reflects the selected section from the sidebar.</p>
            <p>The structure supports grouped items, compact mode, and route highlighting.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Interaction Notes
          </div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Keyboard focus styles are visible.</li>
            <li>Each section can collapse independently.</li>
            <li>Route state is preserved locally in component state.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SidebarNavigationSuite() {
  const { active, setActive, compact, setCompact } = useActiveRoute();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    management: true,
    workspace: true,
    settings: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4 text-zinc-950 dark:bg-zinc-900 dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">Sidebar Suite</h1>
              {!compact && <p className="text-sm text-zinc-500">Grouped navigation</p>}
            </div>
            <button
              type="button"
              onClick={() => setCompact((v) => !v)}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {compact ? "Expanded" : "Compact"}
            </button>
          </div>
          <div className="space-y-4">
            {groups.map((group) => (
              <GroupSection
                key={group.id}
                group={group}
                active={active}
                onSelect={setActive}
                compact={compact}
                open={openGroups[group.id]}
                toggle={() => toggleGroup(group.id)}
              />
            ))}
          </div>
        </aside>
        <main className="space-y-4">
          <RoutePreview active={active} />
          <div className="grid gap-4 md:grid-cols-3">
            {["Route awareness", "Section collapse", "Compact layout"].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-sm font-medium">{item}</p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  This panel demonstrates reusable sidebar behavior for dense application layouts.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
