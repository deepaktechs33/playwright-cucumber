import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/SortPage.java
export class SortPage extends BasePage {
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.sortDropdown = page.locator('.product_sort_container');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async clickSortDropdown(): Promise<void> {
    await this.sortDropdown.click();
  }

  // The dropdown is a native <select>; selectOption() is Playwright's
  // equivalent of Selenium's Select.selectByVisibleText(). Note this sets
  // the value directly rather than visually opening/highlighting the
  // native option list, so we pause briefly before and after in headed
  // mode purely so the change is actually visible to a human watching.
  async selectSortOption(visibleText: string): Promise<void> {
    await this.page.waitForTimeout(1500);
    await this.sortDropdown.selectOption({ label: visibleText });
    await this.page.waitForTimeout(1500);
  }

  async getSelectedSortOption(): Promise<string> {
    const selected = this.sortDropdown.locator('option:checked');
    return ((await selected.textContent()) ?? '').trim();
  }

  // Verifies the products currently on screen are actually in the order
  // this sort option claims, not just that the dropdown shows it selected.
  async isSortWorkingCorrectly(sortOption: string): Promise<boolean> {
    const names = await this.productNames.allTextContents();
    const prices = (await this.productPrices.allTextContents()).map((p) =>
        parseFloat(p.replace('$', ''))
    );

    switch (sortOption) {
      case 'Name (A to Z)':
        return this.isAscending(names);
      case 'Name (Z to A)':
        return this.isDescending(names);
      case 'Price (low to high)':
        return this.isAscendingNum(prices);
      case 'Price (high to low)':
        return this.isDescendingNum(prices);
      default:
        throw new Error(`Unknown sort option: ${sortOption}`);
    }
  }

  private isAscending(list: string[]): boolean {
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].localeCompare(list[i + 1], undefined, { sensitivity: 'base' }) > 0) return false;
    }
    return true;
  }

  private isDescending(list: string[]): boolean {
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].localeCompare(list[i + 1], undefined, { sensitivity: 'base' }) < 0) return false;
    }
    return true;
  }

  private isAscendingNum(list: number[]): boolean {
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] > list[i + 1]) return false;
    }
    return true;
  }

  private isDescendingNum(list: number[]): boolean {
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] < list[i + 1]) return false;
    }
    return true;
  }
}
