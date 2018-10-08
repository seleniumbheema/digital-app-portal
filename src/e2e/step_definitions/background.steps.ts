import { Given, TableDefinition } from 'cucumber';

import { ProtractorUtils as utils } from '../po/app/utilities.po';
import { LoginPage } from '../po/login.po';
import { TroublePasswordPage } from '../po/troublePassword.po';

const loginPage = new LoginPage();
const troublePasswordPage = new TroublePasswordPage();

Given('I am a logged in portal user', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in portal user with a motor policy', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in portal user with a home policy', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in portal user with both a current and old motor policy', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in portal user with a temporary password', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginTemp(firstRow[0], firstRow[1]);
});

Given('I am a logged in portal user with both a current and old home policy', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in Portal user with a Motor policy with outstanding NCD proof', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a logged in Portal user with both Motor and Home policies', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a user that is not logged in', async () => {
  await utils.navigateToLogin();
});

Given('I am a logged in portal user with a motor policy with previous policy years', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a user on the forgotten your password page', async () => {
  await utils.navigateTo('/auth/trouble/password');
  await utils.waitUntilRouteChangedTo('/auth/trouble/password');
});

Given('I am a logged in portal user with a home policy with previous policy years', async (table: TableDefinition) => {
  await utils.navigateToLogin();
  const firstRow = table.rows()[0];
  await loginPage.loginAs(firstRow[0], firstRow[1]);
});

Given('I am a user on the reset your password page', async () => {
  await utils.navigateTo('/auth/trouble/password');
  await utils.waitUntilRouteChangedTo('/auth/trouble/password');
  await troublePasswordPage.enterEmail('resetpass@esmock.com');
  await troublePasswordPage.submitForm();
  await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
  await utils.waitForViewAnimation();
});

Given('I am a user on the forgotten your password page', async () => {
  await utils.navigateTo('/auth/trouble/password');
  await utils.waitUntilRouteChangedTo('/auth/trouble/password');
});
