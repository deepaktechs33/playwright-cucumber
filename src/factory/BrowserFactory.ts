import { Browser, chromium, firefox, webkit } from '@playwright/test';
import { config } from '../config/config';
export class BrowserFactory {
  static async launchBrowser(): Promise<Browser> {
    const browserName = config.browser;
    const isHeadless = config.headless;

    if (config.executionEnv === 'remote') {
      throw new Error(
          'Remote execution is not wired up in this conversion — the original ' +
          'RemoteWebDriver endpoint was a non-functional placeholder. ' +
          'Use browserType.connect(wsEndpoint) here with a real grid/cloud URL.'
      );
    }

    const chromiumArgs = ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'];

    switch (browserName) {
      case 'chrome':
        return chromium.launch({
          headless: isHeadless,
          slowMo: config.slowMo,
          args: chromiumArgs,
        });
      case 'edge':
        return chromium.launch({
          headless: isHeadless,
          slowMo: config.slowMo,
          channel: 'msedge',
          args: chromiumArgs,
        });
      case 'firefox':
        return firefox.launch({ headless: isHeadless, slowMo: config.slowMo });
      case 'webkit':
        return webkit.launch({ headless: isHeadless, slowMo: config.slowMo });
      default:
        throw new Error(`No matching browser configured: ${browserName}`);
    }
  }
}
