import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';

const policiesPage = new PoliciesPage();

When('I click the Make a claim link for a Home policy', async () => {
  await policiesPage.clickSpecifiedMakeClaimLink(0);
});

Then('I can see all Home claim information including telephone numbers', async () => {
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Home');
  expect(await utils.getFirstElementText('.policy-number')).to.contain('Policy number');
  expect(await utils.getFirstElementText('.policy-card')).to.contain('Call our claims helpline');
  expect(await utils.getFirstElementText('.policy-card')).to.contain('Call home claims');
  expect(await utils.checkElementIsDisplayed('.policy-card a[href="tel:0345 601 7072"]')).to.be.true;
  expect(await utils.getFirstElementText('.policy-card')).to.contain('Additional phone numbers');
  expect(await utils.checkElementCanBeClicked('.view-docs')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.view-details')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-claim')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-change')).to.be.true;
});
