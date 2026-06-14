import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Terminal, Laptop, Tablet, Smartphone, Copy, Check } from 'lucide-react';
import { ALL_COMPONENTS as COMPONENTS } from '../data/components';
import { InteractivePreview } from '../components/InteractivePreview';
import { useAppContext } from '../context/AppContext';

export default function ComponentDetailPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const {
    activeTabs, setActiveTabs, accentColors, setAccentColors,
    previewSizes, setPreviewSizes, copiedId,
    globalAccent, globalTab,
    copyToClipboard, downloadCodeFile,
    highlightCode, getSizingClass, ACCENTS, FRAMEWORKS,
  } = useAppContext();

  const comp = COMPONENTS.find(c => c.id === componentId);

  if (!comp) {
    return (
      <div className="glass p-12 rounded-3xl text-center shadow-xl max-w-lg mx-auto mt-12">
        <div className="text-lg font-bold text-white mb-2">Component Not Found</div>
        <p className="text-sm text-slate-400 mb-6">The component "{componentId}" does not exist in the registry.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </div>
    );
  }

  const compActiveTab = activeTabs[comp.id] || globalTab;
  const compAccent = accentColors[comp.id] || globalAccent;
  const compSize = previewSizes[comp.id] || 'desktop';
  const activeCode = comp.code[compActiveTab];

  return (
    <div className="max-w-4xl mx-auto py-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white font-semibold tracking-wide transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Components
      </Link>

      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
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
    </div>
  );
}
