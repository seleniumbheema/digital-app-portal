import { expect } from 'chai';
import { When, Then } from 'cucumber';

import { SetPasswordPage } from '../po/set-password.po';
import { TroublePasswordPage } from '../po/troublePassword.po';
import { LoginPage } from '../po/login.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

const troublePasswordPage = new TroublePasswordPage();
const setPasswordPage = new SetPasswordPage();
const loginPage = new LoginPage();
const userName = '';
const newPass = 'Resetpass2';

When('I attempt to reset my forgotten password', async () => {
  /*select the forgotten password link on login page*/
  await loginPage.selectForgotPasswordLink();
  await troublePasswordPage.checkForgotPasswordFormIsShown();
  await utils.waitUntilRouteChangedTo('/auth/trouble/password');
  /*enter a recognised email*/
  await troublePasswordPage.checkForgotPasswordFormIsShown();
  await troublePasswordPage.enterEmail('resete2e@esmock.com');
  await troublePasswordPage.submitForm();
});

When('I enter new reset password credentials', async () => {
  /*the forgot password form successfully submits the request and user is redirected to the reset password form*/
  await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
  await setPasswordPage.checkSetPasswordFormIsShown();
  await utils.checkElementIsPresent('.reset-email');
  /*enter new valid credentials on reset password form and submit*/
  // const promises = [];
  await setPasswordPage.enterVerificationCode('667887');
  await setPasswordPage.enterPassword('Resetpass2');
  await setPasswordPage.enterNewPassword('Resetpass2');
  // await Promise.all(promises);
  await setPasswordPage.submitResetForm();
  await utils.waitUntilRouteChangedTo('/auth/login/change-password');
  await utils.waitForViewAnimation();
});

Then('the reset password form successfully submits the request', async () => {
  expect(await utils.checkElementIsPresent('.notification.messages-container.is-success')).to.be.true;
});

Then('I am able to login with my reset password', async () => {
  await utils.waitUntilRouteChangedTo('/login/change-password');
  await loginPage.loginAs(userName, newPass, '/portal');
});
