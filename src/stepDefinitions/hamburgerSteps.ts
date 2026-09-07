import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

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

When('the user navigates back to the previous page', { timeout: 60000 }, async function (this: CustomWorld) {
  // Wait for the "About" click's navigation to actually land on saucelabs.com
  // before issuing our own navigation — prevents the two navigations from
  // racing in the same page, which was leaving the login form blank/unsubmitted.
  await this.page.waitForURL(/saucelabs\.com/, { timeout: 15000 });

  await this.page.goto('https://www.saucedemo.com/');
  await this.loginPage.login('standard_user', 'secret_sauce');
  await this.page.waitForURL('https://www.saucedemo.com/inventory.html', { timeout: 25000 });
});

Then('the user should be redirected to the login page', async function (this: CustomWorld) {
  await this.page.waitForURL('https://www.saucedemo.com/', { timeout: 10000 });
  expect(this.page.url(), 'User was not redirected to the login page after logout').toEqual(
      'https://www.saucedemo.com/'
  );
});

Then('the cart badge should show {string}', async function (this: CustomWorld, expectedCount: string) {
  expect(await this.homePage.getCartBadgeCount(), 'Cart badge count did not match').toEqual(expectedCount);
});

Then('the cart badge should not be displayed', async function (this: CustomWorld) {
  expect(await this.homePage.isCartBadgeDisplayed(), 'Cart badge is still visible after Reset App State').toBeFalsy();
});
