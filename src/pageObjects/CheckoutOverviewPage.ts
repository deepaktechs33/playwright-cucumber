import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/CheckoutOverviewPage.java
export class CheckoutOverviewPage extends BasePage {
  readonly lblPageTitle: Locator;
  readonly btnFinish: Locator;

  constructor(page: Page) {
    super(page);
    // Verified against the live DOM (data-test attributes).
    this.lblPageTitle = page.getByTestId('title');
    this.btnFinish = page.getByTestId('finish');
  }

  async getPageTitle(): Promise<string> {
    return ((await this.lblPageTitle.textContent()) ?? '').trim();
  }

  async clickFinish(): Promise<void> {
    await this.btnFinish.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }
}
