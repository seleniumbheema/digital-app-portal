import { When, Then } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { SetPasswordPage } from '../po/set-password.po';
import { LoginPage } from '../po/login.po';
import { expect } from 'chai';

const setPasswordPage = new SetPasswordPage();
const loginPage = new LoginPage();
const userName = 'newpass1@esmock.com';
const newPass = 'Newpassword2';

When('I update my password and logout', async () => {
  expect(await utils.checkFirstElementIsDisplayed('#Password')).to.be.true;
  await setPasswordPage.submitForm(newPass, newPass);
  await utils.waitUntilRouteChangedTo('/policies/welcome');
  await utils.waitForViewAnimation();
  expect(await utils.getFirstElementText('.messages-container.is-success')).to.contain('Good news');
  await utils.getElementByIdAndClick('nav-logout');
  await utils.waitUntilRouteChangedTo('/logout');
});

Then('I am able to login with my new password', async () => {
  await utils.navigateToLogin();
  await loginPage.loginAs(userName, newPass, '/portal');
});
