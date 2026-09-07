import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/CheckoutInfoPage.java
export class CheckoutInfoPage extends BasePage {
  readonly lblPageTitle: Locator;
  readonly txtFirstName: Locator;
  readonly txtLastName: Locator;
  readonly txtZip: Locator;
  readonly btnContinue: Locator;

  constructor(page: Page) {
    super(page);
    this.lblPageTitle = page.locator('.title');
    this.txtFirstName = page.locator('#first-name');
    this.txtLastName = page.locator('#last-name');
    this.txtZip = page.locator('#postal-code');
    this.btnContinue = page.locator('#continue');
  }

  async getPageTitle(): Promise<string> {
    return ((await this.lblPageTitle.textContent()) ?? '').trim();
  }

  async enterDetails(firstName: string, lastName: string, zip: string): Promise<void> {
    await this.txtFirstName.fill(firstName);
    await this.txtLastName.fill(lastName);
    await this.txtZip.fill(zip);
  }

  async clickContinue(): Promise<void> {
    await this.btnContinue.click();
    await this.page.waitForURL('**/checkout-step-two.html');
  }
}
