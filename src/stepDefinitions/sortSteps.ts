import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

// Mirrors stepDefination/SortStepsDefination.java

When('the user opens the sort filter', async function (this: CustomWorld) {
  await this.sortPage.clickSortDropdown();
});

When('the user selects the {string} sort option', async function (this: CustomWorld, sortOption: string) {
  await this.sortPage.selectSortOption(sortOption);
});

Then('the products should be sorted by {string}', async function (this: CustomWorld, sortOption: string) {
  expect(
      await this.sortPage.getSelectedSortOption(),
      'Dropdown did not show the selected sort option'
  ).toEqual(sortOption);
  expect(
      await this.sortPage.isSortWorkingCorrectly(sortOption),
      `Products are not actually sorted by ${sortOption}`
  ).toBeTruthy();
});
