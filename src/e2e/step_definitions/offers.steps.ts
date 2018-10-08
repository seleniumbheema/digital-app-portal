import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { SidebarNav } from '../po/app/sidebarNav.po';

const sidebarNav = new SidebarNav();

When('I view the Offers page', async () => {
  await sidebarNav.clickSpecialOffersBtn();
  await utils.waitUntilRouteChangedTo('/offers');
  await utils.waitForViewAnimation();
});

Then('I can view the products on offer', async () => {
  /* Images */
  expect(await utils.checkElementIsDisplayed('.icon-multicar')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.icon-buildings')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.icon-car')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.icon-travel')).to.be.true;
});

Then('I can successfully follow the links on the page', async () => {
  /* Get a quote links */
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 0)).contains('/multicar10');
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 1)).contains('/home10');
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 2)).contains('/car10');
  expect(await utils.getIterationElementAttribute('.get-quote', 'href', 3)).contains('/travel-insurance');

  /* More Detail links */
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 0)).contains('/multicar10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 1)).contains('/home10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 2)).contains('/car10');
  expect(await utils.getIterationElementAttribute('.more-details', 'href', 3)).contains('/travel-insurance');
});

When('I should see the offers page all customer portal ads', async () => {
  expect(await utils.getElementTextIteration('.multi-offers h3', 0)).equals('All yours – 10% off Multicar Insurance');
  expect(await utils.getElementTextIteration('.multi-offers h3', 1)).equals('Our loyal customers save up to 10%');
  expect(await utils.getElementTextIteration('.multi-offers h3', 2)).equals('10% loyalty discount on Car Insurance');
  expect(await utils.getElementTextIteration('.multi-offers h3', 3)).equals('Travel Insurance online discount – up to 20%');

  expect(await utils.getElementTextIteration('.multi-offers h3~p', 0)).contain('That’s what you get off your quote if you,');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 1)).contain('Our quality Home Insurance offers great value and peace of mind.');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 2)).contain('Plus, if you ever have an accident you’ll get a courtesy car');
  expect(await utils.getElementTextIteration('.multi-offers h3~p', 3)).contain('Looking for value-for-money and reassuring cover');
});
