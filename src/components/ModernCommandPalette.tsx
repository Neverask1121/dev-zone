import React, { useEffect, useMemo, useRef, useState } from "react";

type Command = {
  id: string;
  title: string;
  description: string;
  category: string;
  shortcut: string;
  keywords: string[];
  action: () => void;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim();

const scoreCommand = (command: Command, query: string) => {
  const q = normalize(query);
  if (!q) return 1;
  const haystack = normalize(
    [command.title, command.description, command.category, command.shortcut, ...command.keywords].join(" ")
  );
  if (haystack === q) return 100;
  if (haystack.startsWith(q)) return 90;
  if (haystack.includes(q)) return 70;
  const qParts = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const part of qParts) {
    if (haystack.includes(part)) score += 10;
  }
  return score;
};

const sampleCommands: Command[] = [
  {
    id: "new-file",
    title: "Create new file",
    description: "Open a blank editor for a fresh document.",
    category: "Files",
    shortcut: "Ctrl+N",
    keywords: ["create", "document", "editor"],
    action: () => console.log("new file"),
  },
  {
    id: "search-workspace",
    title: "Search workspace",
    description: "Search across your project content and metadata.",
    category: "Search",
    shortcut: "Ctrl+Shift+F",
    keywords: ["find", "scan", "project"],
    action: () => console.log("search workspace"),
  },
  {
    id: "toggle-theme",
    title: "Toggle theme",
    description: "Switch between light and dark appearance quickly.",
    category: "View",
    shortcut: "Ctrl+J",
    keywords: ["appearance", "dark", "light"],
    action: () => console.log("toggle theme"),
  },
  {
    id: "open-settings",
    title: "Open settings",
    description: "Jump to application preferences and controls.",
    category: "System",
    shortcut: "Ctrl+,",
    keywords: ["preferences", "config", "options"],
    action: () => console.log("open settings"),
  },
  {
    id: "invite-member",
    title: "Invite teammate",
    description: "Prepare a member invite with a default role.",
    category: "Collaboration",
    shortcut: "Ctrl+I",
    keywords: ["member", "team", "collaborate"],
    action: () => console.log("invite teammate"),
  },
  {
    id: "export-json",
    title: "Export as JSON",
    description: "Create a structured export of the current context.",
    category: "Files",
    shortcut: "Ctrl+E",
    keywords: ["export", "download", "data"],
    action: () => console.log("export json"),
  },
  {
    id: "focus-notifications",
    title: "Focus notifications",
    description: "Jump to the latest system notifications.",
    category: "System",
    shortcut: "Ctrl+Shift+M",
    keywords: ["alerts", "messages", "inbox"],
    action: () => console.log("focus notifications"),
  },
  {
    id: "open-help",
    title: "Open help center",
    description: "Discover documentation and common support topics.",
    category: "Support",
    shortcut: "Ctrl+/",
    keywords: ["guide", "docs", "support"],
    action: () => console.log("open help"),
  },
];

const groups = ["All", "Files", "Search", "View", "System", "Collaboration", "Support"];

function CommandRow({
  command,
  query,
  active,
  onActivate,
}: {
  command: Command;
  query: string;
  active: boolean;
  onActivate: () => void;
}) {
  const text = `${command.title} ${command.description}`;
  const q = normalize(query);
  const idx = q ? normalize(text).indexOf(q) : -1;
  const before = idx >= 0 ? text.slice(0, idx) : text;
  const match = idx >= 0 ? text.slice(idx, idx + query.length) : "";
  const after = idx >= 0 ? text.slice(idx + query.length) : "";
  return (
    <button
      onClick={onActivate}
      className={`flex w-full items-start justify-between gap-4 rounded-2xl px-4 py-3 text-left transition ${
        active ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{command.title}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-white/10" : "bg-slate-100"}`}>
            {command.category}
          </span>
        </div>
        <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-slate-500"}`}>
          {before}
          {match ? <mark className={`rounded px-1 ${active ? "bg-white/20 text-white" : "bg-amber-200"}`}>{match}</mark> : null}
          {after}
        </p>
      </div>
      <div className={`shrink-0 rounded-lg px-2 py-1 text-xs ${active ? "bg-white/10" : "bg-slate-100 text-slate-500"}`}>
        {command.shortcut}
      </div>
    </button>
  );
}

export default function ModernCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands = useMemo(() => {
    return sampleCommands
      .filter((command) => selectedGroup === "All" || command.category === selectedGroup)
      .map((command) => ({ command, score: scoreCommand(command, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ command }) => command);
  }, [query, selectedGroup]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(0, commands.length - 1)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
      }
      if (event.key === "Enter") {
        const command = commands[activeIndex];
        if (command) command.action();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, commands, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setSelectedGroup("All");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, selectedGroup]);

  const runCommand = (command: Command) => {
    command.action();
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-3xl font-semibold">Modern Command Palette</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Open the palette with Ctrl or Command K, search instantly, move through the results with the
            keyboard, and trigger actions without leaving the current context.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Open palette
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-10">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-50 text-slate-900 shadow-2xl">
            <div className="border-b border-slate-200 p-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search commands..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      selectedGroup === group ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[60vh] overflow-auto p-3">
              {commands.length ? (
                <div className="flex flex-col gap-2">
                  {commands.map((command, index) => (
                    <CommandRow
                      key={command.id}
                      command={command}
                      query={query}
                      active={index === activeIndex}
                      onActivate={() => runCommand(command)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
                  No matching commands were found.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
              <div>Use ↑ ↓ to navigate, Enter to run, Esc to close</div>
              <button onClick={() => setOpen(false)} className="font-medium text-slate-700">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
