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
// This system scans /src/registry/ using Vite glob features to dynamically resolve UI components on the fly!
// Contributors can drop a single TSX file into /src/registry/ and it automatically populates the dashboard.

const rawModules = import.meta.glob('../registry/**/*.tsx', { query: '?raw', eager: true });

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

export const getRegistryComponents = (): UIComponent[] => {
  const registryComponents: UIComponent[] = [];

  Object.keys(rawModules).forEach((path) => {
    // Extract filename (e.g., "../registry/GlowPremiumButton.tsx" -> "GlowPremiumButton")
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'Component';
    
    // Capitalize filename to show as component name (e.g., "GlowPremiumButton" -> "Glow Premium Button")
    const formattedName = filename
      .replace(/([A-Z])/g, ' $1') // Insert spaces before capital letters
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();

    // Dynamically assign IDs with support for comments and legacy fallbacks
    const rawCode = (rawModules[path] as any)?.default || '';
    let id = `reg-${filename.toLowerCase()}`;
    
    const idMatch = rawCode.match(/\/\/\s*id:\s*([^\r\n]+)/i);
    if (idMatch && idMatch[1]) {
      id = idMatch[1].trim();
    } else {
      // Legacy routes matching
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

    const categoryMatch = rawCode.match(/\/\/\s*category:\s*([^\r\n]+)/i);
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

    const descMatch = rawCode.match(/\/\/\s*description:\s*([^\r\n]+)/i);
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

// Merged components list served as raw and legacy exports
export const COMPONENTS: UIComponent[] = getRegistryComponents();
export const ALL_COMPONENTS: UIComponent[] = COMPONENTS;
