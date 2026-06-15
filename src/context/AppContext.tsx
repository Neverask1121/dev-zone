import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Layout, FileText, Compass, Bell } from 'lucide-react';
import { ALL_COMPONENTS as COMPONENTS } from '../data/components';

export type TechFramework = 'html' | 'react' | 'nextjs' | 'vue' | 'angular';
export type ColorAccent = 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
type PreviewSize = 'desktop' | 'tablet' | 'mobile';

interface AppState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  activeTabs: Record<string, TechFramework>;
  setActiveTabs: React.Dispatch<React.SetStateAction<Record<string, TechFramework>>>;
  accentColors: Record<string, ColorAccent>;
  setAccentColors: React.Dispatch<React.SetStateAction<Record<string, ColorAccent>>>;
  previewSizes: Record<string, PreviewSize>;
  setPreviewSizes: React.Dispatch<React.SetStateAction<Record<string, PreviewSize>>>;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  showPlayground: boolean;
  setShowPlayground: (s: boolean) => void;
  playgroundCode: string;
  setPlaygroundCode: (c: string) => void;
  globalAccent: ColorAccent;
  setGlobalAccent: (a: ColorAccent) => void;
  globalTab: TechFramework;
  setGlobalTab: (t: TechFramework) => void;
  filteredComponents: typeof COMPONENTS;
  getCategoryIcon: (name: string) => React.ReactNode;
  copyToClipboard: (text: string, compId: string) => void;
  downloadCodeFile: (text: string, filename: string, type: TechFramework) => void;
  highlightCode: (code: string, type: TechFramework) => React.ReactNode;
  getSizingClass: (size: PreviewSize) => string;
  ACCENTS: { id: ColorAccent; name: string; class: string; glow: string }[];
  FRAMEWORKS: { id: TechFramework; name: string; logo: string }[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'all';

  const setSearchQuery = useCallback((q: string) => {
    setSearchParams((prev: URLSearchParams) => {
      const next = new URLSearchParams(prev);
      if (q) next.set('q', q);
      else next.delete('q');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setSelectedCategory = useCallback((c: string) => {
    setSearchParams((prev: URLSearchParams) => {
      const next = new URLSearchParams(prev);
      if (c && c !== 'all') next.set('category', c);
      else next.delete('category');
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  const [activeTabs, setActiveTabs] = useState<Record<string, TechFramework>>({});
  const [accentColors, setAccentColors] = useState<Record<string, ColorAccent>>({});
  const [previewSizes, setPreviewSizes] = useState<Record<string, PreviewSize>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showPlayground, setShowPlayground] = useState(false);
  const [playgroundCode, setPlaygroundCode] = useState(`<div class="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl text-center max-w-sm">
  <h3 class="text-lg font-bold mb-2">My Contributed UI</h3>
  <p class="text-xs text-white/80 leading-relaxed mb-4">Paste your own Tailwind CSS markup here to live preview your open-source component PR!</p>
  <button class="px-4 py-2 rounded-xl bg-white text-violet-600 text-xs font-bold hover:scale-105 active:scale-95 transition-all">Interactive Action</button>
</div>`);
  const [globalAccent, setGlobalAccent] = useState<ColorAccent>('violet');
  const [globalTab, setGlobalTab] = useState<TechFramework>('react');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const getCategoryIcon = (iconName: string) => {
    const classStr = "w-4.5 h-4.5 shrink-0";
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={classStr} />;
      case 'Layout': return <Layout className={classStr} />;
      case 'FileText': return <FileText className={classStr} />;
      case 'Compass': return <Compass className={classStr} />;
      case 'Bell': return <Bell className={classStr} />;
      default: return <Sparkles className={classStr} />;
    }
  };

  const filteredComponents = useMemo(() => {
    return COMPONENTS.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            comp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = (text: string, compId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(compId);
    setTimeout(() => { setCopiedId(null); }, 1800);
  };

  const downloadCodeFile = (text: string, filename: string, type: TechFramework) => {
    let ext = 'tsx';
    if (type === 'html') ext = 'html';
    else if (type === 'vue') ext = 'vue';
    else if (type === 'angular') ext = 'ts';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const highlightCode = (code: string, type: TechFramework) => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const strings: string[] = [];
    highlighted = highlighted.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, str) => {
      strings.push(`<span class="text-[#10b981]">"${str}"</span>`);
      return `STR_PLACEHOLDER_${strings.length - 1}`;
    });
    highlighted = highlighted.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, str) => {
      strings.push(`<span class="text-[#10b981]">'${str}'</span>`);
      return `STR_PLACEHOLDER_${strings.length - 1}`;
    });

    if (type === 'html') {
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      highlighted = highlighted.replace(/(class=)/g, '<span class="text-[#3b82f6]">$1</span>');
    } else if (type === 'react' || type === 'nextjs') {
      highlighted = highlighted.replace(/\b(import|export|default|const|let|var|return|from|interface|type|class|function|useRouter|usePathname|useState|useEffect)\b/g, '<span class="text-[#a78bfa]">$1</span>');
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;|\/&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      highlighted = highlighted.replace(/(className=)/g, '<span class="text-[#3b82f6]">$1</span>');
    } else if (type === 'vue') {
      highlighted = highlighted.replace(/\b(script|template|setup|defineProps|defineEmits|ref|v-for|v-if)\b/g, '<span class="text-[#f59e0b]">$1</span>');
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z5-9:-]+)(\s|&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      highlighted = highlighted.replace(/(class=)/g, '<span class="text-[#3b82f6]">$1</span>');
      highlighted = highlighted.replace(/(@[a-zA-Z0-9]+|:[a-zA-Z0-9]+)=/g, '<span class="text-[#a78bfa]">$1</span>=');
    } else if (type === 'angular') {
      highlighted = highlighted.replace(/(@Component|@Input|@Output|EventEmitter)/g, '<span class="text-[#f59e0b]">$1</span>');
      highlighted = highlighted.replace(/\b(export|class|string|number|boolean|new|import|from)\b/g, '<span class="text-[#a78bfa]">$1</span>');
      highlighted = highlighted.replace(/(selector|template|styles):/g, '<span class="text-[#3b82f6]">$1</span>:');
      highlighted = highlighted.replace(/`([^`]*)`/g, '<span class="text-[#10b981]">\`$1\`</span>');
    }

    strings.forEach((strHtml, index) => {
      highlighted = highlighted.replace(`STR_PLACEHOLDER_${index}`, strHtml);
    });

    return (
      <code className="text-xs sm:text-[13px] leading-relaxed block overflow-x-auto select-text font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
    );
  };

  const getSizingClass = (size: PreviewSize) => {
    switch (size) {
      case 'mobile': return 'max-w-[340px]';
      case 'tablet': return 'max-w-[520px]';
      default: return 'max-w-full';
    }
  };

  const ACCENTS = [
    { id: 'violet' as ColorAccent, name: 'Violet', class: 'bg-violet-500', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.5)]' },
    { id: 'emerald' as ColorAccent, name: 'Emerald', class: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    { id: 'rose' as ColorAccent, name: 'Rose', class: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
    { id: 'blue' as ColorAccent, name: 'Blue', class: 'bg-blue-500', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
    { id: 'amber' as ColorAccent, name: 'Amber', class: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  ];

  const FRAMEWORKS = [
    { id: 'html' as TechFramework, name: 'HTML+CSS', logo: '⚡' },
    { id: 'react' as TechFramework, name: 'React', logo: '⚛️' },
    { id: 'nextjs' as TechFramework, name: 'Next.js', logo: '▲' },
    { id: 'vue' as TechFramework, name: 'Vue.js', logo: '🟢' },
    { id: 'angular' as TechFramework, name: 'Angular', logo: '🔴' },
  ];

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      activeTabs, setActiveTabs,
      accentColors, setAccentColors,
      previewSizes, setPreviewSizes,
      copiedId, setCopiedId,
      darkMode, setDarkMode,
      showPlayground, setShowPlayground,
      playgroundCode, setPlaygroundCode,
      globalAccent, setGlobalAccent,
      globalTab, setGlobalTab,
      filteredComponents,
      getCategoryIcon,
      copyToClipboard,
      downloadCodeFile,
      highlightCode,
      getSizingClass,
      ACCENTS, FRAMEWORKS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
