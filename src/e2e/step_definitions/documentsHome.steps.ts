import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';
import { ElementFinder } from 'protractor';
import { DocumentsPage } from '../po/documents.po';

const policiesPage = new PoliciesPage();
const documentsPage = new DocumentsPage();

When('I click the view Documents link for a current home policy', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(0);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

When('I click the view Documents link for a old home policy', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(4);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();

});

Then('I can access the home Documents page', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.cover-type')).to.be.true;
});

When('I view Documents for a current home policy', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(1);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

Then('I should see all relevant home documents elements', async () => {
  const header: ElementFinder = await documentsPage.getCurrentDocumentsHeader();
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Home');
  expect(await utils.checkFirstElementIsDisplayed('.policy-number')).to.be.true;

  expect(await header.getText()).to.contain('Current policy documents');
  expect(await utils.elementArrayFinder('#documents header.card-header').count()).to.equal(1);
  expect(await utils.elementArrayFinder('#documents .content .columns').count()).to.equal(5);
  expect(await utils.elementArrayFinder('#documents .content .columns .fa-download').count()).to.equal(5);
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-minus').count()).to.equal(1);

  await utils.elementArrayFinder('#documents header.card-header').click();
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-plus').count()).to.equal(1);
});

When('I view Documents for a current home policy with multiple past policy years', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(2);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

Then('I should see all relevant home documents elements for all years', async () => {
  const header: ElementFinder = await documentsPage.getCurrentDocumentsHeader();
  expect(await header.getText()).to.contain('Current policy documents');
  expect(await documentsPage.getPreviousDocumentsHeader().getText()).to.contain('Previous policy documents');
  expect(await utils.elementArrayFinder('#documents header.card-header').count()).to.equal(7);

  /*checks expanded and collapsed sections */
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-minus').count()).to.equal(2);
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-plus').count()).to.equal(5);
});

When('I view Documents for a policy with no documents', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(0);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

Then('The page loads with the no policies banner', async () => {
  expect(await utils.checkElementIsDisplayed('.notification.messages-container.is-info'));
});
