import { After, AfterAll, BeforeAll, Status, HookScenarioResult, Before, setDefaultTimeout } from 'cucumber';
import { browser } from 'protractor';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { config } from '../../../protractor.cucumber.conf';

// Set the default cucumber timeout for async hooks to 20 seconds (default is only 5)
setDefaultTimeout(20 * 1000);

/**
 * Before all scenarios, navigates to a static js file so that we are able to set cookies.
 */
BeforeAll(async (): Promise<void> => {
  // Use the native webdriver get function because the URL we request is not an Angular page.
  await browser.driver.get(`${config.baseUrl}scripts/esure-env.js`);
  // Set the cookie that will stop the Ensighten cookie banner showing up.
  await utils.setEnsightenCookie();
});

/**
 * Delete app storage before each scenario.
 */
Before(async (): Promise<void> => {
  await utils.deleteAppStorage();
});

/**
 * Skip any tags marked @Skip, can be put above Feature or on individual Scenario.
 */
Before('@Skip', () => {
  return 'skipped';
});

/**
 * Takes the screenshot if scenario failed, need to use standard function rather than ES6 arrow function in order to preserve 'this'.
 */
After(async function (scenario: HookScenarioResult): Promise<void> {
  if (scenario.result.status === Status.FAILED) {
    // screenShot is a base-64 encoded PNG
    const screenShot = await browser.takeScreenshot();
    this.attach(screenShot, 'image/png');
  }
});

/**
 * Close the browser once all scenarios finished.
 */
AfterAll(async (): Promise<void> => {
  await browser.quit();
});
