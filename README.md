# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Table of Contents

- [React Compiler](#react-compiler)
- [Expanding the ESLint Configuration](#expanding-the-eslint-configuration)

## Project Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/      # GitHub issue templates
│   └── workflows/           # GitHub Actions workflows
├── components/             # Shared project components
├── public/
│   ├── favicon.svg         # Website favicon
│   └── icons.svg           # SVG icon assets
├── src/
│   ├── assets/             # Images and static resources
│   ├── components/
│   │   ├── cards/
│   │   ├── nature-and-sea/
│   │   └── wild-cards/
│   ├── context/            # React context providers
│   ├── data/               # Application data and configuration
│   ├── pages/              # Application pages/routes
│   ├── registry/           # Registry definitions
│   ├── App.tsx             # Root application component
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── eslint.config.js
├── index.html
├── License.md
├── package.json
├── package-lock.json
└── postcss.config.js
```

### Directory Overview

| Directory | Purpose |
|------------|---------|
| `.github/` | Repository templates and GitHub Actions workflows |
| `public/` | Static assets served directly by Vite |
| `src/assets/` | Images, icons, and other resources |
| `src/components/` | Reusable React components |
| `src/context/` | Global React Context providers |
| `src/data/` | Application data and configuration |
| `src/pages/` | Page-level components |
| `src/registry/` | Registry definitions and mappings |

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
