import { expect } from 'chai';
import { by, element, promise } from 'protractor';

import { ProtractorUtils as utils } from './app/utilities.po';

export class RegisterAccountPage {

  async clickContinueButton(): Promise<void> {
    const continueToRegisterBtn = utils.elementFinder('.create-account');
    await continueToRegisterBtn.click();
  }

  async checkRegisterFormIsShown(): Promise<void> {
    expect(await utils.waitForElementPresent('#auth-create-acc')).to.be.true;
  }

  async policyRegOption(option: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#policy-reg-${option} + label`);
  }

  async enterPolicyId(policyId: number): Promise<void> {
    const policyIdField = utils.elementFinder('#auth-create-acc #policyId');
    await policyIdField.sendKeys(policyId);
  }

  async enterReg(reg: string): Promise<void> {
    expect(await utils.waitForElementPresent('#vehicleReg')).to.be.true;
    const regField = utils.elementFinder('#vehicleReg');
    await regField.sendKeys(reg);
  }

  enterForename(forename: string): promise.Promise<void> {
    const forenameField = element(by.css('#auth-create-acc #forename'));
    return forenameField.sendKeys(forename);
  }

  enterSurname(surname: string): promise.Promise<void> {
    const surnameField = element(by.css('#auth-create-acc #surname'));
    return surnameField.sendKeys(surname);
  }

  async enterRegisterCustomerDate(date: string): Promise<void> {
    await utils.enterDateFields(date, ['custDate-dayCtrl', 'custDate-monthCtrl', 'custDate-yearCtrl']);
  }

  async enterPostCode(postcode: string): Promise<void> {
    const postcodeField = utils.elementFinder('#auth-create-acc #postcode');
    await postcodeField.sendKeys(postcode);
  }

}
