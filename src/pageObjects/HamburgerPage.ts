import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/HamburgerPage.java
export class HamburgerPage extends BasePage {
  readonly hamburgerIcon: Locator;
  readonly lnkAllItems: Locator;
  readonly lnkAbout: Locator;
  readonly lnkLogout: Locator;
  readonly lnkResetAppState: Locator;

  constructor(page: Page) {
    super(page);
    // NOTE: data-test="open-menu" exists in the DOM, but it's on a
    // decorative <img> that's a SIBLING of the real button, not inside it --
    // clicking it does not trigger the menu (confirmed against the live
    // site). The real clickable element has no data-test, so id is correct here.
    this.hamburgerIcon = page.locator('#react-burger-menu-btn');
    this.lnkAllItems = page.getByTestId('inventory-sidebar-link');
    this.lnkAbout = page.getByTestId('about-sidebar-link');
    this.lnkLogout = page.getByTestId('logout-sidebar-link');
    this.lnkResetAppState = page.getByTestId('reset-sidebar-link');
  }

  async openMenu(): Promise<void> {
    await this.hamburgerIcon.click();
    await this.lnkAllItems.waitFor({ state: 'visible' });
  }

  private getMenuElement(optionName: string): Locator {
    switch (optionName) {
      case 'All Items':
        return this.lnkAllItems;
      case 'About':
        return this.lnkAbout;
      case 'Logout':
        return this.lnkLogout;
      case 'Reset App State':
        return this.lnkResetAppState;
      default:
        throw new Error(`Unknown menu option: ${optionName}`);
    }
  }

  // isVisible() never throws for a missing element -- no try/catch needed
  // (see HomePage.isCartIconDisplayed for the full rationale).
  async isMenuOptionDisplayed(optionName: string): Promise<boolean> {
    return this.getMenuElement(optionName).isVisible();
  }

  async clickMenuOption(optionName: string): Promise<void> {
    await this.getMenuElement(optionName).click();
  }
}
