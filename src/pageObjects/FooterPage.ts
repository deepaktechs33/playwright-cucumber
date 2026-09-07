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
    // Verified against the live DOM (data-test attributes).
    this.footer = page.getByTestId('footer');
    this.footerCopyText = page.getByTestId('footer-copy');
    this.twitterLink = page.getByTestId('social-twitter');
    this.facebookLink = page.getByTestId('social-facebook');
    this.linkedinLink = page.getByTestId('social-linkedin');
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

  // isVisible() never throws for a missing element -- no try/catch needed
  // (see HomePage.isCartIconDisplayed for the full rationale).
  async areSocialMediaLinksDisplayed(): Promise<boolean> {
    const [twitter, facebook, linkedin] = await Promise.all([
      this.twitterLink.isVisible(),
      this.facebookLink.isVisible(),
      this.linkedinLink.isVisible(),
    ]);
    return twitter && facebook && linkedin;
  }
}
