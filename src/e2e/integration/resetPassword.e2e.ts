import { ResetPasswordCredentials, SetPasswordPage } from '../po/set-password.po';
import { TroublePasswordPage } from '../po/troublePassword.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Re-set password', () => {
  const troublePasswordPage = new TroublePasswordPage();
  const setPasswordPage = new SetPasswordPage();

  beforeEach(async () => {
    await utils.navigateTo('/auth/trouble/password');
    await utils.waitUntilRouteChangedTo('/auth/trouble/password');
    await troublePasswordPage.submitForm('resetpass@esmock.com');
    await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
    await utils.waitForViewAnimation();
  });

  afterEach(async () => {
    await utils.deleteAppStorage();
  });

  describe('reset password page', () => {
    it('should have user email in bold', async () => {
      expect(await utils.checkElementIsDisplayed('.has-text-weight-bold')).toBeTrue();
    });
  });

  describe('footer elements', () => {
    it('should show footer links', async () => {
      expect(await utils.checkLinkText('Cookies')).toBeTrue();
      expect(await utils.checkLinkText('Security & Privacy')).toBeTrue();
      expect(await utils.checkLinkText('Accessibility')).toBeTrue();
      expect(await utils.checkLinkText('Legal')).toBeTrue();
    });
  });

  describe('reset password validation', () => {
    let credentials: ResetPasswordCredentials;
    beforeEach(() => {
      credentials = {
        verificationcode: '667887',
        newpass: 'Resetpass1',
      };
    });

    it('should show form error if the fields are empty', async () => {
      await setPasswordPage.submitResetForm(null, null, null);
      expect(await utils.checkElementIsPresent('#VerificationCode-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#ConfirmPassword-container .help')).toBeTrue();
    });

    it('should show form error if the verification code is unrecognised', async () => {
      await setPasswordPage.resetWith('/auth/trouble/password/reset');
      await setPasswordPage.submitResetForm('123456', credentials.newpass, credentials.newpass);
      expect(await utils.waitForElementPresent('.notification.messages-container.is-danger')).toBeTrue();
    });

    it('should show preflight error if the fields have invalid input', async () => {
      await setPasswordPage.resetWith('/auth/trouble/password/reset');
      await setPasswordPage.submitResetForm('abc', 'tooshort', 'Idontm4tch');
      expect(await utils.checkElementIsPresent('#VerificationCode-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#ConfirmPassword-container .help')).toBeTrue();
    });
  });

  describe('submit form for valid credentials', () => {
    let credentials: ResetPasswordCredentials;
    beforeEach(() => {
      credentials = {
        verificationcode: '667887',
        newpass: 'Resetpass2',
      };
    });

    it('should submit the form and take you to login page with notification msg', async () => {
      await setPasswordPage.resetWith('/auth/trouble/password/reset');
      await setPasswordPage.submitResetForm(credentials.verificationcode, credentials.newpass, credentials.newpass);
      await utils.waitUntilRouteChangedTo('/auth/login/change-password');
      await utils.waitForViewAnimation();
      expect(await utils.getCurrentUrl()).toEndWith('/auth/login/change-password');
      expect(await utils.checkElementIsPresent('.notification.messages-container.is-success')).toBeTrue();
    });
  });

});
