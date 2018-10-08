import { browser, element, by, ExpectedConditions, promise } from 'protractor';
import { expect } from 'chai';

import { ProtractorUtils as utils } from './utilities.po';

export class SidebarNav {

  async sidebarPosition(): Promise<number> {
    const open = await element(by.css('.ng-sidebar')).getLocation();
    return open.x;
  }

  clickHamburgerBtn(): promise.Promise<void> {
    const clickHamburgerBtn = element(by.css('.hamburger-btn'));
    clickHamburgerBtn.click();
    return browser.sleep(750);
  }

  clickSpecialOffersBtn(): promise.Promise<void> {
    const clickSpecialOffers = element(by.css('aside a[href="/portal/offers"]'));
    return clickSpecialOffers.click();
  }

  async clickMyDetailsBtn(): Promise<void> {
    await utils.getElementByIdAndClick('nav-account');
    expect(await utils.waitUntilRouteChangedTo('/account')).to.be.true;
    await utils.waitForViewAnimation();
  }

  async waitForSidebarOpen(): Promise<any> {
    const sidebarOpened = element(by.css('aside.ng-sidebar--opened'));
    // The debounce time on window resize is 500ms, so need to sleep for that time too
    await browser.sleep(750);
    return browser.driver.wait(ExpectedConditions.presenceOf(sidebarOpened), 1000, 'sidebar not visible');
  }

  async waitForSidebarClosed(): Promise<any> {
    const sidebarClosed = element(by.css('aside.ng-sidebar--closed'));
    // The debounce time on window resize is 500ms, so need to sleep for that time too
    await browser.sleep(750);
    return browser.driver.wait(ExpectedConditions.presenceOf(sidebarClosed), 1000, 'sidebar still visible');
  }

}
