import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';

When('I am on the Cover details page', async () => {
  await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
  await utils.waitUntilRouteChangedTo('/details');
  await utils.waitForViewAnimation();
});

When('I am on the My documents page', async () => {
  await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-docs');
  await utils.waitUntilRouteChangedTo('/documents');
  await utils.waitForViewAnimation();
});

When('I am on the Make changes page', async () => {
  await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.make-change');
  await utils.waitUntilRouteChangedTo('/amendments');
  await utils.waitForViewAnimation();
});

When('I am on the Make a claim page', async () => {
  await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.make-claim');
  await utils.waitUntilRouteChangedTo('/claim');
  await utils.waitForViewAnimation();
});

Then('I can successfully navigate to other tabbed pages using tabs', async () => {
  expect(await utils.checkElementCanBeClicked('.view-docs')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.view-details')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-claim')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-change')).to.be.true;
});

When('I am on the My policies page', async () => {
  await utils.checkFirstElementIsDisplayed('.cover-type');
});

When('I am on the Offers page', async () => {
  await utils.getElementByIdAndClick('nav-offers');
  await utils.waitUntilRouteChangedTo('/offers');
  await utils.waitForViewAnimation();
});

Then('I can navigate to My policies, Offers, Sign out using the sidebar navigation', async () => {
  expect(await utils.checkElementByIdCanBeClicked('nav-policies')).to.be.true;
  expect(await utils.checkElementByIdCanBeClicked('nav-offers')).to.be.true;
  expect(await utils.checkElementByIdCanBeClicked('nav-logout')).to.be.true;

});
