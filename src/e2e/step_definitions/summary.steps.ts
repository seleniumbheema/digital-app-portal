import { expect } from 'chai';
import { When, Then } from 'cucumber';
import * as moment from 'moment';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { PoliciesPage } from '../po/policies.po';

const policiesPage = new PoliciesPage();

When('I view the Policy Summary page', async () => {
  expect(await utils.waitForFirstElementPresent('.cover-type')).to.be.true;
});

Then('I should see Policy summary details for my Motor policy', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.cover-type')).to.be.true;
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Car');
  expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.start-date')).to.be.true;
  expect(await utils.checkFirstElementIsDisplayed('.end-date')).to.be.true;
  expect(await utils.checkFirstLinkText('Cover details')).to.be.true;
  expect(await utils.checkFirstLinkText('My documents')).to.be.true;
  expect(await utils.checkFirstLinkText('Make changes')).to.be.true;
  expect(await utils.checkFirstLinkText('Make a claim')).to.be.true;
});

Then('I should see policy summary details for my Home policy', async () => {
  expect(await utils.checkElementIterationIsPresent('.cover-type', 1)).to.be.true;
  expect(await utils.getElementTextIteration('.cover-type', 1)).to.contain('Home');
  expect(await utils.checkElementIterationIsPresent('.policy-identifier', 1)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.start-date', 1)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.end-date', 1)).to.be.true;
  expect(await utils.checkIterationLinkText('Cover details', 1)).to.be.true;
  expect(await utils.checkIterationLinkText('My documents', 1)).to.be.true;
  expect(await utils.checkIterationLinkText('Make changes', 1)).to.be.true;
  expect(await utils.checkIterationLinkText('Make a claim', 1)).to.be.true;
});

Then('the policies are ordered in reverse chronological order', async () => {
  let isPreSorted = true;
  const allDates = policiesPage.allStartDates();
  const texts = await allDates.map(elm => elm.getText());

  texts.map((text) => {
    return +moment(text, 'ddd D, MMM YYYY');
  })
    .sort((a, b) => {
      isPreSorted = isPreSorted && (a > b);
      return a - b;
    });

  expect(isPreSorted).to.be.true;
});

Then('only Cover details and My documents links are visible on old policies', async () => {
  expect(await utils.checkElementIterationIsPresent('.cover-type', 2)).to.be.true;
  expect(await utils.getElementTextIteration('.cover-type', 2)).to.contain('Car');
  expect(await utils.checkElementIterationIsPresent('.policy-identifier', 2)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.start-date', 2)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.end-date', 2)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.view-details', 2)).to.be.true;
  expect(await utils.checkElementIterationIsPresent('.view-docs', 2)).to.be.true;
  expect(await utils.elementArrayFinder('.make-change').count()).to.equal(2);
  expect(await utils.elementArrayFinder('.make-claim').count()).to.equal(2);
});
