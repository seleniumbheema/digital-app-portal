import { element, by, ExpectedConditions, browser, promise, ElementArrayFinder, ElementFinder } from 'protractor';
import { expect } from 'chai';

const WAIT_TIME_MILLIS = 10000;

export abstract class ProtractorUtils {

  /**
   * Check linkText
   * @param text
   * @returns Promise {boolean}
   */
  static checkLinkText(text): promise.Promise<boolean> {
    const textToCheck = element(by.linkText(text));
    return textToCheck.isDisplayed();
  }

  /**
   * Check first matching linkText
   * @param text
   * @returns Promise {boolean}
   */
  static checkFirstLinkText(text: string): promise.Promise<boolean> {
    const textToCheck = element.all(by.linkText(text));
    return textToCheck.first().isDisplayed();
  }

  /**
   * Check iteration matching linkText
   * @param text
   * @returns Promise {boolean}
   */
  static checkIterationLinkText(text: string, iteration: number): promise.Promise<boolean> {
    const textToCheck = element.all(by.linkText(text));
    return textToCheck.get(iteration).isDisplayed();
  }

  /**
   * Check element is being displayed
   * @param selector
   * @returns Promise {boolean}
   */
  static checkElementIsDisplayed(selector: string): promise.Promise<boolean> {
    const textToCheck = element(by.css(selector));
    return textToCheck.isDisplayed();
  }

  /**
   * Check 1st element is being displayed
   * @param selector
   * @returns Promise {boolean}
   */
  static checkFirstElementIsDisplayed(selector: string): promise.Promise<boolean> {
    const elementName = element.all(by.css(selector));
    return elementName.first().isDisplayed();
  }

  /**
   * Check element is present
   * @param selector
   * @returns Promise {boolean}
   */
  static checkElementIsPresent(selector: string): promise.Promise<boolean> {
    const elementName = element(by.css(selector));
    return elementName.isPresent();
  }

  /**
   * Check element is present, waiting for it to become visible for 5 seconds.
   * @param selector
   * @returns Promise {boolean} true if element is not present
   */
  static async waitForElementPresent(selector: string): Promise<boolean> {
    const elementName = element(by.css(selector));
    await browser.wait(ExpectedConditions.visibilityOf(elementName), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${selector}`);
    return elementName.isPresent();
  }

  /**
   * Check element is present, waiting for it to become visible for 5 seconds.
   * @param selector
   * @returns Promise {boolean} true if element is not present
   */
  static async waitForFirstElementPresent(selector: string): Promise<boolean> {
    const elementName = element.all(by.css(selector));
    await browser.wait(
      ExpectedConditions.visibilityOf(elementName.first()), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${selector}`);
    return elementName.first().isDisplayed();
  }

  /**
   * Check element is not present, waiting for it to become stale for 5 seconds.
   * @param selector
   * @returns Promise {boolean}
   */
  static async waitForElementNotPresent(selector: string): Promise<boolean> {
    const elementName = element(by.css(selector));
    await browser.wait(ExpectedConditions.stalenessOf(elementName), WAIT_TIME_MILLIS, `Element took too long to disappear from the DOM: ${selector}`);
    return elementName.isPresent();
  }

  /**
   * Gets given elements text
   * @param selector
   * @returns Promise {string}
   */
  static getElementText(selector: string): promise.Promise<string> {
    const elementName = element(by.css(selector));
    return elementName.getText();
  }

  /**
   * Gets first given elements text
   * @param selector
   * @returns Promise {string}
   */
  static getFirstElementText(selector: string): promise.Promise<string> {
    const elementName = element.all(by.css(selector));
    return elementName.first().getText();
  }

  /**
   * Gets given element attribute
   * @param selector
   * @param attribute
   * @returns Promise {string}
   */
  static getElementAttribute(selector: string, attribute: string): promise.Promise<string> {
    const elementName = element(by.css(selector));
    return elementName.getAttribute(attribute);
  }

  /**
   * Gets first given element attribute
   * @param selector
   * @param attribute
   * @returns Promise {string}
   */
  static getFirstElementAttribute(selector: string, attribute: string): promise.Promise<string> {
    const elementName = element.all(by.css(selector));
    return elementName.first().getAttribute(attribute);
  }

  /**
   * Gets element attribute of a given iteration
   * @param selector
   * @param attribute
   * @param iteration
   * @returns Promise {string}
   */
  static getIterationElementAttribute(selector: string, attribute: string, iteration: number): promise.Promise<string> {
    const elementName = element.all(by.css(selector));
    return elementName.get(iteration).getAttribute(attribute);
  }

  /**
   * Gets elements text of a specified iteration
   * @param selector
   * @param iteration
   * @returns Promise {string}
   */
  static getElementTextIteration(selector: string, iteration: number): promise.Promise<string> {
    const elementName = element.all(by.css(selector));
    return elementName.get(iteration).getText();
  }

  /**
   * Checks element of a specified iteration
   * @param selector
   * @param iteration
   * @returns Promise {string}
   */
  static checkElementIterationIsPresent(selector: string, iteration: number): promise.Promise<boolean> {
    const elementName = element.all(by.css(selector));
    return elementName.get(iteration).isDisplayed();
  }
  /**
   * Gets given elements and clicks
   * @param selector
   * @returns Promise {void}
   */
  static getElementAndClick(selector: string): promise.Promise<void> {
    return element(by.css(selector)).click();
  }

  /**
  * Gets given elements and clicks
  * @param id
  * @returns Promise {void}
  */
  static getElementByIdAndClick(id: string): promise.Promise<void> {
    return element(by.id(id)).click();
  }

  /**
   * An Expectation for checking an element is visible and enabled
   * such that you can click it.
   * @param id the id to check
   * @returns Promise {boolean}
   */
  static async checkElementByIdCanBeClicked(id: string): Promise<boolean> {
    const elementName = element(by.id(id));
    await browser.wait(ExpectedConditions.elementToBeClickable(elementName), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${id}`);
    return elementName.isDisplayed();
  }

  /**
   * An Expectation for checking an element is visible and enabled
   * such that you can click it.
   * @param selector
   * @returns Promise {boolean}
   */
  static async checkElementCanBeClicked(selector: string): Promise<boolean> {
    const elementName = element.all(by.css(selector)).first();
    await browser.wait(
      ExpectedConditions.elementToBeClickable(elementName), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${selector}`);
    return elementName.isDisplayed();
  }

  /**
   * An Expectation for checking an element is visible and enabled
   * such that you can click it - then click it.
   * @param selector
   * @returns Promise {void}
   */
  static async checkFirstElementCanBeClickedAndClick(selector: string): Promise<void> {
    const elementName = element.all(by.css(selector)).first();
    await browser.wait(
      ExpectedConditions.elementToBeClickable(elementName), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${selector}`);
    return elementName.click();
  }

  static async waitForElementByIdAndClick(id: string): Promise<void> {
    const elementName = element(by.id(id));
    await browser.wait(ExpectedConditions.elementToBeClickable(elementName), WAIT_TIME_MILLIS, `Element took too long to appear in the DOM: ${id}`);
    await elementName.click();
  }

  /**
   * Gets a single element
   * @param selector
   * @returns the element found by the css selector
   */
  static elementFinder(selector: string): ElementFinder {
    return element(by.css(selector));
  }

  static async clickSelectOptionValue(selectId: string, value: string): Promise<void> {
    const option = element.all(by.cssContainingText(`select#${selectId} option`, value)).first();
    await option.click();
  }

  /**
   * Element Array Finder
   * @param selector
   * @returns all elements found by the css selector
   */
  static elementArrayFinder(selector: string): ElementArrayFinder {
    return element.all(by.css(selector));
  }

  /**
   * Wait for the app to be ready by checking the pre-bootstrap div is gone.
   *
   * @static
   * @param {boolean} [secondAttempt=false]
   * @returns {Promise<void>}
   * @memberof ProtractorUtils
   */
  static async waitUntilReady(secondAttempt: boolean = false): Promise<void> {
    const preBootstrap = this.elementFinder('#pre-bootstrap');
    try {
      await browser.driver.wait(ExpectedConditions.stalenessOf(preBootstrap), WAIT_TIME_MILLIS, 'loading screen still visible');
    } catch (error) {
      // Sometimes Angular is not loading correctly, so we give the app a second chance by triggering a refresh, and then wait again
      if (!secondAttempt) {
        await browser.refresh();
        await ProtractorUtils.waitUntilReady(true);
      } else {
        throw error;
      }
    }
  }

  /**
   * Navigate to specified URL
   * @returns {Promise<void>}
   */
  static async navigateTo(url: string): Promise<void> {
    await browser.get(url);
    await this.waitUntilReady();
  }

  /**
   * Convenience method for navigating to login page.
   * @returns {Promise<void>}
   */
  static async navigateToLogin(): Promise<void> {
    await this.navigateTo('/auth/login');
  }

  static async enterDateFields(dateOfBirth: string, fieldsArray: string[]): Promise<void> {
    const splitDob: string[] = dateOfBirth.split('-');
    const fieldsArrayLength = fieldsArray.length;
    // const promises = [];
    for (let i = 0; i < fieldsArrayLength; i += 1) {
      const fieldElement = element(by.id(fieldsArray[i]));
      await fieldElement.sendKeys(splitDob[i]);
    }
    // await Promise.all(promises);
  }

  static deleteAllCookies(): promise.Promise<void> {
    return browser.driver.manage().deleteAllCookies();
  }

  static setEnsightenCookie(): promise.Promise<void> {
    return (browser.driver.manage()).addCookie({ name: 'ESURE_ENSIGHTEN_PRIVACY_BANNER_VIEWED', value: '1' });
  }

  /**
   * Deletes all app storage, generically named so if we change from storing in cookies to local storage etc,
   * the method name doesn't need changing.
   */
  static deleteAppStorage(): promise.Promise<{}> {
    return this.deleteLocalStorage();
  }

  static deleteLocalStorage(): promise.Promise<{}> {
    return browser.driver.executeScript('localStorage.clear()');
  }

  // getCookies() {
  //   return browser.driver.manage().getCookies();
  // }

  static getCurrentUrl(): promise.Promise<string> {
    return browser.driver.getCurrentUrl();
  }

  // navigateToHome(): promise.Promise<any> {
  //   return browser.get('/');
  // }

  static setScreenDesktop(): promise.Promise<void> {
    return browser.manage().window().setSize(1042, 800);
  }

  // setScreenTablet(): promise.Promise<void> {
  //   return browser.manage().window().setSize(750, 800);
  // }

  static setScreenMobile(): promise.Promise<void> {
    return browser.manage().window().setSize(340, 600);
  }

  /**
   * Wait for the router animation to finish by checking the routerAnimating class does not exist in the DOM.
   */
  static waitForViewAnimation(): promise.Promise<any> {
    if (browser.params.animations === true) {
      const routeAnimation = element(by.className('routerAnimating'));
      return browser.wait(ExpectedConditions.stalenessOf(routeAnimation), WAIT_TIME_MILLIS, 'Router is still animating');
    }
  }

  static async waitUntilRouteChangedFrom(currentUrl: string): Promise<boolean> {
    return browser.driver.wait(
      async () => {
        const url = await browser.driver.getCurrentUrl();
        return url !== currentUrl;
      },
      WAIT_TIME_MILLIS);
  }

  static async waitUntilRouteChangedTo(toUrl: string): Promise<boolean> {
    return browser.driver.wait(
      async () => {
        const url = await browser.driver.getCurrentUrl();
        return new RegExp(toUrl).test(url);
      },
      WAIT_TIME_MILLIS);
  }

  static async checkNewTabOpenedAndCloseIt(): Promise<void> {
    const allWindows = await browser.getAllWindowHandles();
    expect(allWindows.length).to.equal(2);
    await browser.driver.switchTo().window(allWindows[1]);
    await browser.driver.close();
    await browser.driver.switchTo().window(allWindows[0]);
  }

}
