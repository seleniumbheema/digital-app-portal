import { element, by, promise } from 'protractor';
import { expect } from 'chai';

import { ProtractorUtils as utils } from './utilities.po';

export class Account {

  clickCancelChangeBtn(): promise.Promise<void> {
    const cancelChangePass = element(by.css('#cancelChangePass'));
    return cancelChangePass.click();
  }

  async clickChangePassBtn(): Promise<void> {
    await utils.waitForElementByIdAndClick('changePass');
  }

  getChangePassForm(): promise.Promise<boolean> {
    const changePassForm = element(by.css('#acc-change-pass'));
    return changePassForm.isDisplayed();
  }

  async enterCurrentPass(pass: string): Promise<void> {
    const currentPassField = utils.elementFinder('#oldPassword');
    await currentPassField.sendKeys(pass);
  }

  async enterNewPass(pass: string): Promise<void> {
    const newPassField = utils.elementFinder('#newPassword');
    await newPassField.sendKeys(pass);
  }

  async enterConfirmNewPass(pass: string): Promise<void> {
    const confirmNewPassField = utils.elementFinder('#confirmPassword');
    await confirmNewPassField.sendKeys(pass);
  }

  async submitChangePassword(): Promise<void> {
    await utils.waitForElementByIdAndClick('setPass');
  }

  async checkHasGlobalError(): Promise<void> {
    expect(await utils.waitForElementPresent('.messages-container.is-danger')).to.be.true;
  }

  async clickChangeEmailBtn(): Promise<void> {
    await utils.waitForElementByIdAndClick('changeEmail');
  }

  async enterNewEmail(email: string): Promise<void> {
    const newEmailField = utils.elementFinder('#newEmail');
    await newEmailField.sendKeys(email);
  }

  async enterConfirmEmail(email: string): Promise<void> {
    const newEmailField = utils.elementFinder('#confirmEmail');
    await newEmailField.sendKeys(email);
  }

  async enterVerifyPass(password: string): Promise<void> {
    const newEmailField = utils.elementFinder('#verifyPassword');
    await newEmailField.sendKeys(password);
  }

  async submitChangeEmail(): Promise<void> {
    await utils.waitForElementByIdAndClick('setEmail');
  }

  async checkHasInlineError(field: string): Promise<void> {
    // await utils.waitForElementByIdAndClick('setEmail');
    await utils.waitForElementPresent(`#${field}-container .help.is-danger`);
  }
}
