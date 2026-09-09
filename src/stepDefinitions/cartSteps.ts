import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

// Mirrors stepDefination/CartStepsDefination.java

Given('the user has added {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.homePage.addProductToCart(productName);
});

When('the user navigates to the cart page', async function (this: CustomWorld) {
  await this.homePage.goToCart();
});

When('the user adds the following products to the cart:', async function (this: CustomWorld, dataTable: DataTable) {
  const products = dataTable.raw().map((row) => row[0]);
  for (const product of products) {
    await this.homePage.addProductToCart(product);
  }
});

When('the user removes {string} from the cart', async function (this: CustomWorld, productName: string) {
  await this.cartPage.removeProductFromCart(productName);
});

Then('the cart should contain {string}', async function (this: CustomWorld, productName: string) {
  expect(
    await this.cartPage.isProductPresent(productName),
    `Expected '${productName}' to be in the cart, but it was not found`
  ).toBeTruthy();
});

Then('the cart should not contain {string}', async function (this: CustomWorld, productName: string) {
  expect(
    await this.cartPage.isProductPresent(productName),
    `Expected '${productName}' to NOT be in the cart, but it was found`
  ).toBeFalsy();
});

Then('the cart item count should be {int}', async function (this: CustomWorld, expectedCount: number) {
  expect(await this.cartPage.getCartItemCount(), 'Cart item count did not match the expected value').toEqual(
    expectedCount
  );
});
