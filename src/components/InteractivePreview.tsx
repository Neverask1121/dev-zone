import React from 'react';

const componentModules = import.meta.glob('../registry/**/*.tsx', { eager: true });

interface InteractivePreviewProps {
  id: string;
  color: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({ id, color }) => {
  const cleanId = id.toLowerCase();
  
  // Sort keys before searching to guarantee a deterministic resolution order.
  // Object.keys() on a Vite glob result has no guaranteed order across different
  // bundler runs, OS locales, or file systems. Sorting alphabetically ensures
  // the same component is always resolved regardless of build environment.
  const sortedModuleKeys = Object.keys(componentModules).sort();
  const pathKey = sortedModuleKeys.find(key => {
    const filename = key.split('/').pop()?.replace('.tsx', '').toLowerCase() || '';
    if (filename === cleanId.replace('reg-', '')) return true;
    if (cleanId === 'btn-glow' && filename === 'glowpremiumbutton') return true;
    if (cleanId === 'btn-border' && filename === 'gradientborderbutton') return true;
    if (cleanId === 'card-glass' && filename === 'glassmorphicglasscard') return true;
    if (cleanId === 'card-profile' && filename === 'sleekprofilecard') return true;
    if (cleanId === 'input-floating' && filename === 'floatinglabelinput') return true;
    if (cleanId === 'nav-glass' && filename === 'floatingglassnavbar') return true;
    if (cleanId === 'alert-neon' && filename === 'glowneonalert') return true;
    if (cleanId === 'feedback-loader' && filename === 'futuristicglowspinner') return true;
    return false;
  });

  if (pathKey) {
    const module: any = componentModules[pathKey];
    const ComponentToRender = module?.default || Object.values(module)[0];
    if (ComponentToRender && typeof ComponentToRender === 'function') {
      return (
        <div className="flex items-center justify-center w-full min-h-[100px] p-4 transition-all duration-300">
          <ComponentToRender color={color} />
        </div>
      );
    }
  }

  return (
    <div className="text-xs text-slate-400 font-mono p-4 text-center">
      No Preview Component Available
    </div>
  );
};
