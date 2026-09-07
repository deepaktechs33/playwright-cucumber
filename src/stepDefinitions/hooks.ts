import { Before, After, AfterStep, Status, ITestCaseHookParameter, ITestStepHookParameter } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';
import { CustomWorld } from '../world/CustomWorld';
import { BrowserFactory } from '../factory/BrowserFactory';
import { config } from '../config/config';

Before(async function (this: CustomWorld) {
  this.browser = await BrowserFactory.launchBrowser();
  this.context = await this.browser.newContext({ viewport: null });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(20000); // more headroom for slower engines (WebKit/Firefox) vs Chrome/Edge
  this.initPageObjects();
  await this.page.goto(config.appURL, { timeout: 40000 });
});


After({ timeout: 15000 }, async function (this: CustomWorld, testCase: ITestCaseHookParameter) {
  if (testCase.result?.status === Status.FAILED) {
    await saveScreenshot(this, `${testCase.pickle.name}_FAILED`);
  }
  // Hold the browser open for a moment after the scenario finishes so the
  // final state is visible, instead of it closing immediately.
  if (this.page && !this.page.isClosed() && config.holdMs > 0) {
    await this.page.waitForTimeout(config.holdMs);
  }
  if (this.browser) {
    await this.browser.close();
  }
});


AfterStep(async function (this: CustomWorld, { pickleStep }: ITestStepHookParameter) {
  if (pickleStep.type === 'Outcome') {
    await saveScreenshot(this, `${pickleStep.text}_THEN`);
  }
});

// Formats a Date as "11-Sep-2026_14-32-05-098" — readable, still sorts
// chronologically, and keeps millisecond precision so screenshots taken
// moments apart never overwrite each other.
function formatTimestamp(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}-${ms}`;
}

async function saveScreenshot(world: CustomWorld, fileNameBase: string): Promise<void> {
  if (!world.page || world.page.isClosed()) {
    return;
  }
  const safeName = fileNameBase.replace(/[^a-zA-Z0-9.-]/g, '_');
  const destination = path.join(
      process.cwd(),
      'screenshots',
      `${safeName}_${formatTimestamp(new Date())}.png`
  );
  try {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    await world.page.screenshot({ path: destination });
    console.log(`Screenshot saved at: ${destination}`);
  } catch (e) {
    console.error('Failed to save screenshot', e);
  }
}
