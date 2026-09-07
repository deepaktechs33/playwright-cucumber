import * as dotenv from 'dotenv';
dotenv.config();

function readEnv(name: string, fallback?: string): string {
  const raw = process.env[name];
  // Treat a blank value (e.g. "HEADLESS=" with nothing after it) the same as
  // an absent one, so the fallback still applies -- `??` alone only catches
  // undefined/null, not empty strings.
  const value = raw === undefined || raw === '' ? fallback : raw;
  if (value === undefined) {
    throw new Error(`Missing required config value: ${name}`);
  }
  return value;
}

export const config = {
  executionEnv: readEnv('EXECUTION_ENV', 'local').toLowerCase(),
  browser: readEnv('BROWSER', 'chrome').toLowerCase(),
  os: readEnv('OS', 'mac').toLowerCase(),
  headless: readEnv('HEADLESS', 'true').toLowerCase() === 'true',
  appURL: readEnv('APP_URL'),
  slowMo: Number(readEnv('SLOW_MO', '400')),
  holdMs: Number(readEnv('HOLD_MS', '5000')),
  // Off by default -- capturing a screenshot after every passing step balloons
  // screenshots/ and CI artifact size. Failure screenshots are always taken
  // regardless of this flag (see hooks.ts After hook).
  captureStepScreenshots: readEnv('CAPTURE_STEP_SCREENSHOTS', 'false').toLowerCase() === 'true',
};
