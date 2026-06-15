import React from 'react';

const componentModules = import.meta.glob('../registry/**/*.tsx', { eager: true });
const htmlModules = import.meta.glob('../components/**/*.html', { query: '?raw', eager: true });

interface InteractivePreviewProps {
  id: string;
  color: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}

const splitHtmlAndCss = (rawContent: string) => {
  const styleMatch = rawContent.match(/<style>([\s\S]*?)<\/style>/i);
  const css = styleMatch ? styleMatch[1].trim() : '';
  const html = rawContent.replace(/<style>[\s\S]*?<\/style>/gi, '').trim();
  return { html, css };
};

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({ id, color }) => {
  const cleanId = id.toLowerCase();

  // If this is an HTML component card
  if (cleanId.startsWith('html-')) {
    const componentName = cleanId.replace('html-', '');
    const sortedHtmlKeys = Object.keys(htmlModules).sort();
    const pathKey = sortedHtmlKeys.find(key => {
      const filename = key.split('/').pop()?.replace('.html', '').toLowerCase() || '';
      return filename === componentName;
    });

    if (pathKey) {
      const rawContent = (htmlModules[pathKey] as any)?.default || '';
      const { html, css } = splitHtmlAndCss(rawContent);
      const useTailwind = rawContent.includes('tailwind') || rawContent.includes('class=') || rawContent.includes('className=');

      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${useTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
            <style>
              body {
                margin: 0;
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: transparent;
                box-sizing: border-box;
                color-scheme: dark light;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                overflow: hidden;
              }
              ${css}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      return (
        <iframe
          srcDoc={srcDoc}
          title={id}
          className="w-full border-0 transition-all duration-300"
          style={{ minHeight: '160px', height: '100%', background: 'transparent' }}
          sandbox="allow-scripts"
        />
      );
    }
  }

  // React component resolver
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
