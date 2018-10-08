import { TroublePasswordPage } from '../po/troublePassword.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Trouble password', () => {
  const troublePasswordPage = new TroublePasswordPage;

  beforeEach(async () => {
    await utils.navigateTo('/auth/trouble/password');
  });

  afterEach(async () => {
    await utils.deleteAppStorage();
  });

  describe('forgot password page', () => {
    it('should have forgot password message and helper text', async () => {
      expect(await utils.checkElementIsPresent('.title')).toBeTrue();
      expect(await utils.getFirstElementText('.block')).toContain('If you bought your policy before 20th May 2018');
    });
  });

  describe('the back button', () => {
    it('should go back to the login page', async () => {
      await utils.getElementAndClick('#forgot-pass-form .back-link');
      const urlMatch = await utils.waitUntilRouteChangedTo('/auth/login');
      expect(urlMatch).toBeTrue();
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

  describe('forgot password validation', () => {
    it('should show preflight error if the field is not a valid email address', async () => {
      await troublePasswordPage.submitForm('non-valid-email-address');
      await troublePasswordPage.deselectFormField();
      expect(await utils.waitForElementPresent('#Email-container .help')).toBeTrue();
    });

    it('should show form error if the email is unrecognised', async () => {
      await troublePasswordPage.submitForm('blah@esmock.com');
      expect(await utils.waitForElementPresent('.notification.messages-container.is-danger')).toBeTrue();
    });
  });

  describe('submit forgot password form for valid email', () => {
    it('should submit the form and take you to reset password page', async () => {
      await troublePasswordPage.submitForm('forgotpass@esmock.com');
      await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
      await utils.waitForViewAnimation();
      expect(await utils.getCurrentUrl()).toEndWith('/auth/trouble/password/reset');
    });
  });

  describe('submit forgot password form for temp password', () => {
    it('should submit the form and take you to login page with notification msg', async () => {
      await troublePasswordPage.submitForm('forgottemp@esmock.com');
      await utils.waitUntilRouteChangedTo('/auth/login/temp');
      await utils.waitForViewAnimation();
      expect(await utils.getCurrentUrl()).toEndWith('/auth/login/temp');
      expect(await utils.checkElementIsPresent('.notification.messages-container.is-info')).toBeTrue();
    });
  });

  describe('submit forgot password form for disabled user', () => {
    it('should submit the form and take you to sign in unavailable page', async () => {
      await troublePasswordPage.submitForm('forgotdisabled@esmock.com');
      await utils.waitUntilRouteChangedTo('/auth/login/unavailable');
      expect(await utils.getCurrentUrl()).toEndWith('/auth/login/unavailable');
    });
  });

  describe('submit forgot password form for barred user', () => {
    it('should submit the form and take you to reset password page', async () => {
      await troublePasswordPage.submitForm('forgotbarred@esmock.com');
      await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
      expect(await utils.getCurrentUrl()).toEndWith('/auth/trouble/password/reset');
    });
  });

  describe('submit forgot password form for locked user', () => {
    it('should submit the form and take you to reset password page', async () => {
      await troublePasswordPage.submitForm('forgotlocked@esmock.com');
      await utils.waitUntilRouteChangedTo('/auth/trouble/password/reset');
      expect(await utils.getCurrentUrl()).toEndWith('/auth/trouble/password/reset');
    });
  });

});
