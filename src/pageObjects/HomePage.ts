import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly lblPageTitle: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    // Verified against the live DOM (data-test attributes).
    this.lblPageTitle = page.getByTestId('title');
    this.cartIcon = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  // Same slug convention as CartPage.slug() — SauceDemo's "Add to cart"
  // buttons use an "add-to-cart-" id prefix instead of "remove-".
  private slug(productName: string): string {
    return productName.toLowerCase().replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
  }

  private addToCartButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${this.slug(productName)}`);
  }

  async addProductToCart(productName: string): Promise<void> {
    const btn = this.addToCartButton(productName);
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  // isVisible() never throws for a missing element (it just returns false
  // immediately) -- no try/catch needed, and wrapping one here would only
  // hide a real error (closed page, destroyed context) as a false negative.
  async isCartIconDisplayed(): Promise<boolean> {
    return this.cartIcon.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return ((await this.lblPageTitle.textContent()) ?? '').trim();
  }

  async getCartBadgeCount(): Promise<string> {
    return ((await this.cartBadge.textContent()) ?? '').trim();
  }

  async isCartBadgeDisplayed(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }
}
