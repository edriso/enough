# CLAUDE.md — Enough

Project memory for Claude Code. Read this before doing anything. Keep edits aligned with it; if you intentionally diverge, update this file in the same change.

## What Enough is

A **frontend-only** app that helps people use their phone _on purpose_: a small **daily budget of "checks"** you spend down, with an **unskippable speed-bump** (breathe → name why → decide) before each one. Tagline: **"Use your phone on purpose."**

**Honest scope (keep in copy + README):** a browser app **cannot** forcibly block other apps — that needs an OS-level app with Screen Time / Digital Wellbeing permissions. Enough's real power is being the deliberate **speed-bump you open first**: friction + stated intention + a visible budget + awareness, **no shame**. Be the conscience, not the cage. Never pretend to block anything.

Behavioral basis: checking is a reflex loop; **friction + a pause** breaks automaticity (the urge crests and fades in ~a minute); **stating intent** turns autopilot into a choice; a **visible finite budget** makes the cost salient; **shame backfires** — awareness + self-compassion sustain change. No backend, no accounts; all state local; offline.

> Keep it minimal and still: **one page**, a short phase flow, lots of whitespace, meditative pacing. No feeds, social, or analytics dashboards.

## Product shape — phase machine

`home → pause → why → confirm → (go | saved)`

- **home (budget):** "Enough" wordmark; big remaining number; "N checks left today"; a row of **dots** (one per allowed check) that deplete; one quiet "I want to check" button; soft meta (let-pass count, streak of days kept within budget).
- **pause (breathe):** breathing orb + **unskippable** countdown (default 5s), auto-advances. "Breathe. There's no rush."
- **why:** quick reason chips — intentional (Message someone, Look something up, Take a photo, Make a call) + honest reflex (I'm bored, Just a reflex). Skippable via a Tweak.
- **confirm:** "You have N checks left today. Still want to?" with **"No, I'm good" as the primary/easy choice** and "Yes, use one" secondary. Reflex reasons → gentler nudge ("the feeling usually passes in a minute"). Over budget → a **no-penalty** awareness nudge (never a block/scold).
- **go** (use): calm affirmation + chosen intent; spends one (decrement remaining / fill a dot). **saved** (let pass): leaf affirmation ("You let it pass. That's the whole practice.") + increments let-pass.

**Daily reset:** budget resets each calendar day; yesterday archives to history. **Streak** = consecutive days with used ≤ allowance; exceeding just ends the streak, never punished.

## Design system — calm, meditative, deep-blue

Lots of negative space; one thing on screen at a time; nothing busy. It should feel like a held breath, not a scolding.

### Themes (CSS custom properties). Default **night**; also **day**.

```css
:root {
  --accent: #5fa3c0; /* calm blue */
  --serif: 'Newsreader', Georgia, serif; /* big number, questions, affirmations */
  --ui: 'Hanken Grotesk', system-ui, sans-serif;
}
/* Night (default) — deep blue, still */
[data-theme='night'] {
  --bg: #11161c;
  --bg-2: #0c1014;
  --surface: #1a212a;
  --surface-2: #222b35;
  --line: rgba(180, 210, 230, 0.12);
  --ink: #e7edf2;
  --dim: #9aa8b4;
  --faint: #5f6d79;
  --on-accent: #0a1015;
}
/* Day — soft paper-blue */
[data-theme='day'] {
  --bg: #eef2f5;
  --bg-2: #e3eaef;
  --surface: #fff;
  --surface-2: #eaf0f4;
  --line: rgba(20, 40, 55, 0.12);
  --ink: #18222b;
  --dim: #4f5e6a;
  --faint: #8a98a3;
  --on-accent: #0a1015;
}
--accent-soft: color-mix(in oklab, var(--accent) 18%, transparent);
```

Rules:

- **Calm blue `#5fa3c0` is the accent** (swatches: blue, periwinkle `#7e9cc4`, sage `#8a9a7e`, sand `#b59b7a`, mauve `#9a8fb0`); tints via `color-mix`. Body uses a subtle radial-gradient bg.
- **Newsreader (light)** for the big remaining number (the centerpiece — large, weight 300), questions, and affirmations; **Hanken Grotesk** for UI.
- Budget **dots** glow when available, dim when spent. Pause **orb** breathes (~5s scale).

### ⚠️ Animation gotcha (bit this project family repeatedly — keep the fix)

Never animate `opacity` from 0 with `animation-fill-mode: both` for entrances — in some webview/capture contexts it freezes at frame 0 and the element is **stuck invisible**. **Base `opacity: 1`; animate only `transform`; no `both` fill.** Honor `prefers-reduced-motion` (settle the orb).

### Voice & tone

Calm, still, lightly affirming. **No shame, no penalties, no em dashes** in user copy. Examples:

- "Use your phone on purpose." · "Breathe. There's no rush."
- "You let it pass. That's the whole practice." · "Nice. The urge faded, didn't it?"
- "On purpose. Make it count." · over budget: "There's no penalty, just notice, and choose freely."

Restraint is quietly celebrated; "No, I'm good" is always the easy, primary path; going over is met with awareness, never judgment.

## Tech & architecture

- **React 19 + TypeScript (strict)**, **Vite**, **Tailwind v4** (CSS-first `@theme`, no config; Node 20+).
- **Zustand** (phase/budget/settings); one page + phases, **no router**. **Zod** for persisted-shape validation.
- **Persistence behind a typed `repository`** over localStorage (day, used, saved, history, streak); components never touch storage directly; Zod safe defaults; **daily `rollover` is a pure function run on load.**
- **PWA**: installable, offline-first (vite-plugin-pwa + manifest, calm-blue icon). README tip: install to the home screen and place it where the distracting apps used to be — the realistic way a web app adds friction.
- Folders: `components/`, `features/{home,pause,why,confirm,result}/`, `store/`, `lib/` (repository, rollover/streak utils, reasons + affirmations constants), `types/`, `styles/`. Co-locate tests.

### Conventions

- Naming: `PascalCase` components/types · `camelCase` functions/vars · `kebab-case` files · `SCREAMING_SNAKE_CASE` constants. One component per file; keep small.
- No `any` (`unknown` + narrowing). **Discriminated union for `Phase`.** Path aliases.
- **Pure, unit-tested logic** for `rollover`, `computeStreak`, and the spend/let-pass reducers — out of components.
- Accessibility: keyboard-operable, focus management across phases, the pause countdown perceivable to screen readers (aria-live), ARIA labels on icon buttons, visible focus rings, reduced-motion fallbacks.

## Commands

```bash
pnpm install
pnpm dev          # vite dev server
pnpm build        # type-check + production build
pnpm preview      # preview the build
pnpm lint         # eslint, zero warnings
pnpm format       # prettier --write
pnpm test         # vitest (unit + component)
pnpm test:e2e     # playwright
```

Husky: pre-commit runs Prettier + ESLint on staged files; pre-push runs type-check + unit tests. Conventional Commits (commitlint).

## Definition of done

Lint clean (zero warnings), `tsc` clean, unit/component/e2e green (rollover, streak, and the home-visibility regression especially), builds, **installs and runs offline**, keyboard-accessible, reduced-motion safe, and faithful to this design system — calm, deep-blue, light serif numerals, meditative whitespace. The prototype (`Enough.html` + `enough-app.jsx`) is the source of truth for the flow, reasons, budget/streak logic, and copy; port it faithfully. Two things that MUST hold: **home is visible on load** (no opacity-freeze), and the app is **honestly a speed-bump/conscience, never claiming to block apps**, and **never shames** the user.
