/**
 * Centralized timeout constants (milliseconds).
 *
 * These were previously scattered as unexplained magic numbers across
 * hooks.ts and step definition files -- collecting them here means "how
 * patient are we with a slow page" is tuned from one place, and each value
 * documents why it's set the way it is.
 */
export const TIMEOUTS = {
  /** Default per-action timeout (clicks, fills, etc.) -- extra headroom for
   *  WebKit/Firefox, which are consistently slower than Chromium/Edge. */
  DEFAULT_ACTION: 20000,

  /** Initial page.goto() in the Before hook, before any test logic runs. */
  INITIAL_NAVIGATION: 40000,

  /** Ceiling for the whole After hook (screenshot-on-failure + optional
   *  HOLD_MS pause + browser.close()). */
  AFTER_HOOK: 15000,

  /** "user logs in with username/password" step -- covers the login POST
   *  round-trip plus the products-page render. */
  LOGIN_STEP: 20000,

  /** "the user navigates back to the previous page" step (hamburger -> About
   *  -> back) -- generous because it spans an external saucelabs.com hop. */
  HAMBURGER_BACK_NAVIGATION_STEP: 60000,

  /** Waiting for the About link's navigation to actually land on
   *  saucelabs.com before this step issues its own navigation. */
  SAUCELABS_REDIRECT: 30000,

  /** Waiting to land back on inventory.html after re-logging in. */
  INVENTORY_RETURN: 25000,

  /** Waiting to land back on the login page after Logout. */
  LOGIN_PAGE_RETURN: 10000,

  /** Ceiling for the whole Before hook (browser launch + context + page +
   *  initial navigation) -- must exceed INITIAL_NAVIGATION, or that allowance
   *  is unreachable since Cucumber kills the hook at its own timeout first. */
  BEFORE_HOOK: 45000,
} as const;
