# Enough

**Use your phone on purpose.** Enough is a calm, **frontend-only** companion that
helps you spend down a small daily budget of "checks," with an unskippable
speed-bump before each one: **breathe → name why → decide**. It's a held breath,
not a scolding — restraint is quietly celebrated, and going over is met with
awareness, never judgment.

There is no backend, no account, and no network. Everything lives on your device
and the app works fully offline.

## An honest note on what this is (and isn't)

A browser app **cannot** forcibly block Instagram, TikTok, or any other app — that
requires an OS-level app with Screen Time / Digital Wellbeing permissions. Enough
does **not** pretend to block anything. Its real power, and what actually rewires
the habit, is being the deliberate **speed-bump you open first**: friction, a
stated intention, a visible finite budget, and awareness, with no shame. It's the
conscience, not the cage.

The mechanism is well-grounded: compulsive checking is a reflex loop, and inserting
**friction and a pause** breaks the automaticity (the urge usually crests and fades
within a minute); **stating intent** turns autopilot into a choice; a **visible
budget** makes the cost salient; and **shame backfires**, so awareness and
self-compassion are what sustain change.

> **Friction tip:** install Enough to your home screen (it's a PWA) and place its
> icon where your most distracting app used to live. Opening it first is the
> realistic way a web app inserts a pause into the reflex.

---

## How it works — one page, a phase flow

`home → pause → why → confirm → (go | saved)`

- **Home** shows the budget: a large remaining number, "N checks left today", a
  row of dots that deplete as you spend, one quiet "I want to check" button, and a
  soft line for today's let-pass count and your streak.
- **Pause** is an **unskippable** breathing orb with a short countdown (default 5s)
  that auto-advances. "Breathe. There's no rush."
- **Why** offers quick reason chips — intentional (message someone, look something
  up, take a photo, make a call) and honest reflex ones (I'm bored, just a reflex).
  Skippable via a setting.
- **Confirm** asks "Still want to?" with **"No, I'm good" as the easy, primary
  choice**. A reflex reason earns a gentler nudge; being over budget shows a
  **no-penalty** awareness line, never a block or scold.
- **go** (you chose to) spends one check with a calm affirmation; **saved** (you
  let it pass) celebrates the restraint: "You let it pass. That's the whole
  practice."

The budget **resets each calendar day** (yesterday archives to history), and a
gentle **streak** counts consecutive days kept within the allowance — exceeding
just stops the streak; it's never punished.

---

## Tech stack

- **React 19 + TypeScript** (strict), built with **Vite**
- **Tailwind CSS v4** (configured in CSS with `@theme`, no `tailwind.config.js`)
- **Zustand** for state (no router — one page with phases)
- **Zod** validates the persisted shape
- **vite-plugin-pwa** so the app is installable and works offline
- **Vitest** + **Testing Library** for unit and component tests, **Playwright**
  for browser tests

---

## Getting started

You need **Node 20+** and **pnpm** (`npm install -g pnpm`).

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173>. There is nothing else to configure — no backend.

---

## Commands

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                 |
| `pnpm build`     | Type-check and build for production       |
| `pnpm preview`   | Preview the production build locally      |
| `pnpm lint`      | Run ESLint (must pass with zero warnings) |
| `pnpm format`    | Format every file with Prettier           |
| `pnpm typecheck` | Type-check without building               |
| `pnpm test`      | Run the unit and component tests (Vitest) |
| `pnpm test:e2e`  | Run the browser tests (Playwright)        |

Run `pnpm test:e2e:install` once to download the browser before `pnpm test:e2e`.

---

## How it is built

```
src/
├── components/   icon, overlay, the settings panel
├── features/     home, pause, why, confirm, result (one screen per phase)
├── store/        the Zustand store (settings + the day's counters)
├── hooks/        apply-theme
├── lib/          budget (rollover, streak, spend/let-pass), repository, date, content
├── types/        Zod schemas and the types they produce
└── styles/       the calm deep-blue theme + layout CSS
```

A few ideas worth knowing:

- **The budget logic is pure and tested.** `rollover` archives the prior day and
  resets the counters when the date turns, `computeStreak` counts consecutive
  under-allowance days (with the month/year edges covered), and the spend/let-pass
  reducers are plain functions. They live in `lib/budget.ts` with no React.
- **Saving goes through one seam.** `lib/repository.ts` is a small typed interface
  over localStorage; saved data is parsed with Zod (safe defaults), and the daily
  rollover is applied on read.

### ⚠️ One animation gotcha that's deliberately fixed

Entrances never animate `opacity` from 0 with `animation-fill-mode: both` — in
some webview/capture contexts that freezes at frame 0 and leaves the element
**stuck invisible** (it has hidden whole screens). Every entrance keeps
`opacity: 1` and animates only `transform`.

---

## Accessibility & motion

- Every control is keyboard-operable with a visible focus ring; the pause
  countdown is announced to screen readers (`aria-live`); the settings dialog
  traps focus and closes on Escape.
- The app honors `prefers-reduced-motion` (the breathing orb settles) and ships
  calm **night** and soft **day** themes.

---

## License

MIT.
