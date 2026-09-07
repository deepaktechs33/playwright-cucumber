import * as dotenv from 'dotenv';
dotenv.config();


function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
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
  appURL: readEnv('APP_URL', 'https://www.saucedemo.com/'),
  slowMo: Number(readEnv('SLOW_MO', '400')),
  holdMs: Number(readEnv('HOLD_MS', '5000')),
};
