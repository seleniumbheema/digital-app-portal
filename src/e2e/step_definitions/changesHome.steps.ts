import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';

When('I click the Make changes link', async () => {
  const currentUrl = await utils.getCurrentUrl();
  await utils.checkFirstElementCanBeClickedAndClick('.make-change');
  await utils.waitUntilRouteChangedFrom(currentUrl);
  await utils.waitForViewAnimation();

});

Then('I can see all information including telephone number', async () => {
  expect(await utils.getFirstElementText('.cover-type')).to.contain('Home');
  expect(await utils.getFirstElementText('.policy-number')).to.contain('Policy number');
  expect(await utils.getFirstElementText('.policy-card')).to.contain('To make changes to your home insurance you\'ll need to give us a call.');
  expect(await utils.checkElementCanBeClicked('.view-docs')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.view-details')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-claim')).to.be.true;
  expect(await utils.checkElementCanBeClicked('.make-change')).to.be.true;
  expect(await utils.checkElementIsDisplayed('a[href="tel:0345 601 7074"]')).to.be.true;
});
