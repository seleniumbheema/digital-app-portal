import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { LoginPage } from '../po/login.po';

const loginPage = new LoginPage();

When('I click the retrieve quote link', async () => {
  expect(await utils.getIterationElementAttribute('.retrieve-quote', 'href', 0)).contains('/retrieve');
  await loginPage.selectRetrieveQuoteLink();
});

Then('I can successfully follow the retrieve quote link on the page', async () => {
  await utils.checkNewTabOpenedAndCloseIt();
});
