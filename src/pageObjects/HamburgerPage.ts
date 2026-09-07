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
    this.hamburgerIcon = page.locator('#react-burger-menu-btn');
    this.lnkAllItems = page.locator('#inventory_sidebar_link');
    this.lnkAbout = page.locator('#about_sidebar_link');
    this.lnkLogout = page.locator('#logout_sidebar_link');
    this.lnkResetAppState = page.locator('#reset_sidebar_link');
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

  async isMenuOptionDisplayed(optionName: string): Promise<boolean> {
    try {
      return await this.getMenuElement(optionName).isVisible();
    } catch {
      return false;
    }
  }

  async clickMenuOption(optionName: string): Promise<void> {
    await this.getMenuElement(optionName).click();
  }
}
