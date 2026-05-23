# Contributing to dev-zone 🚀

First off, thank you for taking the time to contribute! 🎉 Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

Any contribution you make — whether it's fixing a bug, adding a feature, or improving documentation — is deeply appreciated.

---

## 🏗️ Project Stack

Before diving in, it helps to know the tech stack we are using:

| Layer | Technology |
|---|---|
| 🖼️ Frontend Library | React (with Functional Components & Hooks) |
| 🔷 Language | TypeScript (Strict Type-Checking) |
| ⚡ Build Tool | Vite (Fast HMR) |
| 🎨 Styling | Tailwind CSS |

---

## 🗺️ Codebase Overview

| Path | Description |
|---|---|
| `/src` | Contains the main source code of the application |
| `/public` | Static assets like icons, fonts, and images |
| `eslint.config.js` | Code linting and formatting standards |
| `tailwind.config.js` | Custom utility styles and themes |

---

## 🚀 How Can I Contribute?

### 1. 🐛 Reporting Bugs

If you find a bug or unexpected behavior, please check the [Issues Tab](https://github.com/singhtrivendra/dev-zone/issues) first to see if it has already been reported. If not, open a new issue and include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots (if applicable)

---

### 2. 💡 Suggesting Features

Have a great idea for `dev-zone`? Open an issue with the tag `enhancement` and describe:

- The core feature you want to add
- Why it would be useful to the project
- Any mockups or architectural ideas

---

### 3. 💻 Submitting Code Changes

Follow these steps to propose changes locally:

#### Step 1 — Fork the Repository

Click the **Fork** button at the top right of this page to create a copy of this repository under your GitHub account.

#### Step 2 — Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/dev-zone.git
cd dev-zone
```

#### Step 3 — Setup the Development Environment

Install the required dependencies using npm:

```bash
npm install
```

#### Step 4 — Create a New Branch

Always create a descriptive branch name for your work:

```bash
git checkout -b feature/your-feature-name
# OR
git checkout -b bugfix/your-bug-name
```

#### Step 5 — Make Changes & Test

Implement your features or fixes in the `src/` directory.

Run the Vite local development server to test your changes:

```bash
npm run dev
```

> ⚠️ Ensure there are no TypeScript or ESLint errors before committing.

#### Step 6 — Commit and Push

Keep your commit messages clear, concise, and imperative
(e.g., `feat: add user authentication dashboard` or `fix: resolve sidebar responsiveness`).

```bash
git add .
git commit -m "your descriptive commit message"
git push origin feature/your-feature-name
```

#### Step 7 — Open a Pull Request (PR)
Go back to the original upstream repository (`singhtrivendra/dev-zone`) on GitHub. You will see a banner prompting you to *Compare & pull request*. Click it, fill out the PR template with what you changed, and submit!

---

## 🎨 Style & Coding Guidelines

To maintain a clean and uniform codebase, please ensure your code aligns with these rules:

- **TypeScript** — Write explicit types where necessary. Avoid using `any` unless absolutely critical.
- **Component Structure** — Use functional components with arrow functions (`const Component = () => {}`).
- **Styling** — Use semantic Tailwind CSS utility classes. Keep components modular.
- **Linting** — Make sure your code passes the project's ESLint guidelines. You can check for linting errors using your local editor settings before pushing.

---

## 🤝 Code of Conduct

We expect all contributors to maintain a respectful, welcoming, and collaborative environment. Please be kind, supportive, and open to feedback during review processes.

---

⚡ **Happy Coding!** We look forward to reviewing your awesome contributions.
