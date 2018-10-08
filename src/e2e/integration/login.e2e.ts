import { LoginPage, LoginCredentials } from '../po/login.po';
import { SetPasswordPage } from '../po/set-password.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Login page', () => {
  const loginPage = new LoginPage();
  const setPassPage = new SetPasswordPage();

  beforeEach(async () => {
    await utils.navigateToLogin();
  });

  afterEach(async () => {
    await utils.deleteAppStorage();
  });

  describe('unauthenticated header', () => {
    it('should not contain customer greeting', async () => {
      await loginPage.submitForm(null, null);
      expect(await utils.checkElementIsPresent('.customer-greet')).toBeFalse();
    });
  });

  describe('authenticated header', () => {
    const credentials: LoginCredentials = {
      email: 'four@esmock.com',
      password: 'Customer4',
    };

    beforeEach(async () => {
      await loginPage.loginAs(credentials.email, credentials.password);
    });

    it('should show customer greeting', async () => {
      const greet = await utils.checkElementIsPresent('.customer-greet');
      expect(greet).toBeTrue();
    });

    it('should show time based greeting', async () => {
      const cTime = new Date().getHours();
      const salutation = await utils.getElementText('.customer-greet');
      if (cTime < 12) {
        expect(salutation).toContain('Good morning');
      } else if (cTime < 18) {
        expect(salutation).toContain('Good afternoon');
      } else {
        expect(salutation).toContain('Good evening');
      }
    });
  });

  describe('logging in', () => {
    const credentials: LoginCredentials = {
      email: 'five@esmock.com',
      password: 'Customer5',
    };

    it('should redirect to the polices page on success', async () => {
      await loginPage.loginAs(credentials.email, credentials.password);
      expect(await utils.getCurrentUrl()).toContain('/policies');
    });

    it('should show preflight errors if the fields are both empty', async () => {
      await loginPage.submitForm(null, null);
      expect(await utils.checkElementIsPresent('#Username-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('.messages-container')).toBeFalse();
    });

    it('should show preflight error if the email field is empty', async () => {
      await loginPage.submitForm(null, credentials.password);
      expect(await utils.checkElementIsPresent('#Username-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeFalse();
      expect(await utils.checkElementIsPresent('.messages-container')).toBeFalse();
    });

    it('should show preflight error if the email field is invalid', async () => {
      await loginPage.submitForm('some.cheese.com', credentials.password);
      expect(await utils.checkElementIsPresent('#Username-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeFalse();
      expect(await utils.checkElementIsPresent('.messages-container')).toBeFalse();
    });

    it('should show preflight error if the password field is empty', async () => {
      await loginPage.submitForm(credentials.email, null);
      expect(await utils.checkElementIsPresent('#Username-container .help')).toBeFalse();
      expect(await utils.checkElementIsPresent('#Password-container .help')).toBeTrue();
      expect(await utils.checkElementIsPresent('.messages-container')).toBeFalse();
    });

    it('should show the form error message if the email/password is incorrect', async () => {
      await loginPage.submitForm(credentials.email, `x${credentials.password}x`);
      expect(await utils.waitForElementNotPresent('#Username-container .help')).toBeFalse();
      expect(await utils.waitForElementNotPresent('#Password-container .help')).toBeFalse();
      expect(await utils.checkElementIsPresent('.messages-container')).toBeTrue();
    });
  });

  // TODO - Move to Journeys (once created). NOTE: This will fail if run more that once
  // Restart mAPI to test again.
  describe('logging in with a temporary password', () => {
    const credentials: LoginCredentials = {
      email: 'newpass@esmock.com',
      password: 'newpassword1',
    };
    const newPass = 'Newpassword2';

    describe('successful change of password', () => {
      it('should show policies page after successful change of password', async () => {
        await loginPage.loginAs(credentials.email, credentials.password, '/auth/set-password');
        expect(await utils.getCurrentUrl()).toEndWith('/auth/set-password');
        await utils.waitForViewAnimation();
        await setPassPage.submitForm(newPass, newPass);
        await utils.waitUntilRouteChangedTo('/portal/policies/welcome');
        await utils.waitForViewAnimation();
        expect(await utils.getCurrentUrl()).toEndWith('/portal/policies/welcome');
      });

      it('should have changed the password so can login with the new password', async () => {
        await loginPage.loginAs(credentials.email, newPass);
        await utils.waitForViewAnimation();
        expect(await utils.getCurrentUrl()).toEndWith('/portal/policies');
      });
    });

  });

});
