import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage';
import { HomePage } from '../pageObjects/HomePage';
import { SortPage } from '../pageObjects/SortPage';
import { FooterPage } from '../pageObjects/FooterPage';
import { CartPage } from '../pageObjects/CartPage';
import { CheckoutInfoPage } from '../pageObjects/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pageObjects/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pageObjects/CheckoutCompletePage';
import { HamburgerPage } from '../pageObjects/HamburgerPage';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  homePage!: HomePage;
  sortPage!: SortPage;
  footerPage!: FooterPage;
  cartPage!: CartPage;
  checkoutInfoPage!: CheckoutInfoPage;
  checkoutOverviewPage!: CheckoutOverviewPage;
  checkoutCompletePage!: CheckoutCompletePage;
  hamburgerPage!: HamburgerPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPageObjects(): void {
    this.loginPage = new LoginPage(this.page);
    this.homePage = new HomePage(this.page);
    this.footerPage = new FooterPage(this.page);
    this.sortPage = new SortPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutInfoPage = new CheckoutInfoPage(this.page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);
    this.hamburgerPage = new HamburgerPage(this.page);
  }
}
setWorldConstructor(CustomWorld);