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
    this.txtUsername = page.locator('#user-name');
    this.txtPassword = page.locator('#password');
    this.btnLogin = page.locator('#login-button');
    this.lblErrorMessage = page.locator("h3[data-test='error']");
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
