import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';

const policiesPage = new PoliciesPage();

When('I click the Make a claim link for a Motor policy', async () => {
  await policiesPage.clickSpecifiedMakeClaimLink(0);
});

Then('I can see all Motor claim information including telephone numbers', async () => {
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Car');
  expect(await utils.getFirstElementText('.policy-number')).to.contain('Policy number');
  expect(await utils.getFirstElementText('.policy-card')).to.contain('Please contact our claims helpline');
  expect(await utils.getFirstElementText('.policy-card')).to.contain('Call car claims');
  expect(await utils.checkFirstElementIsDisplayed('.policy-card a[href="tel:0345 603 7872"]')).to.be.true;
  expect(await utils.getFirstElementText('.policy-card')).to.contain('If you\'ve had an accident outside of these hours');
  expect(await utils.checkFirstElementIsDisplayed('.policy-card a[href="tel:0800 085 8533"]')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.view-docs')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.view-details')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-claim')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-change')).to.be.true;
});

Then('I can access the accident support page', async () => {
  expect(await utils.getFirstElementText('.notification')).to.contain('Find out more about esure Accident support');
  expect(await utils.checkElementCanBeClicked('a[href="/info/accident-support"]')).to.be.true;
});
