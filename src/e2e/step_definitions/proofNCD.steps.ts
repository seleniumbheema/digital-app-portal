import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { LoginPage } from '../po/login.po';

const loginPage = new LoginPage();

When('I click the get proof of ncd link', async () => {
  expect(await utils.getIterationElementAttribute('.proof-ncd', 'href', 0)).contains('/request_proof_of_no_claims');
  await loginPage.selectProofNoClaimsDiscount();
});

Then('I can successfully follow the proof of NCD link on the page', async () => {
  await utils.checkNewTabOpenedAndCloseIt();
});
