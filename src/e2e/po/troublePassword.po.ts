import { expect } from 'chai';
import { by, element, ElementFinder, promise } from 'protractor';

import { ProtractorUtils as utils } from './app/utilities.po';

export class TroublePasswordPage {

  async checkForgotPasswordFormIsShown(): Promise<void> {
    expect(await utils.waitForElementPresent('#forgot-pass-form')).to.be.true;
  }

  async submitForm(email?: string): Promise<void> {
    if (email) await this.enterEmail(email);
    const submitButton: ElementFinder = element(by.css('#forgot-pass-form .button'));
    return submitButton.click();
  }

  enterEmail(email: string): promise.Promise<void> {
    const emailField = element(by.css('#forgot-pass-form #Email'));
    return emailField.sendKeys(email);
  }

  deselectFormField() {
    const unfocusFormField: ElementFinder = element(by.css('#forgot-pass-form'));
    return unfocusFormField.click();
  }

}
