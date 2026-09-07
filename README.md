# SauceDemo — Playwright + Cucumber (TypeScript)

End-to-end UI test framework for [saucedemo.com](https://www.saucedemo.com/), built with
[Playwright](https://playwright.dev/) driving the browser and [Cucumber.js](https://github.com/cucumber/cucumber-js)
as the test runner (Gherkin `.feature` files + TypeScript step definitions).

## Stack

- **Playwright** — browser automation (Chrome, Edge, Firefox, WebKit)
- **Cucumber.js** (`@cucumber/cucumber`) — BDD test runner, Gherkin syntax
- **TypeScript** — strict mode, compiled on the fly via `ts-node`
- **Allure** + Cucumber's built-in HTML/JSON reporter — test reporting
- **Jenkins** — CI pipeline (see [`Jenkinsfile`](./Jenkinsfile))

## Project structure

```
features/                Gherkin .feature files (one per functional area)
src/
  config/config.ts        Reads and validates .env into a single typed config object
  factory/BrowserFactory.ts   Launches the right Playwright browser per config
  world/CustomWorld.ts    Cucumber World — holds browser/page + page objects, per scenario
  pageObjects/             Page Object Model — one class per page/component
  stepDefinitions/         Gherkin step implementations + Before/After hooks
runner.ts                 Tag-based suite runner (see "Running tests" below)
cucumber.js                Cucumber.js config (formatters, parallelism, retries, paths)
reports/                   Generated: Cucumber HTML + JSON report (gitignored)
allure-results/            Generated: raw Allure results (gitignored)
allure-report/              Generated: rendered Allure report (gitignored)
screenshots/                Generated: failure (and optionally per-step) screenshots (gitignored)
```

## Prerequisites

- Node.js 22.x (matches the `Node22` tool used in Jenkins)
- npm

## Setup

```bash
npm install
npm run install:browsers   # downloads Playwright's Chromium + Firefox binaries
cp .env.example .env       # then edit .env if you need different values
```

`.env` is gitignored and required at runtime — `.env.example` documents every variable the
framework reads. `APP_URL` in particular has no built-in fallback: if it's missing, the
framework fails fast with `Missing required config value: APP_URL` rather than silently
testing the wrong site.

## Running tests

Tag-based suites (via [`runner.ts`](./runner.ts) — wraps the Cucumber CLI, clears stale Allure
results first, and exits with the real pass/fail code):

```bash
npm run test:smoke        # @smoke       — critical path (login + checkout)
npm run test:sanity       # @sanity      — fastest post-deploy check (login only)
npm run test:regression   # @regression  — full functional coverage
npm run test:positive     # @positive    — positive-path login scenario
npm run test:all          # every scenario, no tag filter
```

Per-feature scripts:

```bash
npm run test:login
npm run test:sort
npm run test:hamburger
npm run test:footer
npm run test:e2e
```

Or run Cucumber directly with your own tag expression:

```bash
npx cucumber-js --tags "@regression and not @negative"
```

Scenarios run in parallel (`parallel: 4` in `cucumber.js`) with 1 retry on failure — each
scenario gets its own isolated `Browser`/`Page` instance (see `hooks.ts`), so parallel workers
never share state.

## Reports

Two reporters run on every test run:

```bash
# Cucumber's own HTML/JSON report — written to reports/, no extra command needed
open reports/cucumber-report.html

# Allure — richer, step-by-step report with history
npm run allure:report   # generates + opens allure-report/ in your browser
```

Allure's raw `allure-results/` directory is cleared before every run (via `runner.ts` and the
`pretest*` npm hooks) so the report always reflects only your latest run, not every run you've
ever done.

## Configuration reference

All runtime config is read from `.env` through `src/config/config.ts` — see `.env.example` for
the full list with descriptions. Highlights:

| Variable                   | Purpose                                          | Default                  |
| -------------------------- | ------------------------------------------------ | ------------------------ |
| `APP_URL`                  | Site under test                                  | _(required, no default)_ |
| `BROWSER`                  | `chrome` \| `edge` \| `firefox` \| `webkit`      | `chrome`                 |
| `HEADLESS`                 | Run headless                                     | `true`                   |
| `SLOW_MO` / `HOLD_MS`      | Local debug pacing — forced to `0` on CI         | `400` / `5000`           |
| `CAPTURE_STEP_SCREENSHOTS` | Screenshot every passing step, not just failures | `false`                  |

## Code quality

```bash
npm run lint          # ESLint
npm run lint:fix       # ESLint, auto-fixing what it can
npm run format          # Prettier, writes changes
npm run format:check    # Prettier, check only (used in CI)
```

## CI

The [`Jenkinsfile`](./Jenkinsfile) runs on any agent with Node 22: installs dependencies and
Playwright browsers, runs the full suite headless, then publishes both the Cucumber HTML report
and the Allure report as build artifacts (via the Allure Jenkins plugin) — even when tests fail,
so a red build still leaves a full report behind. `BROWSER` is a build parameter.
