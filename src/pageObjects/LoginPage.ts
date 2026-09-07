import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly txtUsername: Locator;
  readonly txtPassword: Locator;
  readonly btnLogin: Locator;
  readonly lblErrorMessage: Locator;
  readonly lblAppLogo: Locator;

  constructor(page: Page) {
    super(page);
    // Verified against the live DOM: SauceDemo tags these with data-test,
    // Playwright's semantic getByTestId locator (see hooks.ts for the
    // data-test attribute wiring) is preferred over id/class selectors since
    // it targets attributes meant for automation, not styling.
    this.txtUsername = page.getByTestId('username');
    this.txtPassword = page.getByTestId('password');
    this.btnLogin = page.getByTestId('login-button');
    this.lblErrorMessage = page.getByTestId('error');
    // No data-test on the logo -- class selector is the only option here.
    this.lblAppLogo = page.locator('.login_logo');
  }

  async enterUsername(username: string): Promise<void> {
    await this.txtUsername.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.txtPassword.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.btnLogin.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return ((await this.lblErrorMessage.textContent()) ?? '').trim();
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      return await this.lblErrorMessage.isVisible();
    } catch {
      return false;
    }
  }

  async isLogoDisplayed(): Promise<boolean> {
    try {
      return await this.lblAppLogo.isVisible();
    } catch {
      return false;
    }
  }
}
