import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';

const policiesPage = new PoliciesPage();

When('I click the view Cover details link for a current home policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(0);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

When('I click the view Cover details link for a old home policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(1);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();

});

Then('I can access the home Cover details page', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.cover-type')).to.be.true;
});

When('I view Cover details for a current home policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(0);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

Then('I should see all relevant home policy information', async () => {

  /*Title */
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Home');
  expect(await utils.checkFirstElementIsDisplayed('.policy-number')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.postcode')).to.be.true;

  /*Your cover dates */
  expect(await utils.checkFirstElementIsDisplayed('.start-date')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.end-date')).to.be.true;

  /*Policyholder details */
  expect(await utils.checkElementIsDisplayed('.policyholder')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.joint-policyholder')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.children')).to.be.true;

  /* What's covered */
  expect(await utils.checkElementIsDisplayed('.policy-cover-type')).to.be.true;
  expect(await utils.checkElementIsPresent('.ncd-years')).to.be.false;
  expect(await utils.checkElementIsDisplayed('.building-sum')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.acc-dam-building')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.content-sum')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.household-sum')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.high-risk-sum')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.acc-dam-content')).to.be.true;

  /* Personal possessions */
  expect(await utils.checkElementIsPresent('.personal-possessions')).to.be.true;

  /*Your specified items */
  expect(await utils.checkElementIsPresent('.high-value-items')).to.be.true;

  /*Your optional extras */
  expect(await utils.elementFinder('.hec').getAttribute('class')).to.contain(' purchased hec');
  expect(await utils.elementFinder('.flp').getAttribute('class')).to.contain(' purchased flp ');
  expect(await utils.elementFinder('.pes').getAttribute('class')).to.contain(' purchased pes');
  expect(await utils.elementFinder('.win').getAttribute('class')).to.contain(' purchased win');
  expect(await utils.elementFinder('.atv').getAttribute('class')).to.contain('not-purchased');

  /*Your excess */
  expect(await utils.checkFirstElementIsDisplayed('.excess')).to.be.true;

  /* Total cost*/
  expect(await utils.checkElementIsDisplayed('.total-cost')).to.be.true;
});

When('I view cover details for a buildings only policy', async () => {
  await policiesPage.clickSpecifiedViewDetailsLink(1);
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

Then('contents related fields do not appear', async () => {
  /*Title */
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Home');
  expect(await utils.checkFirstElementIsDisplayed('.policy-number')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).to.be.true;

  /* What's covered */
  expect(await utils.checkElementIsDisplayed('.policy-cover-type')).to.be.true;
  expect(await utils.checkElementIsPresent('.ncd-years')).to.be.false;
  expect(await utils.checkElementIsDisplayed('.building-sum')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.acc-dam-building')).to.be.true;
  expect(await utils.checkElementIsPresent('.content-sum')).to.be.false;
  expect(await utils.checkElementIsPresent('.household-sum')).to.be.false;
  expect(await utils.checkElementIsPresent('.high-risk-sum')).to.be.false;
  expect(await utils.checkElementIsPresent('.acc-dam-content')).to.be.false;

  /* Personal possessions */
  expect(await utils.checkElementIsPresent('.personal-possessions')).to.be.false;
});
