export interface ComponentCode {
  html: string;
  react: string;
  nextjs: string;
  vue: string;
  angular: string;
}

export interface UIComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  code: ComponentCode;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'buttons', name: 'Buttons & Actions', icon: 'Sparkles' },
  { id: 'cards', name: 'Cards & Layouts', icon: 'Layout' },
  { id: 'inputs', name: 'Inputs & Forms', icon: 'FileText' },
  { id: 'navigation', name: 'Navigation', icon: 'Compass' },
  { id: 'feedback', name: 'Alerts & Feedback', icon: 'Bell' },
];

// --- DYNAMIC SCANNER & COMPILER SYSTEM ---
// This system scans /src/registry/ and /src/components/ using Vite glob features to dynamically resolve UI components on the fly!
// Contributors can drop a single TSX file into /src/registry/ or an HTML file under /src/components/ and it registers instantly!

const rawModules = import.meta.glob('../registry/**/*.tsx', { query: '?raw', eager: true });
const rawHtmlModules = import.meta.glob('../components/**/*.html', { query: '?raw', eager: true });

const extractHtmlFromRegistry = (reactCode: string, name: string): string => {
  const returnMatch = reactCode.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
  if (returnMatch && returnMatch[1]) {
    let html = returnMatch[1];
    html = html.replace(/className=/g, 'class=');
    html = html.replace(/\s*\/>/g, '>');
    html = html.replace(/\s*onClick=\{[^}]*\}/g, '');
    html = html.replace(/\{`([^`]*)\$\{[^}]*\}([^`]*)`\}/g, '"$1$2"');
    html = html.replace(/\{color\}/g, 'violet');
    return html.trim();
  }
  return `<button class="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold">${name}</button>`;
};

const extractVueFromRegistry = (reactCode: string, name: string): string => {
  const html = extractHtmlFromRegistry(reactCode, name);
  return `<script setup>
// Dynamically compiled Vue template for ${name}
</script>

<template>
  ${html.split('\n').join('\n  ')}
</template>`;
};

const extractAngularFromRegistry = (reactCode: string, name: string): string => {
  const html = extractHtmlFromRegistry(reactCode, name);
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name.toLowerCase()}',
  template: \`
    ${html.split('\n').join('\n    ')}
  \`
})
export class ${name}Component {}`;
};

const splitHtmlAndCss = (rawContent: string) => {
  const styleMatch = rawContent.match(/<style>([\s\S]*?)<\/style>/i);
  const css = styleMatch ? styleMatch[1].trim() : '';
  const html = rawContent.replace(/<style>[\s\S]*?<\/style>/gi, '').trim();
  return { html, css };
};

const extractUiverseMetadata = (rawContent: string) => {
  let credit = 'Uiverse.io';
  let tags: string[] = [];
  
  const commentMatch = rawContent.match(/(?:\/\*|<!--)\s*From Uiverse\.io by ([^\s-]+)(?:\s*-?\s*Tags:\s*([^*>]+))?/i);
  if (commentMatch) {
    if (commentMatch[1]) credit = `Uiverse.io (by ${commentMatch[1].trim()})`;
    if (commentMatch[2]) {
      tags = commentMatch[2]
        .replace(/-->|\*\//g, '')
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);
    }
  }
  return { credit, tags };
};

export const getRegistryComponents = (): UIComponent[] => {
  const registryComponents: UIComponent[] = [];

  Object.keys(rawModules).forEach((path) => {
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'Component';
    
    const formattedName = filename
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();

    const rawCode = (rawModules[path] as any)?.default || '';
    let id = `reg-${filename.toLowerCase()}`;
    
    const idMatch = rawCode.match(/\/\s*id:\s*([^\r\n]+)/i);
    if (idMatch && idMatch[1]) {
      id = idMatch[1].trim();
    } else {
      const lowerName = filename.toLowerCase();
      if (lowerName === 'glowpremiumbutton') id = 'btn-glow';
      else if (lowerName === 'gradientborderbutton') id = 'btn-border';
      else if (lowerName === 'glassmorphicglasscard') id = 'card-glass';
      else if (lowerName === 'sleekprofilecard') id = 'card-profile';
      else if (lowerName === 'floatinglabelinput') id = 'input-floating';
      else if (lowerName === 'floatingglassnavbar') id = 'nav-glass';
      else if (lowerName === 'glowneonalert') id = 'alert-neon';
      else if (lowerName === 'futuristicglowspinner') id = 'feedback-loader';
    }

    let category = 'buttons';
    let description = 'A modern open-source UI component dynamically registered from PR submission.';

    const categoryMatch = rawCode.match(/\/\s*category:\s*([^\r\n]+)/i);
    if (categoryMatch && categoryMatch[1]) {
      category = categoryMatch[1].trim().toLowerCase();
    } else {
      const lowerFile = filename.toLowerCase();
      if (lowerFile.includes('card') || lowerFile.includes('layout') || lowerFile.includes('grid')) {
        category = 'cards';
      } else if (lowerFile.includes('input') || lowerFile.includes('form') || lowerFile.includes('select') || lowerFile.includes('check')) {
        category = 'inputs';
      } else if (lowerFile.includes('nav') || lowerFile.includes('header') || lowerFile.includes('footer') || lowerFile.includes('menu')) {
        category = 'navigation';
      } else if (lowerFile.includes('alert') || lowerFile.includes('modal') || lowerFile.includes('toast') || lowerFile.includes('load') || lowerFile.includes('spinner')) {
        category = 'feedback';
      }
    }

    const descMatch = rawCode.match(/\/\s*description:\s*([^\r\n]+)/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim();
    }

    const code: ComponentCode = {
      html: extractHtmlFromRegistry(rawCode, filename),
      react: rawCode,
      nextjs: `'use client';\n\n` + rawCode.replace(/export const/g, 'export default').replace(/export default const/g, 'export default'),
      vue: extractVueFromRegistry(rawCode, filename),
      angular: extractAngularFromRegistry(rawCode, filename)
    };

    registryComponents.push({
      id,
      name: formattedName,
      description,
      category,
      code
    });
  });

  return registryComponents;
};

export const getHtmlComponents = (): UIComponent[] => {
  const htmlComponents: UIComponent[] = [];
  
  Object.keys(rawHtmlModules).forEach((path) => {
    const filename = path.split('/').pop()?.replace('.html', '') || 'Component';
    
    const formattedName = filename
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const rawContent = (rawHtmlModules[path] as any)?.default || '';
    const id = `html-${filename.toLowerCase()}`;
    
    let category = 'cards';
    const lowerFile = filename.toLowerCase();
    
    if (path.includes('/cards/')) {
      category = 'cards';
    } else if (lowerFile.includes('button') || lowerFile.includes('btn')) {
      category = 'buttons';
    } else if (lowerFile.includes('input') || lowerFile.includes('form') || lowerFile.includes('select') || lowerFile.includes('check') || lowerFile.includes('radio') || lowerFile.includes('toggle') || lowerFile.includes('switch')) {
      category = 'inputs';
    } else if (lowerFile.includes('nav') || lowerFile.includes('header') || lowerFile.includes('footer') || lowerFile.includes('menu') || lowerFile.includes('breadcrumb') || lowerFile.includes('tab') || lowerFile.includes('sidebar')) {
      category = 'navigation';
    } else if (lowerFile.includes('alert') || lowerFile.includes('modal') || lowerFile.includes('toast') || lowerFile.includes('load') || lowerFile.includes('spinner') || lowerFile.includes('progress') || lowerFile.includes('tooltip')) {
      category = 'feedback';
    }

    const { credit, tags } = extractUiverseMetadata(rawContent);
    let description = `A premium styled component, sourced from ${credit}.`;
    if (tags.length > 0) {
      description += ` Tags: ${tags.join(', ')}.`;
    }

    const { html, css } = splitHtmlAndCss(rawContent);
    
    const code: ComponentCode = {
      html: rawContent,
      react: `import React from 'react';\n\nexport default function Component() {\n  return (\n    <div className="relative">\n      <style>{\`\n${css.split('\n').map(line => '        ' + line).join('\n')}\n      \`}</style>\n      \n      <div dangerouslySetInnerHTML={{ __html: \`\n${html.split('\n').map(line => '        ' + line).join('\n')}\n      \` }} />\n    </div>\n  );\n}`,
      nextjs: `'use client';\nimport React from 'react';\n\nexport default function Component() {\n  return (\n    <div className="relative">\n      <style>{\`\n${css.split('\n').map(line => '        ' + line).join('\n')}\n      \`}</style>\n      \n      <div dangerouslySetInnerHTML={{ __html: \`\n${html.split('\n').map(line => '        ' + line).join('\n')}\n      \` }} />\n    </div>\n  );\n}`,
      vue: `<template>\n  <div class="component-container">\n    ${html.split('\n').join('\n    ')}\n  </div>\n</template>\n\n<style scoped>\n${css}\n</style>`,
      angular: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-dynamic-component',\n  template: \`\n    ${html.split('\n').join('\n    ')}\n  \`,\n  styles: [\`\n    ${css}\n  \`]\n})\nexport class DynamicComponent {}`
    };

    htmlComponents.push({
      id,
      name: formattedName,
      description,
      category,
      code
    });
  });

  return htmlComponents;
};

export const getCombinedComponents = (): UIComponent[] => {
  const registry = getRegistryComponents();
  const htmlComps = getHtmlComponents();
  const all = [...registry, ...htmlComps];

  const row1Names = [
    'Interactive Pricing Table',
    'Sleek Profile Card',
    'Sleek Pricing Card',
    'Aurora Iron Stone'
  ];

  const row2Names = [
    'Mist Lunar Nebula',
    'Modern Auth Form',
    'Cosmic Velvet Wave',
    'Aurora Onyx Peak'
  ];

  const row1List: UIComponent[] = [];
  row1Names.forEach(name => {
    const foundIdx = all.findIndex(c => c.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, ''));
    if (foundIdx !== -1) {
      row1List.push(all[foundIdx]);
      all.splice(foundIdx, 1);
    }
  });

  const row2List: UIComponent[] = [];
  row2Names.forEach(name => {
    const foundIdx = all.findIndex(c => c.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, ''));
    if (foundIdx !== -1) {
      row2List.push(all[foundIdx]);
      all.splice(foundIdx, 1);
    }
  });

  const remainingRegistry = all.filter(c => !c.id.startsWith('html-'));
  const remainingHtml = all.filter(c => c.id.startsWith('html-'));

  return [...row1List, ...row2List, ...remainingRegistry, ...remainingHtml];
};

export const COMPONENTS: UIComponent[] = getCombinedComponents();
export const ALL_COMPONENTS: UIComponent[] = COMPONENTS;
