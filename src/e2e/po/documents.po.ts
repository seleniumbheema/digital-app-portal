import { element, by, browser, ExpectedConditions, ElementFinder } from 'protractor';

export class DocumentsPage {

  async hasViewDetailsTab(): Promise<boolean> {
    const viewDetailsTab = element(by.css('.tabs.is-boxed .view-details'));
    await browser.wait(ExpectedConditions.elementToBeClickable(viewDetailsTab), 5000, 'Element took too long to appear in the DOM');
    return viewDetailsTab.isDisplayed();
  }

  async hasViewDocsTab(): Promise<boolean> {
    const viewDocsTab = element(by.css('.tabs.is-boxed .view-docs'));
    await browser.wait(ExpectedConditions.elementToBeClickable(viewDocsTab), 5000, 'Element took too long to appear in the DOM');
    return viewDocsTab.isDisplayed();
  }

  async hasMakeChangeTab(): Promise<boolean> {
    const makeChangeTab = element(by.css('.tabs.is-boxed .make-change'));
    await browser.wait(ExpectedConditions.elementToBeClickable(makeChangeTab), 5000, 'Element took too long to appear in the DOM');
    return makeChangeTab.isDisplayed();
  }

  async hasMakeClaimTab(): Promise<boolean> {
    const makeClaimTab = element(by.css('.tabs.is-boxed .make-claim'));
    await browser.wait(ExpectedConditions.elementToBeClickable(makeClaimTab), 5000, 'Element took too long to appear in the DOM');
    return makeClaimTab.isDisplayed();
  }

  async getCurrentDocumentsHeader(): Promise<ElementFinder> {
    const header = element(by.css('#documents h2:first-of-type'));
    await browser.wait(ExpectedConditions.visibilityOf(header), 5000, 'Element took too long to appear in the DOM');
    return header;
  }

  getPreviousDocumentsHeader(): ElementFinder {
    return element.all(by.css('#documents h2')).get(1);
  }

}
