import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';

Given('I navigate to the login page', async () => {
  await utils.navigateToLogin();
});

When('I view the login cross sell section', async () => {
  expect(await utils.checkElementIsDisplayed('.icon-car')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.icon-multicar')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.icon-buildings')).to.be.true;
});

When('I should see the login cross sell portal ads', async () => {
  expect(await utils.getElementTextIteration('.multi-offers h3', 0)).contain('Save 10% on our Car Insurance');
  expect(await utils.getElementTextIteration('.multi-offers h3', 1)).contain('Our customers save 10%');
  expect(await utils.getElementTextIteration('.multi-offers h3', 2)).contain('Quality, reassuring Home Insurance');

  expect(await utils.getElementTextIteration('.multi-offers h3~p', 0)).contain('Plus, get a courtesy car for');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 1)).contain('Our quality Multicar Insurance offers');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 2)).contain('Defaqto has rated our insurance 5-Star');
});

Then('I can follow the login cross sell links', async () => {
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 0)).contains('/car10');
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 1)).contains('/multicar10');
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 2)).contains('/home10');
});

Given('I navigate to the logout page', async () => {
  await utils.navigateTo('/auth/logout');
});

When('I view the logout cross sell section', async () => {
  expect(await utils.checkElementIsDisplayed('.offer_image')).to.be.true;
});

When('I should see the logout page cross sell portal ad', async () => {
  expect(await utils.getElementTextIteration('.offer_image h3', 0)).contain('Travel Insurance peace of mind');

  expect(await utils.getElementTextIteration('.offer_image h3~p', 0)).contain('Everyone deserves a holiday');
});

Then('I can follow the logout cross sell links', async () => {
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 0)).contains('/travel-insurance');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 0)).contains('/travel-insurance');
});

Given('I am on the timeout page', async () => {
  await utils.navigateTo('/error/timeout');
});

When('I view the timeout cross sell section', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.multi-offers')).to.be.true;
});

Then('I can follow the timeout cross sell links', async () => {
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 0)).contains('/multicar10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 0)).contains('/multicar10');

  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 1)).contains('/travel-insurance');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 1)).contains('/travel-insurance');

  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 2)).contains('/home10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 2)).contains('/home10');
});

When('I should see the timeout cross sell portal ads', async () => {
  expect(await utils.getElementTextIteration('.multi-offers h3', 0)).contain('Multicar Insurance');
  expect(await utils.getElementTextIteration('.multi-offers h3', 1)).contain('Travel Insurance');
  expect(await utils.getElementTextIteration('.multi-offers h3', 2)).contain('Home Insurance');

  expect(await utils.getElementTextIteration('.multi-offers h3~p', 0)).contain('Our quality cover offers convenient separate policies for each car');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 1)).contain('Whether you’re travelling in Europe or Worldwide,');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 2)).contain('Our quality cover includes up to 15% extra contents');
});

/*TODO This test checks the links of a hardcoded cross sell ad and the static travel ad -
/*TODO it does not test the dynamic cross-sell logic on this page */

When('I view the policies page cross sell section', async () => {
  await utils.waitForViewAnimation();
  expect(await utils.checkFirstElementIsDisplayed('.offer_image')).to.be.true;
});

When('I should see the policies page cross sell portal ads', async () => {
  expect(await utils.getElementTextIteration('.multi-offers h3', 0)).contain('Your 10% Car Insurance saving');
  expect(await utils.getElementTextIteration('.multi-offers h3', 1)).contain('Travel Insurance');

  expect(await utils.getElementTextIteration('.multi-offers h3~p', 0)).contain('Loyal customers');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 1)).contain('With our quality cover,');
});

Then('I can follow the policies page cross sell links', async () => {
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 0)).contains('/car10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 0)).contains('/car10');

  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 1)).contains('/travel-insurance');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 1)).contains('/travel-insurance');
});
