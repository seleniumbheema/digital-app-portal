import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';

const policiesPage = new PoliciesPage();

When('I click the view Cover details link for a current motor policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(0);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

When('I click the view Cover details link for an old motor policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(2);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

Then('I can access the motor Cover details page', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.cover-type')).to.be.true;
});

When('I view Cover details for a current motor policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(0);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

Then('I should see all relevant motor policy information', async () => {

  /*Title */
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Car');
  expect(await utils.checkFirstElementIsDisplayed('.policy-number')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.vehicle-reg')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.ncd-years')).to.be.true;

  /*Your cover dates */
  expect(await utils.checkFirstElementIsDisplayed('.start-date')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.end-date')).to.be.true;

  /*Policyholder details */
  expect(await utils.checkElementIsDisplayed('.main-driver')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.named-driver')).to.be.true;

  /* What's covered */
  expect(await utils.checkElementIsDisplayed('.policy-cover-type')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.use-class')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.other-vehicle')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.est-mileage')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.eu-cover')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.ncd-years')).to.be.true;

  /*Your optional extras */
  expect(await utils.elementFinder('.kyc').getAttribute('class')).to.contain(' purchased kyc');
  expect(await utils.elementFinder('.mfs').getAttribute('class')).to.contain(' purchased mfs ');
  expect(await utils.elementFinder('.mlp').getAttribute('class')).to.contain(' purchased mlp');
  expect(await utils.elementFinder('.pib').getAttribute('class')).to.contain('not-purchased pib');
  expect(await utils.elementFinder('.bkc').getAttribute('class')).to.contain('not-purchased bkc');

  /*Your excess */
  expect(await utils.checkFirstElementIsDisplayed('.excess')).to.be.true;

  /* Total cost*/
  expect(await utils.checkElementIsDisplayed('.total-cost')).to.be.true;
});
