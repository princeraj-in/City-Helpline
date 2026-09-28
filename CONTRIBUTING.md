# Contributing to Studolink

Thank you for your interest in contributing to **Studolink**! We are building a modern, student-centric ecosystem to eliminate high brokerages, misinformation, and stress for students relocating to educational hubs across India.

Every contribution—whether fixing a typo, improving documentation, reporting a bug, or building a brand new feature—is deeply appreciated.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Local Development Setup](#-local-development-setup)
- [Branching Strategy](#-branching-strategy)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Coding Standards & Best Practices](#-coding-standards--best-practices)
- [Security & Data Privacy](#-security--data-privacy)
- [Submitting a Pull Request](#-submitting-a-pull-request)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)**. Please treat everyone with respect, kindness, and professionalism.

---

## 💡 How Can I Contribute?

### Reporting Bugs
Before creating a bug report, please check existing [Issues](https://github.com/princeraj-in/City-Helpline/issues) to see if it has already been reported.

When reporting a bug, include:
- A clear, descriptive title.
- Steps to reproduce the behavior.
- Expected behavior vs. actual behavior.
- Screenshots or screen recordings (if applicable).
- Device, browser, and OS specifications.

### Suggesting Features
Feature requests are welcomed! When opening an issue for a feature:
- Explain the specific student or contributor problem it solves.
- Describe the proposed solution and user experience.
- Provide mockup sketches or UI references if available.

### Code Contributions
1. Check the [Issues](https://github.com/princeraj-in/City-Helpline/issues) tab for open issues labeled `good first issue` or `help wanted`.
2. Leave a comment on the issue stating that you would like to work on it to prevent duplicated effort.
3. Fork the repository and follow the setup instructions below.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun**
- **Git** installed on your system

### 1. Fork & Clone
Fork the repository to your GitHub account, then clone it locally:
```bash
git clone https://github.com/<your-username>/City-Helpline.git
cd City-Helpline
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Fill in the required configuration:
```env
# Cloudinary Media Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=cityhelpline_upload

# Firebase Web Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Gemini AI Configuration (Server-side)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> Note: `npm run dev` boots the integrated `server.ts` Express server, serving both the Vite client application and the `/api/chat` + `/api/health` endpoints locally.

---

## 🌿 Branching Strategy

Always create a new branch from `main` with a descriptive name prefix:

- `feat/<feature-name>` — For new features (e.g. `feat/pwa-offline-fallback`)
- `fix/<bug-fix>` — For bug fixes (e.g. `fix/budget-calc-rounding`)
- `docs/<documentation>` — For documentation changes (e.g. `docs/api-guide`)
- `refactor/<cleanup>` — For code cleanup without functional changes (e.g. `refactor/navbar-mobile-nav`)

```bash
git checkout -b feat/my-new-feature
```

---

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description>

[optional body]
```

### Common Types:
- `feat`: A new user-facing feature or enhancement.
- `fix`: A bug fix.
- `docs`: Documentation-only updates.
- `style`: Changes that do not affect code logic (formatting, spacing).
- `refactor`: Code reorganization that neither fixes a bug nor adds a feature.
- `perf`: Code change that improves performance.
- `chore`: Maintenance tasks, dependency updates, or tooling configuration.

### Examples:
```bash
git commit -m "feat(pwa): add service worker offline caching"
git commit -m "fix(auth): prevent empty student verification submissions"
git commit -m "docs(readme): add contribution guide and architecture notes"
```

---

## 📐 Coding Standards & Best Practices

1. **TypeScript Strictness**:
   - Write clean, strongly typed code. Avoid using `any` wherever possible.
   - Domain interfaces should be added or updated in `src/types/index.ts`.

2. **Tailwind CSS v4 & Styling**:
   - Use utility-first classes and avoid inline CSS styles.
   - Adhere to the app's dark-space palette and glassmorphism design tokens (`student-glass-card`, `student-input-glass`, `backdrop-blur`).

3. **React 19 & Component Architecture**:
   - Prefer functional components with hooks.
   - Keep components modular and reusable under `src/components/common/` or domain-specific folders (`admin/`, `marketplace/`, `budget/`, `roommate/`).
   - Clean up event listeners and timers in `useEffect` return functions.

4. **Linting & Type Verification**:
   Before committing, always ensure TypeScript compiles without errors:
   ```bash
   npm run lint
   ```
   And verify production builds succeed:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Data Privacy

Security and student data privacy are critical to this platform:
- **Never commit secrets**: Do not commit `.env` or hardcode API keys, service account credentials, or tokens in source code.
- **Student Data Privacy**: Sensitive verification items (student IDs, college roll numbers) must be routed to the protected subcollection `/users/{userId}/private/verification` and must never be exposed on public user profile documents.
- **Firestore Rules**: Any schema addition or collection query must adhere to `firestore.rules`.
- **Input Sanitization**: Always sanitize and validate user-supplied input on both client and API handlers.

---

## 🚀 Submitting a Pull Request

When your changes are ready:

1. **Push your branch**:
   ```bash
   git push origin feat/my-new-feature
   ```
2. **Open a Pull Request**:
   - Go to [Studolink Pull Requests](https://github.com/princeraj-in/City-Helpline/pulls).
   - Click **New pull request**.
   - Provide a clear title following Conventional Commits format.
   - Describe what was changed and why.
   - Link any related issue (e.g., `Closes #12`).
   - Include screenshots or GIFs for UI changes.

3. **Code Review**:
   - Maintainers will review your PR, suggest improvements if needed, and merge once approved.

Thank you for helping empower Indian students! 🚀
