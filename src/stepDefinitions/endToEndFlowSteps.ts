import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

// Mirrors stepDefination/EndToEndFlowStepsDefination.java

When('the user adds {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.homePage.addProductToCart(productName);
});

When('the user goes to the cart', async function (this: CustomWorld) {
  await this.homePage.goToCart();
});

Then('the product {string} should be present in the cart', async function (this: CustomWorld, productName: string) {
  expect(
      await this.cartPage.isProductPresent(productName),
      `Product '${productName}' was not found in the cart`
  ).toBeTruthy();
});

When('the user clicks on the checkout button', async function (this: CustomWorld) {
  await this.cartPage.clickCheckout();
});

When('the user enters {string} {string} {string} as checkout details', async function (
    this: CustomWorld,
    firstName: string,
    lastName: string,
    zip: string
) {
  await this.checkoutInfoPage.enterDetails(firstName, lastName, zip);
});

// cucumber-js has no separate @And decorator — Gherkin's "And" resolves to
// whichever step type it's continuing, so this registers like any other step.
When('the user clicks the continue button', async function (this: CustomWorld) {
  await this.checkoutInfoPage.clickContinue();
});

Then('the user should be navigated to the checkout overview page', async function (this: CustomWorld) {
  expect(
      await this.checkoutOverviewPage.getPageTitle(),
      'Checkout overview page did not load as expected'
  ).toEqual('Checkout: Overview');
});

When('the user clicks the finish button', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.clickFinish();
});

Then('the order confirmation should be displayed', async function (this: CustomWorld) {
  expect(
      await this.checkoutCompletePage.getConfirmationHeader(),
      'Order confirmation header did not match the expected value'
  ).toEqual('Thank you for your order!');
});

When('the user clicks on back to home button', async function (this: CustomWorld) {
  await this.checkoutCompletePage.clickBackHome();
});

Then('the user should be back on the products page', async function (this: CustomWorld) {
  expect(
      await this.homePage.getPageTitle(),
      'User was not navigated back to the products page'
  ).toEqual('Products');
});
