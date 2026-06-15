import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Terminal, Laptop, Tablet, Smartphone, Copy, Check } from 'lucide-react';
import { ALL_COMPONENTS as COMPONENTS } from '../data/components';
import { InteractivePreview } from '../components/InteractivePreview';
import { useAppContext } from '../context/AppContext';

export default function ComponentDetailPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const {
    activeTabs, setActiveTabs,
    previewSizes, setPreviewSizes, copiedId,
    globalTab,
    copyToClipboard, downloadCodeFile,
    highlightCode, getSizingClass, FRAMEWORKS,
  } = useAppContext();

  const comp = COMPONENTS.find(c => c.id === componentId);

  if (!comp) {
    return (
      <div className="glass p-12 rounded-3xl text-center shadow-sm max-w-lg mx-auto mt-12">
        <div className="text-lg font-bold text-black mb-2 font-mono">Component Not Found</div>
        <p className="text-sm text-slate-500 mb-6 font-mono">The component "{componentId}" does not exist in the registry.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </div>
    );
  }

  const compActiveTab = activeTabs[comp.id] || globalTab;
  const compSize = previewSizes[comp.id] || 'desktop';
  const activeCode = comp.code[compActiveTab];

  return (
    <div className="max-w-5xl mx-auto py-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-black font-semibold tracking-wide transition-colors mb-6 font-mono no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Components
      </Link>

      <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Top minimal ornament */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-black"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h2 className="text-lg md:text-xl font-bold tracking-wide text-black uppercase font-mono">{comp.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 uppercase tracking-wide font-mono shrink-0">
                {comp.category}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl font-mono">{comp.description}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono">
            {/* Viewport Sizing Controls */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {(['desktop', 'tablet', 'mobile'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setPreviewSizes(prev => ({ ...prev, [comp.id]: size }))}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${compSize === size ? 'bg-black text-white' : 'text-slate-400 hover:text-black hover:bg-slate-100'}`}
                  title={`${size.toUpperCase()} Preview`}
                >
                  {size === 'desktop' ? <Laptop className="w-3.5 h-3.5" /> : size === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          {/* Live Interactive Preview Box */}
          <div className="xl:col-span-5 flex flex-col gap-3 min-h-[300px]">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              <Eye className="w-3 h-3 text-black" />
              <span>Live Interactive Preview</span>
            </div>
            <div className="flex-1 glass rounded-2xl flex items-center justify-center p-6 bg-slate-50 border border-slate-200 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
              <div className={`w-full flex items-center justify-center transition-all duration-500 relative z-10 ${getSizingClass(compSize)}`}>
                <InteractivePreview id={comp.id} color="violet" />
              </div>
            </div>
          </div>

          {/* Source Code Panel */}
          <div className="xl:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                <Terminal className="w-3.5 h-3.5 text-black" />
                <span>Source Code Registry</span>
              </div>

              <div className="flex items-center gap-1 font-mono">
                {FRAMEWORKS.map(fw => (
                  <button
                    key={fw.id}
                    onClick={() => setActiveTabs(prev => ({ ...prev, [comp.id]: fw.id }))}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all cursor-pointer ${compActiveTab === fw.id ? 'bg-black text-white' : 'text-slate-500 hover:text-black hover:bg-slate-50'}`}
                  >
                    {fw.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative glass bg-[#fafafa]/90 border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm overflow-hidden min-h-[250px] flex flex-col">
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20 font-mono">
                <button
                  onClick={() => copyToClipboard(activeCode, comp.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-black transition-all text-xs font-semibold tracking-wide active:scale-95 cursor-pointer"
                >
                  {copiedId === comp.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-black transition-all text-xs font-semibold tracking-wide active:scale-95 cursor-pointer"
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
                <span className="text-[10px] font-mono text-slate-400 font-bold ml-2.5 uppercase tracking-widest">
                  {compActiveTab}.tsx
                </span>
              </div>

              <div className="flex-1 overflow-auto max-h-[300px] pr-2">
                <pre className="font-mono text-slate-800 whitespace-pre scrollbar-thin">
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
