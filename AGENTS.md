# AGENTS.md: Sentinel console

Sentinel is a fictional security console. It's a Vite + React + TypeScript app built from the Bastion design system: `@vineethbangera/ui` (components) and `@vineethbangera/tokens` (design tokens), installed from GitHub Packages. Bastion's source is in https://github.com/vineethbangera/bastion-ds.

## Repo map

| Path | What it is |
|---|---|
| `src/main.tsx` | Entry. Imports `@vineethbangera/ui/styles.css` (tokens + component styles) before `app.css`. |
| `src/app.tsx` | App shell: top bar, theme switch, page. |
| `src/app.css` | Page layout only. Every colour is a Bastion token variable. |
| `src/alerts/` | Alerts page, its sample data and its tests. |
| `.npmrc` | Points `@vineethbangera` at GitHub Packages; reads the token from `NODE_AUTH_TOKEN`. |
| `.github/dependabot.yml` | Daily Bastion upgrade PRs. |

## Rules

### 1. Use Bastion components
- Build UI from `@vineethbangera/ui`: `Button`, `Input`, `Card*`, `Dialog*`, `DataTable`, `Table*`, `SeverityBadge`. Check its exports before writing your own element.
- Tables of records use `DataTable`: `toolbar` for search and filters, `rowActions` for per-row buttons, `emptyState` for nothing-to-show. Filtering and sorting live in the app, not in `DataTable`.
- Missing a component? Don't build a look-alike here. Note it for Bastion; a plain, unstyled semantic element is the fallback.
- Don't restyle Bastion components with `className` overrides. Bastion's stylesheet only includes the Tailwind classes its own components use, so most utility classes do nothing here anyway.

### 2. Semantic tokens only; never hard-code values
- Colours in `app.css` are `var(--token)`: `--background`, `--foreground`, `--card`, `--muted-foreground`, `--border`, `--primary`, `--severity-*` and so on.
- Never write hex, `rgb()`, `hsl()`, named colours or Tailwind colour classes. `npm run lint` fails on them (ESLint for TS/TSX, Stylelint for CSS).
- Need a colour Bastion doesn't have? Ask for a token in Bastion. Don't define one here.
- `app.css` is for layout (flex, grid, gaps, widths). Keep sizes in `px`/`rem` consistent with what's already there.
- TypeScript token values (`import { light, dark } from "@vineethbangera/tokens"`) are for places CSS can't reach, such as `<meta name="theme-color">`.

### 3. Show severity with SeverityBadge
- Any severity (critical, high, medium, low, info) is `<SeverityBadge severity="..." />`. Use `count` for totals, such as filter buttons and summaries.
- Never show severity as a coloured dot, coloured text or a custom pill: the badge's icon and label make it readable without colour.
- `--severity-*` variables are for severity only.
- Sort alerts most serious first, then newest first.

### 4. Accessibility
- Every input has a label: a visible `<label>`, or `aria-label` when the context makes the purpose obvious (search box in a table toolbar).
- Toggle buttons set `aria-pressed`. Groups of related controls get `role="group"` and an `aria-label` ("Filter by severity").
- Row actions name the row: `aria-label={\`Investigate ${row.id}\`}`. Tables get an `aria-label`.
- Empty states say why there's nothing and how to fix it; if filters caused it, offer "Clear filters".
- A `Dialog` always has a `DialogTitle`. Destructive actions name the action on the button.
- Text contrast 4.5:1 and icons 3:1, in Light **and** Dark (toggle with the top-bar button). Bastion's tokens meet this; your layout colours must use them.
- Everything works with the keyboard; don't remove focus outlines. Use real links for navigation.
- Pages use one `<h1>`, landmarks (`header`, `nav`, `main`) and `aria-current="page"` on the active nav link.

## Commands

GitHub Packages needs a token to install, even public packages. The GitHub CLI's token works once it has `read:packages`:

```bash
gh auth refresh -s read:packages      # once
export NODE_AUTH_TOKEN=$(gh auth token)
npm install
npm run dev          # http://localhost:5173; add ?demo=empty for the no-alerts state
npm run lint         # ESLint (jsx-a11y, hooks, hard-coded colours) + Stylelint (colours must be var())
npm run typecheck    # tsc
npm test             # Vitest + Testing Library in jsdom, with axe on each state
npm run build        # typecheck + production build
```

Before saying work is done: `npm run lint && npm run typecheck && npm test` pass, and you've looked at the page in both themes.

Tests run axe in jsdom, which can't measure colour, so contrast isn't checked here. Bastion's story tests check contrast for its components in a real browser.

## Bastion upgrades
- Dependabot opens one PR a day at most that upgrades `ui` and `tokens` together. Read the Bastion changelog in the PR, run the checks, look at the Alerts page in both themes.
- On 0.x, every minor Bastion release can change behaviour, and `npm update` won't cross minors (`^0.2.0` excludes 0.3.0). Upgrade through the Dependabot PR or by editing the range.
- Never commit a token. `.npmrc` must keep `${NODE_AUTH_TOKEN}`, not a value.

## Where the docs live
- **Bastion Storybook** (how to use each component, do and don't): https://main--6b050df4b797492233581e7b.chromatic.com
- **Bastion changelog:** https://github.com/vineethbangera/bastion-ds/releases
- **Bastion's own agent rules:** `AGENTS.md` in bastion-ds.
- **This app:** `README.md` (setup, why GitHub Packages needs a token).

## Tools for agents
- **Figma MCP** (`figma-desktop`): design context and screenshots for a Figma frame. Where Bastion has Code Connect, it returns Bastion component code; use that, not generated markup.
- **Storybook MCP** runs in bastion-ds, not here. To read Bastion component docs, use the published Storybook above or open bastion-ds.
