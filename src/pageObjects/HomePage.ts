import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly lblPageTitle: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.lblPageTitle = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  // Same slug convention as CartPage.slug() — SauceDemo's "Add to cart"
  // buttons use an "add-to-cart-" id prefix instead of "remove-".
  private slug(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/\(/g, '')
      .replace(/\)/g, '');
  }

  private addToCartButton(productName: string): Locator {
    return this.page.locator(`#add-to-cart-${this.slug(productName)}`);
  }

  async addProductToCart(productName: string): Promise<void> {
    const btn = this.addToCartButton(productName);
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async isCartIconDisplayed(): Promise<boolean> {
    try {
      return await this.cartIcon.isVisible();
    } catch {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    return ((await this.lblPageTitle.textContent()) ?? '').trim();
  }

  async getCartBadgeCount(): Promise<string> {
    return ((await this.cartBadge.textContent()) ?? '').trim();
  }

  async isCartBadgeDisplayed(): Promise<boolean> {
    try {
      return await this.cartBadge.isVisible();
    } catch {
      return false;
    }
  }
}
