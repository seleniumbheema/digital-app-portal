import { expect } from 'chai';
import { element, by, promise, ElementFinder } from 'protractor';

import { ProtractorUtils as utils } from './app/utilities.po';

export interface ResetPasswordCredentials {
  verificationcode: string;
  newpass: string;
}

export class SetPasswordPage {

  async checkSetPasswordFormIsShown(): Promise<void> {
    expect(await utils.waitForElementPresent('#auth-set-pass')).to.be.true;
  }

  async submitForm(password?: string, confirmPassword?: string): Promise<void> {
    if (password) await this.enterPassword(password);
    if (confirmPassword) await this.enterNewPassword(confirmPassword);
    const submitButton: ElementFinder = element(by.css('#auth-set-pass .button'));
    return submitButton.click();
  }

  async submitResetForm(verificationCode?: string, password?: string, confirmPassword?: string): Promise<void> {
    if (verificationCode) await this.enterVerificationCode(verificationCode);
    if (password) await this.enterPassword(password);
    if (confirmPassword) await this.enterNewPassword(confirmPassword);
    const submitButton: ElementFinder = element(by.css('#auth-set-pass .button'));
    return submitButton.click();
  }

  enterVerificationCode(verificationcode: string): promise.Promise<void> {
    const verificationCode = element(by.css('#auth-set-pass #VerificationCode'));
    return verificationCode.sendKeys(verificationcode);
  }

  enterPassword(password: string): promise.Promise<void> {
    const passwordField = element(by.css('#auth-set-pass #Password'));
    return passwordField.sendKeys(password);
  }

  enterNewPassword(newPassword: string): promise.Promise<void> {
    const passwordField = element(by.css('#auth-set-pass #ConfirmPassword'));
    return passwordField.sendKeys(newPassword);
  }

  async resetWith(expectedUrl?: string): Promise<void> {
    await utils.navigateTo('/auth/trouble/password/reset');
    await utils.waitUntilRouteChangedTo(expectedUrl ? expectedUrl : '/auth/trouble/password/reset');
  }

}
