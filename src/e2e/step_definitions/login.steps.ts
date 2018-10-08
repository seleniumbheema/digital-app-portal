import { expect } from 'chai';
import { Given, When, Then } from 'cucumber';

import { LoginPage } from '../po/login.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { SetPasswordPage } from '../po/set-password.po';

const loginPage = new LoginPage();
const setPassPage = new SetPasswordPage();

Given('I am on the login page', async () => {
  await utils.navigateToLogin();
});

When('I type {string} into the email field and {string} into the password field', async (email: string, password: string) => {
  await loginPage.submitForm(email, password);
});

When('I fill out the set password page with new password of {string}', async (newPassword: string) => {
  await setPassPage.submitForm(newPassword, newPassword);
});

Then('I should see error message about failed login', async () => {
  expect(await utils.waitForElementPresent('.notification.messages-container.is-danger')).to.be.true;
});

Then('I should successfully login and see my policies page', async () => {
  expect(await utils.waitUntilRouteChangedTo('/portal')).to.be.true;
});
