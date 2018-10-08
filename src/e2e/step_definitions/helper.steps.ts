import { expect } from 'chai';
import { Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';

Then('navigates to the {string} page', async (pageName: string) => {
  expect(await utils.waitUntilRouteChangedTo(pageName)).to.be.true;
});

Then('I should be navigated to the {string} page', async (pageName: string) => {
  expect(await utils.waitUntilRouteChangedTo(pageName)).to.be.true;
});
