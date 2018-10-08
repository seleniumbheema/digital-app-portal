import { element, by, promise, ElementFinder } from 'protractor';

export interface CreateAccountCredentials {
  forename: string;
  surname: string;
  dateOfBirth: string;
  postcode: string;
  policyId?: string;
  vehicleRegistrationNumber?: string;
  brandCode: string;
}

export class CreateAccountPage {

  enterForename(forename: string): promise.Promise<void> {
    const forenameField = element(by.css('#auth-create-acc #forename'));
    return forenameField.sendKeys(forename);
  }

  enterSurname(surname: string): promise.Promise<void> {
    const surnameField = element(by.css('#auth-create-acc #surname'));
    return surnameField.sendKeys(surname);
  }

  async enterDateOfBirth(dateOfBirth: string, fieldsArray: string[]): Promise<void> {
    const splitDob: string[] = dateOfBirth.split('-');
    const fieldsArrayLength = fieldsArray.length;
    for (let i = 0; i < fieldsArrayLength; i += 1) {
      const fieldElement = element(by.id(fieldsArray[i]));
      await fieldElement.sendKeys(splitDob[i]);
    }
  }

  enterPostcode(postcode: string): promise.Promise<void> {
    const postcodeField = element(by.css('#auth-create-acc #postcode'));
    return postcodeField.sendKeys(postcode);
  }

  enterPolicyId(policyId: string): promise.Promise<void> {
    const policyIdField = element(by.css('#auth-create-acc #policyId'));
    return policyIdField.sendKeys(policyId);
  }

  enterVehicleReg(vehicleRegistrationNumber: string): promise.Promise<void> {
    const vehicleRegField = element(by.css('#auth-create-acc #vehicleReg'));
    return vehicleRegField.sendKeys(vehicleRegistrationNumber);
  }

  /**
   * Create account using passed in required details.
   // * @param app the app
   * @param forename forename
   * @param surname surname
   * @param dateOfBirth dateOfBirth
   * @param postcode postcode
   * @param policyId policyId
   * @param vehicleRegistrationNumber vehicleRegistrationNumber
   * @param brandCode brandCode
   // * @param expectedUrl expected URL that it should change to after login
   */
  registerAs(
    // app: App,
    forename: string,
    surname: string,
    dateOfBirth: string,
    postcode: string,
    policyId: string,
    vehicleRegistrationNumber: string,
    // expectedUrl?: string,
  ): Promise<any> {
    return this.submitCreateAccountForm(forename, surname, dateOfBirth, postcode, policyId, vehicleRegistrationNumber);
    // return app.waitUntilRouteChangedTo(expectedUrl ? expectedUrl : '/portal');
  }

  async submitCreateAccountForm(
    forename: string,
    surname: string,
    dateOfBirth: string,
    postcode: string,
    policyId: string,
    vehicleRegistrationNumber: string,
  ): Promise<void> {
    if (forename) await this.enterForename(forename);
    if (surname) await this.enterSurname(surname);
    if (dateOfBirth) await this.enterDateOfBirth(dateOfBirth, ['custDate-yearCtrl', 'custDate-monthCtrl', 'custDate-dayCtrl']);
    if (postcode) await this.enterPostcode(postcode);
    if (policyId) await this.enterPolicyId(policyId);
    if (vehicleRegistrationNumber) await this.enterVehicleReg(vehicleRegistrationNumber);
    const submitButton: ElementFinder = element(by.css('#auth-create-acc button'));
    return submitButton.click();
  }
}
