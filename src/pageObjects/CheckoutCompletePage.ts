import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/CheckoutCompletePage.java
export class CheckoutCompletePage extends BasePage {
  readonly lblConfirmationHeader: Locator;
  readonly btnBackHome: Locator;

  constructor(page: Page) {
    super(page);
    // Verified against the live DOM (data-test attributes).
    this.lblConfirmationHeader = page.getByTestId('complete-header');
    this.btnBackHome = page.getByTestId('back-to-products');
  }

  async getConfirmationHeader(): Promise<string> {
    return ((await this.lblConfirmationHeader.textContent()) ?? '').trim();
  }

  async clickBackHome(): Promise<void> {
    await this.btnBackHome.click();
    await this.page.waitForURL('**/inventory.html');
  }
}
