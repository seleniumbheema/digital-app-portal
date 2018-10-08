import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { RegisterAccountPage } from '../po/registerAccount.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

const registerAccountPage = new RegisterAccountPage();

When('I attempt to register for a portal account without prior registration', async () => {
  await registerAccountPage.clickContinueButton();
  await registerAccountPage.checkRegisterFormIsShown();
  // const promises = [];
  await registerAccountPage.policyRegOption('affirmative');
  await registerAccountPage.enterPolicyId(11112233);
  await registerAccountPage.enterForename('User');
  await registerAccountPage.enterSurname('Esmocknewacc');
  await registerAccountPage.enterRegisterCustomerDate('01-01-1960');
  await registerAccountPage.enterPostCode('KT4 8UD');
  // await Promise.all(promises);
  await utils.waitForElementByIdAndClick('submit-button');
});

When('I attempt to register for a portal account with prior registration', async () => {
  await registerAccountPage.clickContinueButton();
  await registerAccountPage.checkRegisterFormIsShown();
  // const promises = [];
  await registerAccountPage.policyRegOption('negative');
  await registerAccountPage.enterReg('M9WYT');
  await registerAccountPage.enterForename('User');
  await registerAccountPage.enterSurname('Esmockalreadyregistered');
  await registerAccountPage.enterRegisterCustomerDate('01-01-1960');
  await registerAccountPage.enterPostCode('KT4 8UD');
  // await Promise.all(promises);
  await utils.waitForElementByIdAndClick('submit-button');
});

Then('the register form successfully submits the request', async () => {
  expect(await utils.waitForElementPresent('#register-conf')).to.be.true;
});
