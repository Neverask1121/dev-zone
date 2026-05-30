import React, { useEffect, useMemo, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  path?: string;
  children?: NavItem[];
  badge?: string;
};

const navTree: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    badge: "Home",
  },
  {
    id: "workspace",
    label: "Workspace",
    children: [
      { id: "overview", label: "Overview", path: "/workspace/overview" },
      { id: "projects", label: "Projects", path: "/workspace/projects" },
      {
        id: "resources",
        label: "Resources",
        children: [
          { id: "docs", label: "Documentation", path: "/workspace/resources/docs" },
          { id: "media", label: "Media", path: "/workspace/resources/media" },
          { id: "templates", label: "Templates", path: "/workspace/resources/templates" },
        ],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    children: [
      { id: "sales", label: "Sales", path: "/reports/sales" },
      { id: "usage", label: "Usage", path: "/reports/usage" },
      { id: "compliance", label: "Compliance", path: "/reports/compliance" },
    ],
  },
  {
    id: "support",
    label: "Support",
    children: [
      { id: "tickets", label: "Tickets", path: "/support/tickets" },
      { id: "sla", label: "SLA", path: "/support/sla" },
      { id: "contact", label: "Contact", path: "/support/contact" },
    ],
  },
];

const findPath = (items: NavItem[], targetPath: string, trail: string[] = []): string[] | null => {
  for (const item of items) {
    const nextTrail = [...trail, item.id];
    if (item.path === targetPath) return nextTrail;
    if (item.children) {
      const result = findPath(item.children, targetPath, nextTrail);
      if (result) return result;
    }
  }
  return null;
};

const flattenPaths = (items: NavItem[], list: string[] = []): string[] => {
  for (const item of items) {
    if (item.path) list.push(item.path);
    if (item.children) flattenPaths(item.children, list);
  }
  return list;
};

function NavNode({
  item,
  depth,
  activePath,
  expanded,
  onToggle,
  onSelect,
}: {
  item: NavItem;
  depth: number;
  activePath: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (path: string) => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isActive = item.path === activePath;
  const isOpen = expanded[item.id] ?? depth < 1;
  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) onToggle(item.id);
          if (item.path) onSelect(item.path);
        }}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left transition ${
          isActive ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
        }`}
        style={{ paddingLeft: `${16 + depth * 18}px` }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
                {item.badge}
              </span>
            ) : null}
          </div>
          {item.path ? (
            <div className={`mt-1 text-xs ${isActive ? "text-white/70" : "text-slate-400"}`}>{item.path}</div>
          ) : null}
        </div>
        {hasChildren ? (
          <span className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>{isOpen ? "−" : "+"}</span>
        ) : null}
      </button>
      {hasChildren && isOpen ? (
        <div className="mt-2 grid gap-2">
          {item.children!.map((child) => (
            <NavNode
              key={child.id}
              item={child}
              depth={depth + 1}
              activePath={activePath}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ResponsiveMultiLevelNavigation() {
  const allPaths = useMemo(() => flattenPaths(navTree), []);
  const [activePath, setActivePath] = useState(allPaths[0] ?? "/dashboard");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    workspace: true,
    reports: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const activeTrail = findPath(navTree, activePath);
    if (activeTrail) {
      setExpanded((current) => {
        const next = { ...current };
        activeTrail.forEach((id) => {
          next[id] = true;
        });
        return next;
      });
    }
  }, [activePath]);

  const toggleGroup = (id: string) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  };

  const selectPath = (path: string) => {
    setActivePath(path);
    if (compact) setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Responsive Multi-Level Navigation</h1>
            <p className="mt-1 text-sm text-slate-500">Nested routes, adaptive collapse, and route awareness.</p>
          </div>
          {compact ? (
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {mobileOpen ? "Close menu" : "Open menu"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[300px_1fr]">
        <aside
          className={`rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 ${
            compact && !mobileOpen ? "hidden" : "block"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Sections</h2>
              <p className="mt-1 text-xs text-slate-500">Expand groups and move through nested routes.</p>
            </div>
            <button
              onClick={() => setExpanded({ workspace: true, reports: true })}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
            >
              Expand all
            </button>
          </div>

          <div className="grid gap-2">
            {navTree.map((item) => (
              <NavNode
                key={item.id}
                item={item}
                depth={0}
                activePath={activePath}
                expanded={expanded}
                onToggle={toggleGroup}
                onSelect={selectPath}
              />
            ))}
          </div>
        </aside>

        <main className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Active route</h2>
              <p className="mt-2 text-sm text-slate-600">
                The current selection is highlighted in the tree and the matching ancestor groups stay open so
                users never lose context inside a dense information hierarchy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wider text-slate-400">Route</div>
                <div className="mt-2 text-lg font-semibold">{activePath}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wider text-slate-400">Presentation</div>
                <div className="mt-2 text-lg font-semibold">{compact ? "Mobile drawer" : "Desktop sidebar"}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wider text-slate-400">Open sections</div>
                <div className="mt-2 text-lg font-semibold">
                  {Object.values(expanded).filter(Boolean).length}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="text-base font-semibold">Preview content</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This layout is designed for admin panels and content-heavy applications. The recursive tree can
                support additional levels without changing the rendering model, and the mobile drawer preserves
                usable navigation in narrow screens.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {allPaths.map((path) => (
                <button
                  key={path}
                  onClick={() => selectPath(path)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm transition ${
                    path === activePath ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  {path}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
