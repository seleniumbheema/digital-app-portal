import { expect } from 'chai';
import { protractor } from 'protractor';

import { ProtractorUtils as utils } from './app/utilities.po';

export class AddConvictionPage {

  async chooseRelatesTo(relatesTo: 'affirmative' | 'negative'): Promise<void> {
    const relatesToRadio = utils.elementFinder(`#mta-related-${relatesTo} + label`);
    await relatesToRadio.click();
  }

  async chooseLicenceSuspended(suspended: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#mta-suspended-${suspended} + label`);
  }

  async chooseNumConvictions(num: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#mta-many-convictions-${num} + label`);
  }

  async enterConvictionCode(): Promise<void> {
    expect(await utils.waitForElementPresent('#convictionCode')).to.be.true;
    await utils.clickSelectOptionValue('convictionCode', 'SP30');
  }

  async enterConvictionDate(date: string): Promise<void> {
    expect(await utils.waitForElementPresent('#conDate-Day')).to.be.true;
    await utils.enterDateFields(date, ['conDate-Day', 'conDate-Month', 'conDate-Year']);
  }

  async enterPenaltyPoints(points: number): Promise<void> {
    expect(await utils.waitForElementPresent('#penaltyPoints')).to.be.true;
    const penaltyPointsField = utils.elementFinder('#penaltyPoints');
    await penaltyPointsField.sendKeys(points);
  }
}

export class MakeChangePage {

  async clickAddDriverButton(): Promise<void> {
    await utils.getElementByIdAndClick('ctaAddDriver');
    expect(await utils.waitUntilRouteChangedTo('/add-driver')).to.be.true;
  }

  async clickChangeRegistrationButton(): Promise<void> {
    await utils.getElementByIdAndClick('ctaChangeReg');
    expect(await utils.waitUntilRouteChangedTo('/change-registration')).to.be.true;
  }

  async clickChangeCarButton(): Promise<void> {
    await utils.getElementByIdAndClick('ctaChangeCar');
    expect(await utils.waitUntilRouteChangedTo('/change-car')).to.be.true;
  }

  async clickAddConvictionButton(): Promise<void> {
    await utils.getElementByIdAndClick('ctaAddCon');
    expect(await utils.waitUntilRouteChangedTo('/motor-conviction')).to.be.true;
  }
}

export class AddDriverPage {

  async chooseDriverType(coverType: 'permanent' | 'temporary'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#cover-${coverType} + label`);
  }

  async moreThanTwoAdditionalDrivers(option: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#numDrivers-${option} + label`);
  }

  async enterTempDriverFromDate(date: string): Promise<void> {
    expect(await utils.waitForElementPresent('#from-Day')).to.be.true;
    await utils.enterDateFields(date, ['from-Day', 'from-Month', 'from-Year']);
  }

  async enterTempDriverUntilDate(date: string): Promise<void> {
    expect(await utils.waitForElementPresent('#until-Day')).to.be.true;
    await utils.enterDateFields(date, ['until-Day', 'until-Month', 'until-Year']);
  }

  async chooseDeclaration(option: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#agree-${option} + label`);
  }

  async enterTitle(): Promise<void> {
    await utils.clickSelectOptionValue('title', 'Mrs');
  }

  async enterForename(forename: string): Promise<void> {
    const forenameField = utils.elementFinder('#driver-details-form #firstName');
    await forenameField.sendKeys(forename);
  }

  async enterSurname(surname: string): Promise<void> {
    const surnameField = utils.elementFinder('#driver-details-form #lastName');
    await surnameField.sendKeys(surname);
  }

  async enterDateOfBirth(dateOfBirth: string): Promise<void> {
    await utils.enterDateFields(dateOfBirth, ['dob-Day', 'dob-Month', 'dob-Year']);
  }

  async enterMaritalStatus(): Promise<void> {
    await utils.clickSelectOptionValue('maritalStatus', 'Married/Civil Partnership');
  }

  async chooseGenderType(genderType: 'affirmative' | 'negative'): Promise<void> {
    const genderTypeRadio = utils.elementFinder(`#gender-${genderType} + label`);
    await genderTypeRadio.click();
  }

  async employmentStatus(status: string = 'Retired'): Promise<void> {
    await utils.clickSelectOptionValue('employmentStatus', status);
  }

  async enterOccupation(occupation: string): Promise<void> {
    const occupationField = utils.elementFinder('#driver-details-form #occupation');
    await occupationField.sendKeys(occupation + protractor.Key.TAB);
  }

  async enterSecondaryOccupation(occupation: string): Promise<void> {
    const occupationField = utils.elementFinder('#driver-details-form #secondaryOccupation');
    await occupationField.sendKeys(occupation + protractor.Key.TAB);
  }

  async enterIndustry(industry: string): Promise<void> {
    const industryField = utils.elementFinder('#driver-details-form #industry');
    await industryField.sendKeys(industry + protractor.Key.TAB);
  }

  async chooseSecondOccupationType(genderType: 'affirmative' | 'negative'): Promise<void> {
    const secondOccupationRadio = utils.elementFinder(`#secondOcc-${genderType} + label`);
    await secondOccupationRadio.click();
  }

  async relationshipToYou(rel: string = 'Brother'): Promise<void> {
    await utils.clickSelectOptionValue('relationship', rel);
  }

  async licenceType(type: string = 'Full UK Licence'): Promise<void> {
    await utils.clickSelectOptionValue('licenceType', type);
  }

  async yearsLicenceHeld(years: string = '12 Years'): Promise<void> {
    await utils.clickSelectOptionValue('yearsLicenceHeld', years);
  }

  async monthsLicenceHeld(months: string = '6 months'): Promise<void> {
    await utils.clickSelectOptionValue('monthsLicenceHeld', months);
  }

  async checkDriverDetailsFormShown(): Promise<void> {
    expect(await utils.waitForElementPresent('#driver-details-form')).to.be.true;
  }
}

export class ChangeRegistrationPage {

  async enterCarRegistration(registration: string): Promise<void> {
    expect(await utils.waitForElementPresent('#registration')).to.be.true;
    const registrationField = utils.elementFinder('#registration');
    await registrationField.sendKeys(registration);
  }
}

export class ChangeCarPage {

  async chooseRegKnownType(regOption: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#mta-registration-known-${regOption} + label`);
  }

  async mtaOwnerType(mtaOwnerOption: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#mta-owner-${mtaOwnerOption} + label`);
  }

  async carModifiedType(mtaModifiedOption: 'affirmative' | 'negative'): Promise<void> {
    await utils.checkFirstElementCanBeClickedAndClick(`#mta-modified-${mtaModifiedOption} + label`);
  }

  async checkChangeCarDetailsFormShown(): Promise<void> {
    expect(await utils.waitForElementPresent('#change-car-form')).to.be.true;
  }

  async enterCarRegistration(registration: string): Promise<void> {
    const registrationField = utils.elementFinder('#change-car-form #registration');
    await registrationField.sendKeys(registration);
  }

  async findCarLookUp(): Promise<void> {
    const findCarButton = utils.elementFinder('#find-car-button');
    await findCarButton.click();
  }

  async enterValuation(valuation: string): Promise<void> {
    expect(await utils.waitForElementPresent('#valuation')).to.be.true;
    const valuationField = utils.elementFinder('#valuation');
    await valuationField.sendKeys(valuation);
  }

  async carPurchasedOption(carPurchasedOption: 'affirmative' | 'negative'): Promise<void> {
    const carPurchasedOptionOptionRadio = utils.elementFinder(`#mta-purchased-${carPurchasedOption} + label`);
    return carPurchasedOptionOptionRadio.click();
  }

  async enterPurchaseDate(purchaseDate: string): Promise<void> {
    expect(await utils.waitForElementPresent('#purchased-Day')).to.be.true;
    await utils.enterDateFields(purchaseDate, ['purchased-Day', 'purchased-Month', 'purchased-Year']);
  }

}
