import { expect } from 'chai';
import { Given, When, Then, TableDefinition } from 'cucumber';

import { SidebarNav } from '../po/app/sidebarNav.po';
import { Account } from '../po/app/myAccount.po';
import { LoginPage } from '../po/login.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

const sidebarNav = new SidebarNav();
const myAccountPage = new Account();
const loginPage = new LoginPage();

Given('navigates to \'My details\' page from Menu', async () => {
  await sidebarNav.clickMyDetailsBtn();
});

Then('an error message is displayed', async () => {
  await myAccountPage.checkHasGlobalError();
});

Then('the user is automatically logged out', async () => {
  // Nothing to do in here
});

Then('an acknowledgment email is sent to the user', async () => {
  // Nothing to do in here
});

/* Password Form*/

Given('selects \'Change Password\' option', async () => {
  await myAccountPage.clickChangePassBtn();
});

Given('completes all other fields correctly', async () => {
  // const promises = [];
  await myAccountPage.enterNewPass('NewPassword1');
  await myAccountPage.enterConfirmNewPass('NewPassword1');
  // await Promise.all(promises);
});

Given('enters their current password incorrectly', async () => {
  await myAccountPage.enterCurrentPass('IncorrectPassword123');
});

Given('enters their current password of {string}', async (password: string) => {
  await myAccountPage.enterCurrentPass(password);
});

When('the user enters a new password of {string}', async (password: string) => {
  await myAccountPage.enterNewPass(password);
});

When('confirms the new password of {string}', async (password: string) => {
  await myAccountPage.enterConfirmNewPass(password);
});

When('both the entries match', async () => {
  // Nothing to do in here
});

When('they conform to standard input validation', async () => {
  // Nothing to do in here
});

When('the form is submitted', async () => {
  await myAccountPage.submitChangePassword();
});

Then('the password is successfully updated', async () => {
  // Nothing to do in here
});

Then('shown the change password success screen prompting them to login again', async () => {
  expect(await utils.waitUntilRouteChangedTo('/auth/login/change-password')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.messages-container.is-success')).to.be.true;
});

Then('the user can sign in using their existing email address and new password', async (table: TableDefinition) => {
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

/* Email Form*/
Given('selects \'Change Email\' option', async () => {
  await myAccountPage.clickChangeEmailBtn();
});

Given('enters {string} as the new email address', async (email: string) => {
  await myAccountPage.enterNewEmail(email);
});

Given('confirms {string} as the new email address', async (email: string) => {
  await myAccountPage.enterConfirmEmail(email);
});

Given('verifies their current password as {string}', async (password: string) => {
  await myAccountPage.enterVerifyPass(password);
});

Given('verifies their current password incorrectly', async () => {
  await myAccountPage.enterVerifyPass('IncorrectPassword123');
});

When('the change email form is submitted', async () => {
  await myAccountPage.submitChangeEmail();
});

Then('an inline error message is displayed on the new email field', async () => {
  await myAccountPage.checkHasInlineError('newEmail');
});

Then('an inline error message is displayed on the verify password field', async () => {
  await myAccountPage.checkHasInlineError('verifyPassword');
});

Then('the email is successfully updated', async () => {
  // Nothing to do in here
});

Then('shown the change email success screen prompting them to login again', async () => {
  expect(await utils.waitUntilRouteChangedTo('/auth/login/change-email')).to.be.true;
  expect(await utils.checkElementIsDisplayed('.messages-container.is-success')).to.be.true;
});
