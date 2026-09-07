import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';
import { config } from '../config/config';
import { TIMEOUTS } from '../config/timeouts';
import { STANDARD_USER } from '../data/testUsers';

// Mirrors stepDefination/HamburgerStepsDefination.java

When('the user opens the hamburger menu', async function (this: CustomWorld) {
  await this.hamburgerPage.openMenu();
});

Then('the menu should display the following options:', async function (this: CustomWorld, dataTable: DataTable) {
  const options = dataTable.raw().map((row) => row[0]);
  for (const option of options) {
    expect(
      await this.hamburgerPage.isMenuOptionDisplayed(option),
      `'${option}' menu option not displayed`
    ).toBeTruthy();
  }
});

When('the user clicks on the {string} menu option', async function (this: CustomWorld, optionName: string) {
  await this.hamburgerPage.clickMenuOption(optionName);
});

When(
  'the user navigates back to the previous page',
  { timeout: TIMEOUTS.HAMBURGER_BACK_NAVIGATION_STEP },
  async function (this: CustomWorld) {
    // Wait for the "About" click's navigation to actually land on saucelabs.com
    // before issuing our own navigation — prevents the two navigations from
    // racing in the same page, which was leaving the login form blank/unsubmitted.
    await this.page.waitForURL(/saucelabs\.com/, { timeout: TIMEOUTS.SAUCELABS_REDIRECT });

    await this.page.goto(config.appURL);
    await this.loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await this.page.waitForURL(new URL('inventory.html', config.appURL).toString(), {
      timeout: TIMEOUTS.INVENTORY_RETURN,
    });
  }
);

Then('the user should be redirected to the login page', async function (this: CustomWorld) {
  await this.page.waitForURL(config.appURL, { timeout: TIMEOUTS.LOGIN_PAGE_RETURN });
  expect(this.page.url(), 'User was not redirected to the login page after logout').toEqual(config.appURL);
});

Then('the cart badge should show {string}', async function (this: CustomWorld, expectedCount: string) {
  expect(await this.homePage.getCartBadgeCount(), 'Cart badge count did not match').toEqual(expectedCount);
});

Then('the cart badge should not be displayed', async function (this: CustomWorld) {
  expect(await this.homePage.isCartBadgeDisplayed(), 'Cart badge is still visible after Reset App State').toBeFalsy();
});
