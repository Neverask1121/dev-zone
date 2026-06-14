import { Search, Layers, Code, Layout as LayoutIcon, Sparkles, Eye, Terminal, Laptop, Tablet, Smartphone, Copy, Check } from 'lucide-react';
import { CATEGORIES, ALL_COMPONENTS as COMPONENTS } from '../data/components';
import { InteractivePreview } from '../components/InteractivePreview';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const {
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    activeTabs, setActiveTabs, accentColors, setAccentColors,
    previewSizes, setPreviewSizes, copiedId,
    globalAccent, globalTab, filteredComponents,
    getCategoryIcon, copyToClipboard, downloadCodeFile,
    highlightCode, getSizingClass, ACCENTS, FRAMEWORKS,
  } = useAppContext();

  return (
    <>
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
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-8">

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

        <div className="lg:col-span-9 flex flex-col gap-10">

          {filteredComponents.length === 0 ? (
            <div className="glass p-12 rounded-3xl text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Components Found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                We couldn't find any components matching "{searchQuery}". Try searching for other terms like "button", "card", "alert", or reset your category search.
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
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-violet-600/40 to-transparent"></div>

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

                    <div className="flex items-center gap-4 shrink-0">

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

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    <div className="xl:col-span-5 flex flex-col gap-3 min-h-[300px]">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        <Eye className="w-3 h-3 text-indigo-400" />
                        <span>Live Interactive Preview</span>
                      </div>
                      <div className="flex-1 glass rounded-2xl flex items-center justify-center p-6 bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                        <div className={`w-full flex items-center justify-center transition-all duration-500 ${getSizingClass(compSize)}`}>
                          <InteractivePreview id={comp.id} color={compAccent} />
                        </div>
                      </div>
                    </div>

                    <div className="xl:col-span-7 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Source Code Registry</span>
                        </div>

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

                      <div className="relative glass bg-[#050508]/90 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-2xl overflow-hidden min-h-[250px] flex flex-col">

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

                        <div className="flex items-center gap-1.5 -mt-1 mb-4 select-none">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] opacity-80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] opacity-80" />
                          <span className="text-[10px] font-mono text-slate-500 font-bold ml-2.5 uppercase tracking-widest">
                            {compActiveTab}.tsx
                          </span>
                        </div>

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
      <section className="py-16 md:py-24 border-t border-slate-200 dark:border-slate-800 mt-16 max-w-5xl mx-auto">

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
              icon: <LayoutIcon className="w-5 h-5 text-indigo-400" />
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
    </>
  );
}
