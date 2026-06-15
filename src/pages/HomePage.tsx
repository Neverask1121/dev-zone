import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Layers, Sparkles, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '../data/components';
import { InteractivePreview } from '../components/InteractivePreview';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const {
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    globalTab, filteredComponents, getCategoryIcon
  } = useAppContext();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 200;

  // Reset page to 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredComponents.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedComponents = filteredComponents.slice(startIndex, startIndex + pageSize);

  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="text-center py-12 md:py-16 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          Recursive Typographic UI Hub
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-black uppercase font-mono">
          Minimalist Component Library
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-mono">
          A premium directory of copy-pasteable UI components styled in Tailwind CSS, HTML/CSS, React, Vue, Next.js, and Angular. Clean, monochrome, and light-mode locked.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto relative group mb-8">
          <div className="absolute -inset-0.5 bg-black rounded-xl opacity-10 group-hover:opacity-20 transition duration-300"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-4.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search components (e.g. Buttons, Cards, Inputs, Loaders...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-black placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm font-mono text-xs"
            />
          </div>
        </div>

        {/* Horizontal Category Nav */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto pb-4 border-b border-slate-100 font-mono">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${selectedCategory === 'all' ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black hover:bg-slate-50 border border-slate-200 bg-white'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{filteredComponents.length}</span>
          </button>

          {CATEGORIES.map(cat => {
            const count = filteredComponents.filter(c => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${isSelected ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black hover:bg-slate-50 border border-slate-200 bg-white'}`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* COMPONENT EXPLORER */}
      <section className="py-4">
        
        {/* COMPONENTS GRID SECTION */}
        <div className="flex flex-col gap-8 w-full">
          
          {filteredComponents.length === 0 ? (
            <div className="glass p-12 rounded-3xl text-center shadow-sm max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black mb-2 font-mono">No Components Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 font-mono">
                We couldn't find any components matching "{searchQuery}". Try adjusting your keywords or category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-black text-white font-semibold text-xs font-mono transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Components Cards Grid - 4 Columns Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedComponents.map((comp) => {
                  return (
                    <Link
                      key={comp.id}
                      to={`/component/${comp.id}`}
                      className="block no-underline group hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="glass rounded-2xl p-5 h-full flex flex-col justify-between hover:border-black transition-colors duration-300">
                        {/* Box Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                          <h3 className="text-xs font-bold text-black truncate group-hover:text-slate-600 transition-colors uppercase font-mono">
                            {comp.name}
                          </h3>
                          <span className="text-[9px] font-bold font-mono px-2 py-0.5 border border-slate-200 text-slate-500 rounded-full bg-slate-50 shrink-0 capitalize">
                            {comp.category}
                          </span>
                        </div>

                        {/* Interactive Preview Container */}
                        <div className="flex-1 min-h-[140px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative">
                          {/* Dot-matrix style detail ornament */}
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                          <div className="w-full h-full scale-[0.9] pointer-events-none">
                            <InteractivePreview id={comp.id} color="violet" />
                          </div>
                        </div>

                        {/* Box Footer link */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 group-hover:text-black transition-colors">
                          <span>View Code & Details</span>
                          <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* PAGINATION NAVIGATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-slate-200 pt-8 mt-4 font-mono">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${currentPage === 1 ? 'border-slate-100 text-slate-300 pointer-events-none' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  {pageNumbers.map(num => {
                    const isActive = currentPage === num;
                    return (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${isActive ? 'bg-black border-black text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {num}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${currentPage === totalPages ? 'border-slate-100 text-slate-300 pointer-events-none' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </section>
    </>
  );
}
