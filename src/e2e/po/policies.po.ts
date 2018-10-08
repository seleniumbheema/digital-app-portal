import { element, by, ElementArrayFinder, browser, ExpectedConditions } from 'protractor';
import { expect } from 'chai';

import { ProtractorUtils as utils } from './app/utilities.po';

/*
  TODO - Use model or binding
  locating by.model or by.binding is preferred option to brittle by.css
  in most cases. But, currently not supported in ng2.
  github issue: https://github.com/angular/protractor/issues/3205
*/

export class PoliciesPage {
  allStartDates(): ElementArrayFinder {
    const hasStartDates = element.all(by.css('.start-date'));
    return hasStartDates;
  }

  async clickSecondViewDetailsLink(): Promise<void> {
    const secondViewDetailsLink = element.all(by.css('.policy-card a.view-details')).get(1);
    await browser.wait(ExpectedConditions.elementToBeClickable(secondViewDetailsLink), 5000, 'Element took too long to appear in the DOM');
    return secondViewDetailsLink.click();
  }

  async clickSpecifiedViewDetailsLink(index: number): Promise<void> {
    const viewDetailsLink = element.all(by.css('.policy-card a.view-details')).get(index);
    await browser.wait(ExpectedConditions.elementToBeClickable(viewDetailsLink), 5000, 'Element took too long to appear in the DOM');
    return viewDetailsLink.click();
  }

  async clickSpecifiedViewDocumentsLink(index: number): Promise<void> {
    const viewDocumentsLink = element.all(by.css('.policy-card a.view-docs')).get(index);
    await browser.wait(ExpectedConditions.elementToBeClickable(viewDocumentsLink), 5000, 'Element took too long to appear in the DOM');
    return viewDocumentsLink.click();
  }

  async clickSpecifiedMakeChangesLink(index: number): Promise<void> {
    const makeChangeLink = element.all(by.css('.policy-card a.make-change')).get(index);
    await browser.wait(ExpectedConditions.elementToBeClickable(makeChangeLink), 5000, 'Element took too long to appear in the DOM');
    await makeChangeLink.click();
    expect(await utils.waitUntilRouteChangedTo('/amendments')).to.be.true;
    await utils.waitForViewAnimation();
  }

  async waitForPolicyCard(): Promise<void> {
    if (browser.params.animations === true) {
      const policyCard = element.all(by.css('.policy-card')).first();
      await browser.wait(ExpectedConditions.visibilityOf(policyCard), 5000, 'Element took too long to appear in the DOM');
    }
  }

  async clickSpecifiedMakeClaimLink(index: number): Promise<void> {
    const makeClaimLink = element.all(by.css('.policy-card a.make-claim')).get(index);
    await browser.wait(ExpectedConditions.elementToBeClickable(makeClaimLink), 5000, 'Element took too long to appear in the DOM');
    await makeClaimLink.click();
    expect(await utils.waitUntilRouteChangedTo('/claim')).to.be.true;
    await utils.waitForViewAnimation();
  }

}
