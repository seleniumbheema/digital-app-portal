import { expect } from 'chai';
import { When, Then } from 'cucumber';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

When('I attempt to view a policy that is not mine', async () => {
  await utils.navigateTo('/portal/policies/motor/1111/76956/details');
});

Then('I am prevented from viewing the policy', async () => {
  await utils.waitForViewAnimation();
  expect(await utils.getElementTextIteration('.is-warning', 0)).contains('Unfortunately we could not find');
});
