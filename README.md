# Wahi-ur-Rehman — AI Developer Portfolio

> **An interactive developer OS interface** — not just a portfolio website.
> Built as a split-screen terminal dashboard with AI interaction mode, animated boot sequence, and command intelligence.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-22c55e?style=flat-square)
![React](https://img.shields.io/badge/React-18-3b82f6?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3b82f6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-f59e0b?style=flat-square&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-0.168-white?style=flat-square&logo=threedotjs&logoColor=black)

---

## 🖥️ Live Demo

> Run locally with `npm run dev` — see setup instructions below.

---

## 📐 Architecture Overview

This project is a **complete original redesign** built on a Vite + React + TypeScript base. The original base project used a vertical-scroll layout with a 3D character model and GSAP scroll triggers. This version replaces all of that with a non-scrolling, interactive **developer OS dashboard**.

```
src/
├── components/
│   └── Dashboard/
│       ├── DashboardLayout.tsx   ← Root shell (split-screen + mobile drawer)
│       ├── TerminalPanel.tsx     ← Left: interactive terminal with AI mode
│       ├── ContentPanel.tsx      ← Right: animated content switcher
│       ├── Background3D.tsx      ← Minimal particle field (WebGL optional)
│       └── Views/
│           ├── OverviewView.tsx  ← Profile, Focus Areas, Tech Snapshot
│           ├── ProjectsView.tsx  ← Project cards with hover overlay
│           ├── ExperienceView.tsx← Timeline (experience + education)
│           └── SkillsView.tsx    ← Categorized skill grid
├── data/
│   └── portfolioData.ts          ← Single source of truth for all content
└── index.css                     ← Full design system (tokens, animations, responsive)
```

---

## ✨ Features

### Terminal Interface (Left Panel)
- **Animated boot sequence** — line-by-line system initialisation on load
- **Command navigation** — click `.sh` scripts or type commands:
  - `/whoami` · `/projects` · `/work` · `/skills` · `/status` · `/help`
- **AI assistant mode** — type `/ask [anything]` for intelligent responses:
  - `/ask trading` → explains the AI Trading Bot
  - `/ask skills` → summarises the tech stack
  - `/ask contact` → returns contact details
- **Execution state machine** — animated dots while switching, log entry after completion
- **Output log** — full command history with colour-coded response types
- **Contact icon cards** — GitHub, LinkedIn, copy-to-clipboard Email

### Content Dashboard (Right Panel)
- **Overview** — Profile card · Focus Areas (AI, Automation, 3D) · Tech Snapshot grid
- **Projects** — Image cards with hover overlay action buttons (Source Code, Watch Video)
- **Timeline** — Side-by-side Experience and Education timelines
- **Skills** — Categorised skill tag grid
- **Slide-in animation** — every section switch triggers a `slideInRight` entrance

### Design & Animation
- **Modern IDE aesthetic** — dark grays (`#080a0e`, `#10131a`, `#161923`) with blue accents
- **CSS neural grid background** — animated shifting grid (no WebGL dependency)
- **Geist + Geist Mono** fonts
- **Micro-interactions** — hover glows, command flash, glowPulse on active nav
- **Mobile responsive** — bottom-sheet drawer at ≤768px via FAB toggle button

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Wahi-ur-rehman/ai-portfolio.git
cd ai-portfolio

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔧 Customisation

All personal data lives in one file:

**`src/data/portfolioData.ts`**

Update your name, bio, projects, skills, experience, education, and contact links there — the entire UI updates automatically.

---

## ⚠️ Known Issues & Solutions

### 1. `npm install` fails with `ETIMEDOUT` on `npm.greensock.com`

**Cause:** The original `package.json` included `@gsap/react` and `gsap-trial` which pull from the private GSAP paid registry.

**Solution:** These packages have been removed. If you see this error, ensure your `package.json` does **not** include `@gsap/react` or `gsap-trial`. Run:

```bash
npm install --legacy-peer-deps
```

---

### 2. Blank white/black screen on load — `THREE.WebGLRenderer: A WebGL context could not be created`

**Cause:** The `Background3D` component uses WebGL via React Three Fiber. Some browsers, headless environments, or virtual machines cannot create a WebGL context.

**Solution:** This is handled gracefully — a `WebGLBoundary` error boundary catches the crash and renders `null` instead. The rest of the UI continues to work perfectly.

If you want to permanently disable the 3D background, remove `<Background3D />` from `DashboardLayout.tsx`. The CSS neural grid background will continue to show.

---

### 3. `vite: command not found` when running `npm run dev`

**Cause:** `node_modules` is missing or corrupted (common after switching Node versions or pulling fresh).

**Solution:**

```bash
rm -rf node_modules
npm install --legacy-peer-deps
npm run dev
```

On Windows PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
npm run dev
```

---

### 4. PowerShell blocks `npm` — `running scripts is disabled on this system`

**Cause:** Windows PowerShell execution policy prevents running npm `.ps1` scripts.

**Solution (Option A — use cmd instead):**
```bash
cmd /c "npm run dev"
```

**Solution (Option B — set execution policy):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

### 5. Boot sequence shows duplicate lines

**Cause:** React StrictMode intentionally double-invokes `useEffect` in development to surface bugs.

**Solution:** Already fixed with a `useRef` guard in `TerminalPanel.tsx`. If you see this, make sure the `bootedRef` guard is present:

```tsx
const bootedRef = useRef(false);
useEffect(() => {
  if (bootedRef.current) return;
  bootedRef.current = true;
  // ... boot logic
}, []);
```

---

### 6. `@react-three/cannon` or `@react-three/rapier` peer dependency warnings

**Cause:** These packages were in the original base project but are unused in the new architecture.

**Solution:** They have been removed from `package.json`. Run `npm install --legacy-peer-deps` to ensure a clean state. The `--legacy-peer-deps` flag resolves minor transitive peer conflicts between `three` and `@react-three/drei`.

---

### 7. Profile image not loading (broken image placeholder)

**Cause:** The `profileImage` path `/photo1_square.jpeg` expects a file in the `public/` folder.

**Solution:** Place your profile photo at `public/photo1_square.jpeg`. If you want a different filename, update `profileImage` in `src/data/portfolioData.ts`.

---

### 8. `/ask` command returns generic response

**Cause:** The AI assistant uses keyword matching. If your query doesn't match any known keyword (`projects`, `trading`, `automation`, `skills`, `contact`, `experience`, `education`), it returns the default help message.

**Solution:** Use one of the supported keywords. To add new keywords, extend the `AI_RESPONSES` object in `TerminalPanel.tsx`.

---

## 📊 What Changed from Base Project

The original base project (`moncy-portfolio`) was a public open-source portfolio template. Here is a detailed record of every architectural change made:

### Removed Entirely
| Original | Reason |
|---|---|
| `Landing.tsx` | Replaced by split-screen layout |
| `About.tsx` | Merged into `OverviewView.tsx` |
| `WhatIDo.tsx` | Replaced by `OverviewView` Focus Areas section |
| `Career.tsx` | Replaced by `ExperienceView.tsx` |
| `Work.tsx`, `WorkImage.tsx` | Replaced by `ProjectsView.tsx` |
| `TechStack.tsx` | Replaced by `SkillsView.tsx` |
| `Contact.tsx` | Moved into `TerminalPanel.tsx` contact cards |
| `Navbar.tsx` | Navigation is now the terminal command system |
| `SocialIcons.tsx` | Replaced by terminal contact cards |
| `Cursor.tsx` | Removed |
| `HoverLinks.tsx` | Removed |
| `Loading.tsx` | Replaced by animated boot sequence |
| `MainContainer.tsx` | Replaced by `DashboardLayout.tsx` |
| `CharacterModel` (3D) | Replaced by CSS neural background + optional particles |
| GSAP scroll triggers | Replaced by CSS `@keyframes` animations |
| Vertical scroll layout | Replaced by `100vh` fixed dashboard |
| `context/LoadingProvider` | Removed (no longer needed) |
| `@gsap/react`, `gsap-trial` | Removed (require paid registry auth) |
| `@react-three/cannon`, `@react-three/rapier` | Removed (unused) |
| `react-fast-marquee`, `three-stdlib` | Removed (unused) |

### Added (New Files)
| New File | Purpose |
|---|---|
| `src/data/portfolioData.ts` | Single source of truth for all personal data |
| `src/components/Dashboard/DashboardLayout.tsx` | Root split-screen shell |
| `src/components/Dashboard/TerminalPanel.tsx` | Interactive terminal with AI mode |
| `src/components/Dashboard/ContentPanel.tsx` | Animated content switcher |
| `src/components/Dashboard/Background3D.tsx` | Optional particle background with WebGL error boundary |
| `src/components/Dashboard/Views/OverviewView.tsx` | Profile + Focus Areas + Tech Snapshot |
| `src/components/Dashboard/Views/ProjectsView.tsx` | Project cards with image hover overlays |
| `src/components/Dashboard/Views/ExperienceView.tsx` | Dual-column timeline |
| `src/components/Dashboard/Views/SkillsView.tsx` | Categorised skill grid |

### Modified
| File | What Changed |
|---|---|
| `src/App.tsx` | Stripped to render `<DashboardLayout />` only |
| `src/index.css` | Complete rewrite — new design token system, all animations, responsive mobile drawer |
| `index.html` | Updated page title to "Wahi-ur-Rehman — AI Student & Developer" |
| `package.json` | Removed 6 unused/problematic packages |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool & dev server |
| Three.js | 0.168 | Optional 3D particles |
| @react-three/fiber | 8.17 | React renderer for Three.js |
| @react-three/drei | 9.120 | Three.js helpers (Points, PointMaterial) |
| react-icons | 5.3 | GitHub/LinkedIn/Email icons |
| Geist / Geist Mono | — | Typography (Google Fonts) |

---

## 📄 License

Custom Source-Available License — see [LICENSE](./LICENSE) for details. (Allows inspiration, prohibits cloning/copying without credit).

---

## 🙏 Attribution

The original base project structure was forked from an open-source portfolio template. All components, design system, animations, interactions, and content in this version are original work built from scratch on top of the Vite + React + TypeScript scaffold.

---

*Built by Wahi-ur-Rehman — AI Student & Developer @ SZABIST Islamabad*
