import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Layout, 
  FileText, 
  Compass, 
  Bell, 
  Sun, 
  Moon, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sliders, 
  Eye, 
  Terminal, 
  Heart,
  Code,
  Layers,
  X
} from 'lucide-react';
import { CATEGORIES, ALL_COMPONENTS as COMPONENTS } from './data/components';
import { InteractivePreview } from './components/InteractivePreview';
import ErrorBoundary from './components/ErrorBoundary';

type TechFramework = 'html' | 'react' | 'nextjs' | 'vue' | 'angular';
type ColorAccent = 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  // debouncedQuery lags behind searchQuery by 200 ms so the expensive
  // useMemo filter only re-runs after the user pauses typing rather than
  // on every keystroke.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTabs, setActiveTabs] = useState<Record<string, TechFramework>>({});
  const [accentColors, setAccentColors] = useState<Record<string, ColorAccent>>({});
  const [previewSizes, setPreviewSizes] = useState<Record<string, 'desktop' | 'tablet' | 'mobile'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Theme state (dark mode by default)
  const [darkMode, setDarkMode] = useState(true);

  // Playground workspace state
  const [showPlayground, setShowPlayground] = useState(false);
  const [playgroundCode, setPlaygroundCode] = useState(`<div class="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl text-center max-w-sm">
  <h3 class="text-lg font-bold mb-2">My Contributed UI</h3>
  <p class="text-xs text-white/80 leading-relaxed mb-4">Paste your own Tailwind CSS markup here to live preview your open-source component PR!</p>
  <button class="px-4 py-2 rounded-xl bg-white text-violet-600 text-xs font-bold hover:scale-105 active:scale-95 transition-all">Interactive Action</button>
</div>`);

  // Sync dark class on body
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

  // Keep debouncedQuery in sync with searchQuery with a 200 ms delay.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Global settings synced to all
  const [globalAccent, setGlobalAccent] = useState<ColorAccent>('violet');
  const [globalTab, setGlobalTab] = useState<TechFramework>('react');

  // Categories helper
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

  // Filter components using the debounced query to avoid re-running on every keystroke.
  const filteredComponents = useMemo(() => {
    return COMPONENTS.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                            comp.description.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedQuery, selectedCategory]);

  const copyToClipboard = (text: string, compId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(compId);
    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
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

  // Custom high-speed compiler token highlighter for VS Code vibes
  const highlightCode = (code: string, type: TechFramework) => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Helper: HTML-encode characters that have special meaning in HTML.
    // Applied to the raw string content (captured before the main pass) so
    // that user-supplied values cannot inject markup into the span wrapper.
    const encodeHtml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 1. Temporarily extract string literals to avoid double-highlighting inside HTML attributes
    const strings: string[] = [];
    highlighted = highlighted.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, str) => {
      strings.push(`<span class="text-[#10b981]">"${encodeHtml(str)}"</span>`);
      return `⚡⚡STR_PLACEHOLDER_${strings.length - 1}⚡⚡`;
    });
    highlighted = highlighted.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, str) => {
      strings.push(`<span class="text-[#10b981]">'${encodeHtml(str)}'</span>`);
      return `⚡⚡STR_PLACEHOLDER_${strings.length - 1}⚡⚡`;
    });

    if (type === 'html') {
      // Tags in HTML
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      // Class and properties
      highlighted = highlighted.replace(/(class=)/g, '<span class="text-[#3b82f6]">$1</span>');
    } else if (type === 'react' || type === 'nextjs') {
      // TSX/JSX keywords
      highlighted = highlighted.replace(/\b(import|export|default|const|let|var|return|from|interface|type|class|function|useRouter|usePathname|useState|useEffect)\b/g, '<span class="text-[#a78bfa]">$1</span>');
      // Tags
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;|\/&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      // className
      highlighted = highlighted.replace(/(className=)/g, '<span class="text-[#3b82f6]">$1</span>');
    } else if (type === 'vue') {
      // Vue tags & keywords
      highlighted = highlighted.replace(/\b(script|template|setup|defineProps|defineEmits|ref|v-for|v-if)\b/g, '<span class="text-[#f59e0b]">$1</span>');
      highlighted = highlighted.replace(/(&lt;\/?[a-zA-Z5-9:-]+)(\s|&gt;)/g, '<span class="text-[#f43f5e]">$1</span>$2');
      highlighted = highlighted.replace(/(class=)/g, '<span class="text-[#3b82f6]">$1</span>');
      highlighted = highlighted.replace(/(@[a-zA-Z0-9]+|:[a-zA-Z0-9]+)=/g, '<span class="text-[#a78bfa]">$1</span>=');
    } else if (type === 'angular') {
      // Angular directives and class components
      highlighted = highlighted.replace(/(@Component|@Input|@Output|EventEmitter)/g, '<span class="text-[#f59e0b]">$1</span>');
      highlighted = highlighted.replace(/\b(export|class|string|number|boolean|new|import|from)\b/g, '<span class="text-[#a78bfa]">$1</span>');
      highlighted = highlighted.replace(/(selector|template|styles):/g, '<span class="text-[#3b82f6]">$1</span>:');
      highlighted = highlighted.replace(/`([^`]*)`/g, '<span class="text-[#10b981]">\`$1\`</span>');
    }

    // 2. Restore string literals securely
    strings.forEach((strHtml, index) => {
      highlighted = highlighted.replace(`⚡⚡STR_PLACEHOLDER_${index}⚡⚡`, strHtml);
    });

    return (
      <code className="text-xs sm:text-[13px] leading-relaxed block overflow-x-auto select-text font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
    );
  };

  const getSizingClass = (size: 'desktop' | 'tablet' | 'mobile') => {
    switch (size) {
      case 'mobile': return 'max-w-[340px]';
      case 'tablet': return 'max-w-[520px]';
      default: return 'max-w-full';
    }
  };

  const ACCENTS: { id: ColorAccent; name: string; class: string; glow: string }[] = [
    { id: 'violet', name: 'Violet', class: 'bg-violet-500', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.5)]' },
    { id: 'emerald', name: 'Emerald', class: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    { id: 'rose', name: 'Rose', class: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-500', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
    { id: 'amber', name: 'Amber', class: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  ];

  const FRAMEWORKS: { id: TechFramework; name: string; logo: string }[] = [
    { id: 'html', name: 'HTML+CSS', logo: '⚡' },
    { id: 'react', name: 'React', logo: '⚛️' },
    { id: 'nextjs', name: 'Next.js', logo: '▲' },
    { id: 'vue', name: 'Vue.js', logo: '🟢' },
    { id: 'angular', name: 'Angular', logo: '🔴' }
  ];

  const FOOTER_LINKS = [
    { label: 'Components', href: '#components' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Contribute', href: 'https://github.com/singhtrivendra/dev-zone', external: true },
    { label: 'Issue #132', href: 'https://github.com/singhtrivendra/dev-zone/issues/132', external: true }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-[#06060a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none mesh-bg"></div>

      {/* Floating Header */}
      <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8 max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl relative">
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg glow-primary">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent dark:block hidden">FreeUI</span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:hidden block">FreeUI</span>
              <span className="text-[10px] block font-mono text-indigo-400/80 -mt-1 font-bold">V1.2.0 OPEN-SOURCE</span>
            </div>
          </div>

          {/* Global Controls */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Accent Control */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 dark:bg-white/5 border border-white/5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Global Accent:</span>
              <div className="flex items-center gap-1.5">
                {ACCENTS.map(accent => (
                  <button
                    key={accent.id}
                    onClick={() => setGlobalAccent(accent.id)}
                    className={`w-3.5 h-3.5 rounded-full ${accent.class} transition-all duration-300 ${globalAccent === accent.id ? `scale-125 ring-2 ring-white ${accent.glow}` : 'hover:scale-110 opacity-70'}`}
                    title={accent.name}
                  />
                ))}
              </div>
            </div>

            {/* Global Framework Control */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/20 dark:bg-white/5 border border-white/5">
              {FRAMEWORKS.map(fw => (
                <button
                  key={fw.id}
                  onClick={() => setGlobalTab(fw.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${globalTab === fw.id ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <span className="mr-1 text-[10px]">{fw.logo}</span>
                  {fw.name}
                </button>
              ))}
            </div>

          </div>

          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/5 hover:bg-black/30 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

            {/* GitHub link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/5 hover:bg-black/30 dark:hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold tracking-wide"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </a>

            <button 
              onClick={() => setShowPlayground(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Submit UI / Playground
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center py-12 md:py-20 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            Vibrant, Ready-to-Use UI Elements
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900 dark:text-white">
            Supercharge Your Interface in{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Record Time
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            A premium collection of high-fidelity responsive UI components designed with CSS, Tailwind, React, Vue, Angular, and Next.js. Simply pick your stack, customize color accents, and paste directly into your project directory.
          </p>

          {/* Core Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { value: '50+', label: 'Design Tokens' },
              { value: '5+', label: 'Tech Frameworks' },
              { value: '100%', label: 'Free & Open Source' },
              { value: '∞', label: 'Endless Variations' }
            ].map((stat, i) => (
              <div key={i} className="glass p-4 rounded-xl text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                <div className="text-xl sm:text-2xl font-bold text-white dark:block hidden">{stat.value}</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-950 dark:hidden block">{stat.value}</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Integrated Search Bar with tags */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search components (e.g. Buttons, Cards, Forms, Glassmorphic...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all shadow-xl font-medium text-sm"
              />
            </div>
          </div>

        </section>

        {/* COMPONENT EXPLORER */}
        <section id="components" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-8">
          
          {/* SIDEBAR CATEGORIES */}
          <div className="lg:col-span-3 sticky top-28 z-40">
            <div className="glass p-5 rounded-2xl shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Component Types</h3>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold tracking-wide flex items-center gap-3 transition-all ${selectedCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>All Components</span>
                    <span className="ml-auto text-[10px] bg-black/20 px-2 py-0.5 rounded-full text-white/80">{COMPONENTS.length}</span>
                  </button>

                  {CATEGORIES.map(cat => {
                    const count = COMPONENTS.filter(c => c.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-bold tracking-wide flex items-center gap-3 transition-all ${selectedCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                      >
                        {getCategoryIcon(cat.icon)}
                        <span>{cat.name}</span>
                        <span className="ml-auto text-[10px] bg-black/20 px-2 py-0.5 rounded-full text-white/80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Pro Tip</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Customize the preview sizing (Desktop, Tablet, Mobile) and select your framework. Copy-paste code with full Tailwind configuration.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN CONTAINER: COMPONENTS GRID */}
          <div className="lg:col-span-9 flex flex-col gap-10">
            
            {filteredComponents.length === 0 ? (
              <div className="glass p-12 rounded-3xl text-center shadow-xl">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Components Found</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  We couldn't find any components matching "{debouncedQuery}". Try searching for other terms like "button", "card", "alert", or reset your category search.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredComponents.map((comp) => {
                const compActiveTab = activeTabs[comp.id] || globalTab;
                const compAccent = accentColors[comp.id] || globalAccent;
                const compSize = previewSizes[comp.id] || 'desktop';
                
                const activeCode = comp.code[compActiveTab];

                return (
                  <div
                    key={comp.id}
                    className="glass rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group flex flex-col gap-6"
                  >
                    {/* Top Glow Bar */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-violet-600/40 to-transparent"></div>

                    {/* COMPONENT DESCRIPTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-250 dark:border-slate-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h2 className="text-lg md:text-xl font-bold tracking-wide text-white dark:block hidden">{comp.name}</h2>
                          <h2 className="text-lg md:text-xl font-bold tracking-wide text-slate-950 dark:hidden block">{comp.name}</h2>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/25 dark:bg-white/5 border border-white/5 text-indigo-400 uppercase tracking-wide font-mono">
                            {comp.category}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-2xl">{comp.description}</p>
                      </div>

                      {/* INDIVIDUAL COMPONENT CONTROLS (Size & Color) */}
                      <div className="flex items-center gap-4 shrink-0">
                        
                        {/* Sizings */}
                        <div className="flex items-center gap-1 bg-black/20 dark:bg-white/5 p-1 rounded-xl border border-white/5">
                          {(['desktop', 'tablet', 'mobile'] as const).map(size => (
                            <button
                              key={size}
                              onClick={() => setPreviewSizes(prev => ({ ...prev, [comp.id]: size }))}
                              className={`p-1.5 rounded-lg transition-all ${compSize === size ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                              title={`${size.toUpperCase()} Preview`}
                            >
                              {size === 'desktop' ? <Laptop className="w-3.5 h-3.5" /> : size === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>

                        {/* Colors */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/5">
                          {ACCENTS.map(accent => (
                            <button
                              key={accent.id}
                              onClick={() => setAccentColors(prev => ({ ...prev, [comp.id]: accent.id }))}
                              className={`w-3.5 h-3.5 rounded-full ${accent.class} transition-all duration-300 ${compAccent === accent.id ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-70'}`}
                              title={accent.name}
                            />
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* TWO-COLUMN GRID: PREVIEW ON LEFT, SOURCE CODE ON RIGHT */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                      
                      {/* PREVIEW CONTAINER */}
                      <div className="xl:col-span-5 flex flex-col gap-3 min-h-[300px]">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>Live Interactive Preview</span>
                        </div>
                        <div className="flex-1 glass rounded-2xl flex items-center justify-center p-6 bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300">
                          {/* Checked background pattern for high fidelity */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                          
                          <div className={`w-full flex items-center justify-center transition-all duration-500 ${getSizingClass(compSize)}`}>
                            <ErrorBoundary>
                              <InteractivePreview id={comp.id} color={compAccent} />
                            </ErrorBoundary>
                          </div>
                        </div>
                      </div>

                      {/* SOURCE CODE PANEL */}
                      <div className="xl:col-span-7 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Source Code Registry</span>
                          </div>
                          
                          {/* Framework Select Tabs */}
                          <div className="flex items-center gap-1">
                            {FRAMEWORKS.map(fw => (
                              <button
                                key={fw.id}
                                onClick={() => setActiveTabs(prev => ({ ...prev, [comp.id]: fw.id }))}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all ${compActiveTab === fw.id ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                              >
                                {fw.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Code Display Screen */}
                        <div className="relative glass bg-[#050508]/90 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-2xl overflow-hidden min-h-[250px] flex flex-col">
                          
                          {/* Copy and Download trigger absolute action buttons */}
                          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                            <button
                              onClick={() => copyToClipboard(activeCode, comp.id)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold tracking-wide active:scale-95 cursor-pointer"
                            >
                              {copiedId === comp.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => downloadCodeFile(activeCode, comp.name, compActiveTab)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold tracking-wide active:scale-95 cursor-pointer"
                              title="Download code as file"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>Download</span>
                            </button>
                          </div>

                          {/* VS Code title bar controls */}
                          <div className="flex items-center gap-1.5 -mt-1 mb-4 select-none">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] opacity-80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] opacity-80" />
                            <span className="text-[10px] font-mono text-slate-500 font-bold ml-2.5 uppercase tracking-widest">
                              {compActiveTab}.tsx
                            </span>
                          </div>

                          {/* Code Display Area */}
                          <div className="flex-1 overflow-auto max-h-[300px] pr-2">
                            <pre className="font-mono text-slate-300 whitespace-pre scrollbar-thin">
                              {highlightCode(activeCode, compActiveTab)}
                            </pre>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>

        </section>

        {/* FAQ / HIGHLIGHT SECTION */}
        <section id="workflow" className="py-16 md:py-24 border-t border-slate-200 dark:border-slate-800 mt-16 max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Designed for Premium Developer Workflows</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              No npm installs or complex integrations required. We give you raw, pure code powered by standard tailwindcss design systems that fit perfectly into any abstraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {[
              {
                title: 'Full Tailwind Syntax',
                desc: 'Every element uses pure tailwind utilities, making customization as easy as changing inline classes.',
                icon: <Code className="w-5 h-5 text-pink-400" />
              },
              {
                title: 'Adaptive Layouts',
                desc: 'Built with responsive containers, flexboxes, and CSS Grid to ensure clean rendering on any device dimension.',
                icon: <Layout className="w-5 h-5 text-indigo-400" />
              },
              {
                title: 'Zero Latency Integrations',
                desc: 'Copy component codes directly into HTML, React, NextJS, Vue, or Angular without installing heavy external bundles.',
                icon: <Layers className="w-5 h-5 text-emerald-400" />
              }
            ].map((card, i) => (
              <div key={i} className="glass p-6 rounded-2xl relative group">
                <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-[#040407]/95 py-8 text-xs text-slate-400 font-semibold tracking-wide" aria-label="Footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="text-indigo-500">⚡</span>
            <span>FreeUI - Open Source Component Portal.</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="rounded-lg px-2.5 py-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
            <a
              href="https://github.com/singhtrivendra/dev-zone"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit FreeUI on GitHub"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <GitBranch className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-2 text-slate-300 transition-colors hover:border-indigo-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              Top
            </button>
          </div>
        </div>
      </footer>

      {/* Live PR Playground Modal */}
      {showPlayground && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl h-[85vh] p-6 rounded-3xl bg-slate-900/95 border border-white/10 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col gap-4 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>⚡ Live Contributor PR Playground</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                    TAILWIND HTML SANDBOX
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Design, preview, and build your component live before committing a PR submission file inside the `src/registry/` folder.
                </p>
              </div>
              <button 
                onClick={() => setShowPlayground(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sandbox Workspace Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
              
              {/* Code Editor Panel */}
              <div className="flex flex-col gap-2 min-h-0">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <span>Tailwind Markup Editor</span>
                  <span className="text-indigo-400">Pure HTML+CSS compatible</span>
                </div>
                <textarea
                  value={playgroundCode}
                  onChange={(e) => setPlaygroundCode(e.target.value)}
                  className="flex-1 w-full p-4 rounded-2xl bg-black/40 border border-slate-800 text-slate-250 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent resize-none leading-relaxed overflow-y-auto"
                  placeholder="Paste your Tailwind HTML code here..."
                />
              </div>

              {/* Live Preview Panel */}
              <div className="flex flex-col gap-2 min-h-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <span>Real-Time Output Preview</span>
                </div>
                <div className="flex-1 rounded-2xl bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950 border border-slate-800/80 flex items-center justify-center p-6 relative overflow-auto">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                  
                  {/* Render playground code inside a sandboxed iframe so that
                      any HTML or script in playgroundCode is isolated from the
                      parent document's origin and cannot access cookies, storage,
                      or the parent DOM. Tailwind CDN is included so the preview
                      renders class-based styles correctly. */}
                  <iframe
                    className="relative z-10 w-full border-0 rounded-xl"
                    style={{ minHeight: '200px', background: 'transparent' }}
                    title="Live preview"
                    sandbox="allow-scripts"
                    srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"><\/script><style>body{margin:0;padding:1rem;background:transparent;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;box-sizing:border-box}</style></head><body>${playgroundCode}</body></html>`}
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 font-medium">
                To submit: Save your code as a <code className="text-slate-450">.tsx</code> file under <code className="text-slate-450">src/registry/</code>. It registers instantly!
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const blob = new Blob([playgroundCode], { type: 'text/html;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'contributed-component.html';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                >
                  Download HTML
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(playgroundCode);
                    alert('Playground code copied to clipboard!');
                  }}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg shadow-violet-600/30"
                >
                  Copy Code
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

          </div>
        } />
        <Route path="/navigation" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/dashboard" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/workspace/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/reports/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/support/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
