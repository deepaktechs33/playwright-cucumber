import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

// Mirrors stepDefination/FooterStepsDefination.java

When('the user scrolls to the footer', async function (this: CustomWorld) {
  await this.footerPage.scrollToFooter();
});

Then('the footer should show the copyright and policy text', async function (this: CustomWorld) {
  expect(await this.footerPage.isCopyrightTextDisplayed(), 'Copyright text not displayed in footer').toBeTruthy();
  expect(
    await this.footerPage.isPolicyTextDisplayed(),
    'Policy text (Terms of Service / Privacy Policy) not displayed in footer'
  ).toBeTruthy();
});

Then('the social media links should be displayed', async function (this: CustomWorld) {
  expect(
    await this.footerPage.areSocialMediaLinksDisplayed(),
    'Social media links are not displayed in footer'
  ).toBeTruthy();
});
