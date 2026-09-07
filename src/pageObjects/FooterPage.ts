import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Mirrors pageObject/FooterPage.java
export class FooterPage extends BasePage {
  readonly footer: Locator;
  readonly footerCopyText: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.locator('.footer');
    this.footerCopyText = page.locator('.footer_copy');
    this.twitterLink = page.locator('.social_twitter');
    this.facebookLink = page.locator('.social_facebook');
    this.linkedinLink = page.locator('.social_linkedin');
  }

  // Scrolls the footer into view so its contents are actually rendered/visible before assertions run.
  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }

  async getFooterText(): Promise<string> {
    return ((await this.footerCopyText.textContent()) ?? '').trim();
  }

  // SauceDemo renders the copyright line and the policy links inside the same footer_copy element,
  // e.g. "© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy"
  async isCopyrightTextDisplayed(): Promise<boolean> {
    try {
      const text = await this.getFooterText();
      return text.toLowerCase().includes('all rights reserved');
    } catch {
      return false;
    }
  }

  async isPolicyTextDisplayed(): Promise<boolean> {
    try {
      const text = await this.getFooterText();
      return text.includes('Terms of Service') && text.includes('Privacy Policy');
    } catch {
      return false;
    }
  }

  async areSocialMediaLinksDisplayed(): Promise<boolean> {
    try {
      const twitter = await this.twitterLink.isVisible();
      const facebook = await this.facebookLink.isVisible();
      const linkedin = await this.linkedinLink.isVisible();
      return twitter && facebook && linkedin;
    } catch {
      return false;
    }
  }
}
