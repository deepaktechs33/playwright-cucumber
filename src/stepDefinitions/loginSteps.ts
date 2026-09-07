import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';
import { TIMEOUTS } from '../config/timeouts';

Given('user is on the Swag Labs login page', async function (this: CustomWorld) {
  expect(await this.loginPage.isLogoDisplayed(), 'App logo is not displayed on the login page').toBeTruthy();
});

When(
  'user logs in with username {string} and password {string}',
  { timeout: TIMEOUTS.LOGIN_STEP },
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  }
);

Then('user should be navigated to the products page', async function (this: CustomWorld) {
  expect(await this.homePage.isCartIconDisplayed(), 'Cart icon not visible — login likely failed').toBeTruthy();
});

Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  expect(await this.homePage.getPageTitle()).toEqual(expectedTitle);
});

Then('user should see an error message {string}', async function (this: CustomWorld, expectedError: string) {
  expect(await this.loginPage.isErrorDisplayed(), 'Error message was not displayed').toBeTruthy();
  const actual = await this.loginPage.getErrorMessage();
  expect(actual.includes(expectedError), `Error text mismatch. Actual: ${actual}`).toBeTruthy();
});
