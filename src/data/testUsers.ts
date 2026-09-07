/**
 * Named SauceDemo test accounts.
 *
 * These are the site's own published demo credentials (saucedemo.com prints
 * them on the login page itself) -- not secrets. Centralized here so step
 * definitions/page objects reference one source instead of retyping literal
 * username/password strings, which had drifted into hamburgerSteps.ts's
 * internal re-login call.
 *
 * Feature files are intentionally left as-is: Gherkin scenarios naming
 * concrete example data (e.g. "standard_user") is normal, readable BDD
 * style, not duplication to fix.
 */
export const STANDARD_USER = {
  username: 'standard_user',
  password: 'secret_sauce',
} as const;
