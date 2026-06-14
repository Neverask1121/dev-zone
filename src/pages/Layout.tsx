import { Outlet, Link } from 'react-router-dom';
import { Sun, Moon, Sliders, X, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const {
    darkMode, setDarkMode, globalAccent, setGlobalAccent,
    globalTab, setGlobalTab, showPlayground, setShowPlayground,
    playgroundCode, setPlaygroundCode, ACCENTS, FRAMEWORKS,
  } = useAppContext();

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-[#06060a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      <div className="absolute inset-0 z-0 pointer-events-none mesh-bg"></div>

      <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8 max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl relative">

          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg glow-primary">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent dark:block hidden">FreeUI</span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:hidden block">FreeUI</span>
              <span className="text-[10px] block font-mono text-indigo-400/80 -mt-1 font-bold">V1.2.0 OPEN-SOURCE</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
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
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/5 hover:bg-black/30 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

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

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-[#040407]/90 py-8 text-center text-xs text-slate-500 font-semibold tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-500">⚡</span>
            <span>FreeUI - Open Source Component Portal.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Developers & Designers worldwide.</span>
          </div>
        </div>
      </footer>

      {showPlayground && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl h-[85vh] p-6 rounded-3xl bg-slate-900/95 border border-white/10 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col gap-4 animate-scale-up">

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

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

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

              <div className="flex flex-col gap-2 min-h-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <span>Real-Time Output Preview</span>
                </div>
                <div className="flex-1 rounded-2xl bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950 border border-slate-800/80 flex items-center justify-center p-6 relative overflow-auto">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                  <div
                    className="relative z-10 w-full flex justify-center"
                    dangerouslySetInnerHTML={{ __html: playgroundCode }}
                  />
                </div>
              </div>

            </div>

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
  );
}
