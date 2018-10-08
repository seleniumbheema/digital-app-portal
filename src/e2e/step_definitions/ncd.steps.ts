import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';

When('I view Cover Details', async () => {
  const currentUrl = await utils.getCurrentUrl();
  await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
  await utils.waitUntilRouteChangedFrom(currentUrl);
  await utils.waitForViewAnimation();

});

Then('I am able to upload my proof of NCD', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.notification.messages-container.is-warning')).to.be.true;
  expect(await utils.getElementTextIteration('.notification-text', 0)).to.contain('We urgently need');
  expect(await utils.checkElementCanBeClicked('.upload-ncd')).to.be.true;
});

When('I view Policy Summary', async () => {
  await utils.waitForViewAnimation();
});

Then('I am able to upload my proof of NCD from summary page', async () => {
  expect(await utils.checkFirstElementIsDisplayed('.notification.messages-container.is-warning')).to.be.true;
  expect(await utils.getElementTextIteration('.notification-text', 0)).to.contain('We urgently need');
  expect(await utils.checkElementCanBeClicked('.upload-ncd')).to.be.true;
});
