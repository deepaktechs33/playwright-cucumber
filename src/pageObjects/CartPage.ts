import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/CartPage.java
export class CartPage extends BasePage {
  readonly lblPageTitle: Locator;
  readonly btnCheckout: Locator;
  readonly cartItemNames: Locator;

  constructor(page: Page) {
    super(page);
    // Verified against the live DOM (data-test attributes).
    this.lblPageTitle = page.getByTestId('title');
    this.btnCheckout = page.getByTestId('checkout');
    this.cartItemNames = page.getByTestId('inventory-item-name');
  }

  async getPageTitle(): Promise<string> {
    return ((await this.lblPageTitle.textContent()) ?? '').trim();
  }

  async clickCheckout(): Promise<void> {
    await this.btnCheckout.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  // Checks whether a product with this exact name is listed on the cart page
  async isProductPresent(productName: string): Promise<boolean> {
    try {
      const names = await this.cartItemNames.allTextContents();
      return names.some((n) => n.trim().toLowerCase() === productName.toLowerCase());
    } catch {
      return false;
    }
  }

  // Same slug logic as HomePage.addToCartButton, but SauceDemo's cart-page
  // remove buttons use a "remove-" id prefix instead of "add-to-cart-".
  private slug(productName: string): string {
    return productName.toLowerCase().replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
  }

  private removeButton(productName: string): Locator {
    return this.page.getByTestId(`remove-${this.slug(productName)}`);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const btn = this.removeButton(productName);
    await btn.click();
    // Confirms the item's row (and its Remove button) actually left the DOM.
    await btn.waitFor({ state: 'detached' });
  }

  // Number of product rows currently listed on the cart page.
  // count() never throws for zero matches (like isVisible(), it's a
  // non-waiting, non-throwing query) -- no try/catch needed.
  async getCartItemCount(): Promise<number> {
    return this.cartItemNames.count();
  }
}
