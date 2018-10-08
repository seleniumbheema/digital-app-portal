import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';
import { ElementFinder } from 'protractor';
import { DocumentsPage } from '../po/documents.po';

const policiesPage = new PoliciesPage();
const documentsPage = new DocumentsPage();

When('I click the view Documents link for a current motor policy', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(3);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

Then('I can access the motor Documents page', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.cover-type')).to.be.true;
});

When('I view Documents for an old motor policy with multiple past policy years', async () => {
  await policiesPage.clickSpecifiedViewDocumentsLink(5);
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

Then('I should see all relevant motor documents elements for all years', async () => {
  const header: ElementFinder = await documentsPage.getCurrentDocumentsHeader();
  expect(await header.getText()).to.contain('Previous policy documents');
  expect(await utils.elementArrayFinder('#documents .content .columns .fa-download').count()).to.equal(3);
  expect(await utils.elementArrayFinder('#documents header.card-header').count()).to.equal(8);

  /*checks expanded and collapsed sections */
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-minus').count()).to.equal(1);
  expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-plus').count()).to.equal(7);
});
