/**
 * Tag-based suite runner.
 *
 * Wraps the Cucumber CLI so the whole team can run a named suite instead of
 * remembering raw --tags expressions. Reuses cucumber.js as-is (same
 * formatters, parallel workers, world, step defs) by spawning the CLI --
 * no duplicated config to drift out of sync.
 *
 * Usage:
 *   npx ts-node runner.ts smoke
 *   npx ts-node runner.ts --suite regression
 *   npm run test:smoke
 *
 * Suites:
 *   smoke       -> @smoke        quick critical-path check (login + checkout)
 *   sanity      -> @sanity       fastest post-deploy check (login only)
 *   regression  -> @regression   full functional coverage
 *   all         -> (no filter)   every scenario in features/**
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

type Suite = 'smoke' | 'sanity' | 'regression' | 'positive' | 'negative' | 'all';

const SUITE_TAGS: Record<Suite, string | null> = {
  smoke: '@smoke',
  sanity: '@sanity',
  regression: '@regression',
  positive: '@positive',
  negative: '@negative',
  all: null,
};

function parseSuiteArg(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if ((arg === '--suite' || arg === '-s') && args[i + 1]) return args[i + 1];
    if (arg.startsWith('--suite=')) return arg.split('=')[1];
    if (!arg.startsWith('-')) return arg;
  }
  return 'all';
}

function main(): void {
  const requested = parseSuiteArg().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(SUITE_TAGS, requested)) {
    console.error(`\n Unknown suite "${requested}". Valid options: ${Object.keys(SUITE_TAGS).join(', ')}\n`);
    process.exit(1);
  }

  const suite = requested as Suite;
  const tagExpression = SUITE_TAGS[suite];

  const cliArgs: string[] = [];
  if (tagExpression) {
    cliArgs.push('--tags', tagExpression);
  }

  // Allure accumulates results across every run unless the raw results
  // dir is cleared first -- without this, the report mixes in every past
  // run instead of showing just this suite.
  fs.rmSync(path.join(__dirname, 'allure-results'), { recursive: true, force: true });

  const browserName = process.env.BROWSER || 'chrome (default)';

  console.log(
    `\n Running "${suite}" suite${tagExpression ? ` (tags: ${tagExpression})` : ' (all scenarios, no tag filter)'} on browser: ${browserName}\n`
  );

  const cucumberBin = path.join(__dirname, 'node_modules', '.bin', 'cucumber-js');
  const result = spawnSync(cucumberBin, cliArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  const exitCode = result.status ?? 1;

  console.log(`\n"${suite}" suite ${exitCode === 0 ? 'passed' : 'failed'}`);
  console.log('Report: reports/cucumber-report.html | allure-report (npm run allure:report)\n');

  process.exit(exitCode);
}

main();
