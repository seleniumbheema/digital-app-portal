import { element, by, ElementFinder } from 'protractor';

import { ProtractorUtils as utils } from './app/utilities.po';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class LoginPage {

  async enterEmail(email: string): Promise<void> {
    const emailField = element(by.css('#auth-login #Username'));
    await emailField.sendKeys(email);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordField = element(by.css('#auth-login #Password'));
    await passwordField.sendKeys(password);
  }

  /**
   * Login using the passed in email and password.
   * @param email email
   * @param password password
   * @param expectedUrl expected URL that it should change to after login
   */
  async loginAs(email: string, password: string, expectedUrl?: string): Promise<void> {
    await this.submitForm(email, password);
    await utils.waitUntilRouteChangedTo(expectedUrl ? expectedUrl : '/portal');
  }

  async loginTemp(email: string, password: string, expectedUrl?: string): Promise<void> {
    await this.submitForm(email, password);
    await utils.waitUntilRouteChangedTo(expectedUrl ? expectedUrl : '/set-password');
  }

  async submitForm(email?: string, password?: string): Promise<void> {
    if (email) await this.enterEmail(email);
    if (password) await this.enterPassword(password);
    const submitButton: ElementFinder = element(by.css('#loginBtn'));
    await submitButton.click();
  }

  async selectForgotPasswordLink(): Promise<void> {
    const forgotPasswordButton = utils.elementFinder('.trouble-link');
    await forgotPasswordButton.click();
  }

  async selectRetrieveQuoteLink(): Promise<void> {
    const retrieveQuoteLink = utils.elementFinder('.retrieve-quote');
    await retrieveQuoteLink.click();
  }

  async selectProofNoClaimsDiscount(): Promise<void> {
    const noClaimsProofLink = utils.elementFinder('.proof-ncd');
    await noClaimsProofLink.click();
  }

}
