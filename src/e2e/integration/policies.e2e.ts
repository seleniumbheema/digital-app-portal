import * as moment from 'moment';

import { LoginPage, LoginCredentials } from '../po/login.po';
import { PoliciesPage } from '../po/policies.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

const loginPage: LoginPage = new LoginPage();
const policiesPage: PoliciesPage = new PoliciesPage();

describe('Policies summary view', () => {
  let credentials: LoginCredentials;

  describe('check home summary view elements', () => {

    beforeAll(async () => {
      credentials = {
        email: 'one@esmock.com',
        password: 'Customer1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have cover type title', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.cover-type')).toBeTrue();
    });

    it('should have Home in title', async () => {
      expect(await utils.getFirstElementText('.cover-type')).toContain('Home');
    });

    it('should have policy number', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-number')).toBeTrue();
    });

    it('should have policy address', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).toBeTrue();
    });

    it('should have start date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.start-date')).toBeTrue();
    });

    it('should have end date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.end-date')).toBeTrue();
    });

    it('should have view details link', async () => {
      expect(await utils.checkFirstLinkText('Cover details')).toBeTrue();
    });

    it('should have view documents link', async () => {
      expect(await utils.checkFirstLinkText('My documents')).toBeTrue();
    });
  });

  describe('check motor summary view elements', () => {

    beforeAll(async () => {
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have cover type title', async () => {
      expect(await utils.checkElementIsDisplayed('.cover-type')).toBeTrue();
    });

    it('should have Motor in title', async () => {
      expect(await utils.getFirstElementText('.cover-type')).toContain('Car');
    });

    it('should have policy number', async () => {
      expect(await utils.checkElementIsDisplayed('.policy-number')).toBeTrue();
    });

    it('should have vehicle make and model', async () => {
      expect(await utils.checkElementIsDisplayed('.policy-identifier')).toBeTrue();
    });

    it('should have start date', async () => {
      expect(await utils.checkElementIsDisplayed('.start-date')).toBeTrue();
    });

    it('should have end date', async () => {
      expect(await utils.checkElementIsDisplayed('.end-date')).toBeTrue();
    });

    it('should has view details link', async () => {
      expect(await utils.checkLinkText('Cover details')).toBeTrue();
    });

    it('should have view documents link', async () => {
      expect(await utils.checkLinkText('My documents')).toBeTrue();
    });

    // describe('Summary view has relevant offers', () => {
    //   it('should have valid static travel offer links', async () => {
    //     expect(await app.utils.checkElementIsDisplayed('.travel a.get-quote')).toBeTrue();
    //     expect(await app.utils.getFirstElementAttribute('.travel a.get-quote', 'href')).toContain('/travel-insurance');
    //     expect(await app.utils.getFirstElementText('.travel .more-details')).toContain('More Details');
    //   });
    // });
  });

  describe('check notifications on summary view', () => {

    beforeAll(async () => {
      credentials = {
        email: 'renewal@esmock.com',
        password: 'renewal1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have ncd notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 0)).toContain('We urgently need');
    });

    it('should have auto renew notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 1)).toContain('Your home insurance will automatically renew');
    });

    it('should have policy home policy end notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 2)).toContain('Your home insurance is due for renewal and will end');
    });

    it('should have policy not renewable notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 3)).toContain('we are unable to renew');
    });

    it('should have policy not renewable notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 4)).toContain('we are unable to renew');
    });

    it('should have motor policy end notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 5)).toContain('Your car insurance is due for renewal and will end');
    });

    it('should have motor policy renew notification', async () => {
      expect(await utils.getElementTextIteration('.notification-text', 6)).toContain('Your car insurance will renew on');
    });
  });

  describe('check future mta notification on summary view', () => {

    beforeAll(async () => {
      credentials = {
        email: 'futuremta@esmock.com',
        password: 'futuremta1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have future mta notification', async () => {
      expect(await utils.getFirstElementText('.notification-text'))
        .toContain('The change you\'ve made to your policy will come into effect');
    });
  });

  describe('check order of multiple policies reverse chronological', () => {

    beforeAll(async () => {
      credentials = {
        email: 'five@esmock.com',
        password: 'Customer5',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have array of start dates', () => {
      expect(policiesPage.allStartDates()).toBeTruthy();
    });

    it('should be in reverse chronological order', async () => {
      let isPreSorted = true;
      const allDates = policiesPage.allStartDates();
      const texts = await allDates.map(elm => elm.getText());

      texts.map((text) => {
        return +moment(text, 'ddd D, MMM YYYY');
      })
        .sort((a, b) => {
          isPreSorted = isPreSorted && (a > b);
          return a - b;
        });

      expect(isPreSorted).toBeTrue();
    });
  });

  describe('view details link', () => {
    beforeAll(async () => {
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should navigate to the policy details view', async () => {
      const currentUrl = await utils.getCurrentUrl();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/motor/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*/details$');
    });
  });

  describe('view documents link', () => {
    beforeAll(async () => {
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should navigate to the policy documents view', async () => {
      const currentUrl = await utils.getCurrentUrl();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-docs');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/motor/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*/documents$');
    });
  });

  describe('make a change link', () => {
    beforeAll(async () => {
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should navigate to the make a change view', async () => {
      const currentUrl = await utils.getCurrentUrl();
      await policiesPage.waitForPolicyCard();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.make-change');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/motor/[0-9_.-]*/[0-9_.-]*/amendments$');
    });
  });

  describe('make a claim link', () => {
    beforeAll(async () => {
      await utils.setScreenDesktop();
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should navigate to the make a claim view', async () => {
      const currentUrl = await utils.getCurrentUrl();
      await policiesPage.waitForPolicyCard();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.make-claim');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/motor/[0-9_.-]*/[0-9_.-]*/claim$');
    });
  });
});

describe('Motor polices details view', () => {
  let loginPage: LoginPage;
  let credentials: LoginCredentials;

  beforeAll(() => {
    loginPage = new LoginPage();
  });

  describe('check motor details view elements', () => {

    beforeAll(async () => {
      credentials = {
        email: 'five@esmock.com',
        password: 'Customer5',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have cover type title', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.cover-type')).toBeTrue();
    });

    it('should have Car in title', async () => {
      expect(await utils.getFirstElementText('.cover-type')).toContain('Car');
    });

    it('should have policy number', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-number')).toBeTrue();
    });

    it('should have vehicle make and model', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).toBeTrue();
    });

    it('should have start date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.start-date')).toBeTrue();
    });

    it('should have end date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.end-date')).toBeTrue();
    });

    it('should have main driver', async () => {
      expect(await utils.checkElementIsDisplayed('.main-driver')).toBeTrue();
    });

    it('should have named drivers', async () => {
      expect(await utils.checkElementIsDisplayed('.named-driver')).toBeTrue();
    });

    it('should have type of cover', async () => {
      expect(await utils.checkElementIsDisplayed('.policy-cover-type')).toBeTrue();
    });

    it('should have class of use', async () => {
      expect(await utils.checkElementIsDisplayed('.use-class')).toBeTrue();
    });

    it('should have estimated mileage', async () => {
      expect(await utils.checkElementIsDisplayed('.est-mileage')).toBeTrue();
    });

    it('should have drive other cars', async () => {
      expect(await utils.checkElementIsDisplayed('.other-vehicle')).toBeTrue();
    });

    it('should have european cover', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.eu-cover')).toBeTrue();
    });

    it('should have additional cover', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.addons p')).toBeTruthy();
    });

    it('should have no claim discount protection', async () => {
      expect(await utils.checkElementIsPresent('.ncd-years')).toBeTrue();
    });

    it('should have voluntary excess', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.voluntary-ex')).toBeTrue();
    });

    it('should have compulsory excess', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.compulsory-ex')).toBeTrue();
    });

    it('should have fire excess', async () => {
      expect(await utils.checkElementIsDisplayed('.fire-ex')).toBeTrue();
    });

    it('should have theft excess', async () => {
      expect(await utils.checkElementIsDisplayed('.theft-ex')).toBeTrue();
    });

    it('should have total cost', async () => {
      expect(await utils.checkElementIsDisplayed('.total-cost')).toBeTrue();
    });

    describe('check motor addons', () => {

      it('should not have car hire', async () => {
        expect(await utils.elementFinder('.chc').getAttribute('class')).toMatch('not-purchased');
      });

      it('should have motor legal protection', async () => {
        expect(await utils.elementFinder('.mlp').getAttribute('class')).toMatch('purchased');
      });

      it('should have key cover', async () => {
        expect(await utils.elementFinder('.kyc').getAttribute('class')).toMatch('purchased');
      });

      it('should not have breakdown cover', async () => {
        expect(await utils.elementFinder('.bkc').getAttribute('class')).toMatch('not-purchased');
      });

      it('should not have personal injury cover', async () => {
        expect(await utils.elementFinder('.pib').getAttribute('class')).toMatch('not-purchased');
      });

      it('should have misfuelling cover', async () => {
        expect(await utils.elementFinder('.mfs').getAttribute('class')).toMatch('purchased');
      });
    });
  });
});

// TODO - add back in once PaymentAPI updated with CC and DD content
//   describe('Check payment details for credit card customer', () => {
//
//     beforeAll(() => {
//       credentials = {
//         email: 'one@esmock.com',
//         password: 'Customer1',
//       };
//
//       loginPage.navigateTo();
//       app.waitUntilReady();
//       loginPage.loginAs(app, credentials.email, credentials.password);
//       app.utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
//
//     });
//
//     afterAll(() => {
//       app.deleteAppStorage();
//     });
//
//     it('should have cardholder name', () => {
//       expect(policiesPage.hasCardHolderName()).toBeTrue();
//     });
//
//     it('should have expiry date', () => {
//       expect(policiesPage.hasCardExpiryDate()).toBeTrue();
//     });
//
//     it('should have card last 4 digits', () => {
//       expect(policiesPage.hasCardLastDigits()).toBeTrue();
//     });
//
//     it('should have amount paid', () => {
//       expect(policiesPage.hasAmountPaid()).toBeTrue();
//     });
//   });
// TODO - add back in once PaymentAPI updated with CC and DD content
//   describe('Check payment details for monthly direct debit', () => {
//
//     beforeAll(() => {
//       credentials = {
//         email: 'three@esmock.com',
//         password: 'Customer3',
//       };
//
//       loginPage.navigateTo();
//       app.waitUntilReady();
//       loginPage.loginAs(app, credentials.email, credentials.password);
//       app.utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
//
//     });
//
//     afterAll(() => {
//       app.deleteAppStorage();
//     });
//     // it('should have initial payment', () => {
//     //   expect(policiesPage.hasInitialPayment()).toBeTrue();
//     // });
//     //
//     // it('should have monthly payments', () => {
//     //   expect(policiesPage.hasMonthlyPayment()).toBeTrue();
//     // });
//
//     it('should have total cost', () => {
//       expect(app.utils.checkLinkText('.total-cost')).toBeTrue();
//     });
//   });

// TODO - add back in once PaymentAPI updated with CC and DD content
//   describe('Check payment details for annual direct debit', () => {
//
//     beforeAll(() => {
//       credentials = {
//         email: 'seven@esmock.com',
//         password: 'Customer7',
//       };
//
//       loginPage.navigateTo();
//       app.waitUntilReady();
//       loginPage.loginAs(app, credentials.email, credentials.password);
//       app.utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
//
//     });
//
//
//     afterAll(() => {
//       app.deleteAppStorage();
//     });
//     // it('should have cardholder name', () => {
//     //   expect(policiesPage.hasAnnualPayment()).toBeTrue();
//     // });
//
//     it('should have total cost', () => {
//       expect(app.utils.checkLinkText('.total-cost')).toBeTrue();
//     });
//
//   });
// });

describe('home polices details view', () => {
  let loginPage: LoginPage;
  let policiesPage: PoliciesPage;
  let credentials: LoginCredentials;

  beforeAll(() => {
    loginPage = new LoginPage();
    policiesPage = new PoliciesPage();
  });

  describe('Check home details view elements', () => {

    beforeAll(async () => {
      credentials = {
        email: 'one@esmock.com',
        password: 'Customer1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have cover type title', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.cover-type')).toBeTrue();
    });

    it('should have Home in title', async () => {
      expect(await utils.getFirstElementText('.cover-type')).toContain('Home');
    });

    it('should have policy number', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-number')).toBeTrue();
    });

    it('should have an address', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.policy-identifier')).toBeTrue();
    });

    it('should have a postcode', async () => {
      expect(await utils.checkElementIsDisplayed('.postcode')).toBeTrue();
    });

    it('should have start date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.start-date')).toBeTrue();
    });

    it('should have end date', async () => {
      expect(await utils.checkFirstElementIsDisplayed('.end-date')).toBeTrue();
    });

    it('should have type of cover', async () => {
      expect(await utils.checkElementIsDisplayed('.policy-cover-type')).toBeTrue();
    });

    // NCD is only shown on Sheilas Wheels...
    it('should not have no claim discount', async () => {
      expect(await utils.checkElementIsPresent('.ncd-years')).toBeFalse();
    });

    it('should have a policyholder', async () => {
      expect(await utils.checkElementIsDisplayed('.policyholder')).toBeTrue();
    });

    it('should have personal possessions', async () => {
      expect(await utils.checkElementIsPresent('.personal-possessions')).toBeTrue();
    });

    it('should have high value items', async () => {
      expect(await utils.checkElementIsPresent('.high-value-items')).toBeTrue();
    });

    describe('Check home addons', () => {

      it('should have home emergency cover', async () => {
        expect(await utils.elementFinder('.hec').getAttribute('class')).toMatch('purchased');
      });

      it('should have family legal protection', async () => {
        expect(await utils.elementFinder('.flp').getAttribute('class')).toMatch('purchased');
      });

      it('should have pest cover', async () => {
        expect(await utils.elementFinder('.pes').getAttribute('class')).toMatch('purchased');
      });

      it('should not have annual travel insurance', async () => {
        expect(await utils.elementFinder('.atv').getAttribute('class')).toMatch('not-purchased');
      });
    });
  });

  describe('Check home summary view elements for Building Only cover', () => {

    beforeAll(async () => {
      credentials = {
        email: 'one@esmock.com',
        password: 'Customer1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
      await policiesPage.clickSecondViewDetailsLink();
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should not have personal possessions', async () => {
      expect(await utils.checkElementIsPresent('.personal-possessions')).toBeFalse();
    });

    it('should not have high value items', async () => {
      expect(await utils.checkElementIsPresent('.high-value-items')).toBeFalse();
    });
  });

  // TODO - add back in once PaymentAPI updated with CC and DD content
  //   describe('Check payment details for credit card customer', () => {
  //
  //     beforeAll(() => {
  //       credentials = {
  //         email: 'one@esmock.com',
  //         password: 'Customer1',
  //       };
  //
  //       loginPage.navigateTo();
  //       app.waitUntilReady();
  //       loginPage.loginAs(app, credentials.email, credentials.password);
  //       app.utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
  //     });
  //
  //     afterAll(() => {
  //       app.deleteAppStorage();
  //     });
  //
  //     it('should have cardholder name', () => {
  //       expect(policiesPage.hasCardHolderName()).toBeTrue();
  //     });
  //
  //     it('should have expiry date', () => {
  //       expect(policiesPage.hasCardExpiryDate()).toBeTrue();
  //     });
  //
  //     it('should have card last 4 digits', () => {
  //       expect(policiesPage.hasCardLastDigits()).toBeTrue();
  //     });
  //
  //     it('should have amount paid', () => {
  //       expect(policiesPage.hasAmountPaid()).toBeTrue();
  //     });
  //   });
  // TODO - add back in once PaymentAPI updated with CC and DD content
  //   describe('Check payment details for annual direct debit', () => {
  //
  //     beforeAll(() => {
  //       credentials = {
  //         email: 'seven@esmock.com',
  //         password: 'Customer7',
  //       };
  //
  //       loginPage.navigateTo();
  //       app.waitUntilReady();
  //       loginPage.loginAs(app, credentials.email, credentials.password);
  //       app.utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
  //     });
  //
  //     afterAll(() => {
  //       app.deleteAppStorage();
  //     });
  //
  //     it('should have cardholder name', () => {
  //       expect(policiesPage.hasAnnualPayment()).toBeTrue();
  //     });
  //
  //     it('should have total cost', () => {
  //       expect(app.utils.checkLinkText('.total-cost')).toBeTrue();
  //     });
  //
  //   });
  // });
  //

});

describe('motor polices make a change view', () => {

  let credentials: LoginCredentials;

  describe('check make changes page for links to web forms', () => {

    beforeAll(async () => {
      credentials = {
        email: 'two@esmock.com',
        password: 'Customer2',
      };

      await utils.deleteAppStorage();
      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
      await policiesPage.waitForPolicyCard();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.make-change');
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have a link to add driver form', async () => {
      expect(await utils.checkElementByIdCanBeClicked('ctaAddDriver')).toBeTrue();
    });

    it('should have a link to change car form', async () => {
      expect(await utils.checkElementByIdCanBeClicked('ctaChangeCar')).toBeTrue();
    });

    it('should have a link to change number form', async () => {
      expect(await utils.checkElementByIdCanBeClicked('ctaChangeReg')).toBeTrue();
    });

    it('should have a link to add convictions form', async () => {
      expect(await utils.checkElementByIdCanBeClicked('ctaAddCon')).toBeTrue();
    });
  });

});

describe('notifications on details view', () => {
  let loginPage: LoginPage;
  let policiesPage: PoliciesPage;
  let credentials: LoginCredentials;

  beforeAll(() => {
    loginPage = new LoginPage();
    policiesPage = new PoliciesPage();
  });

  describe('Check future mta notification on details page', () => {

    beforeAll(async () => {
      credentials = {
        email: 'futuremta@esmock.com',
        password: 'futuremta1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have future mta notification', async () => {
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
      await utils.waitForViewAnimation();
      expect(await utils.checkElementIsPresent('.notification.messages-container.is-info')).toBeTrue();
      expect(await utils.getElementTextIteration('.notification-text', 0)).toContain('The change you');
    });
  });

  describe('Check notifications on details page', () => {

    beforeAll(async () => {
      credentials = {
        email: 'renewal@esmock.com',
        password: 'renewal1',
      };

      await utils.navigateToLogin();
      await loginPage.loginAs(credentials.email, credentials.password);
      await utils.waitForViewAnimation();
    });

    afterAll(async () => {
      await utils.deleteAppStorage();
    });

    it('should have ncd notification', async () => {
      const currentUrl = await utils.getCurrentUrl();
      await utils.checkFirstElementCanBeClickedAndClick('.policy-card a.view-details');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/(motor|home)/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*/details$');
      await utils.waitForViewAnimation();
      expect(await utils.checkFirstElementIsDisplayed('.notification.messages-container.is-warning')).toBeTrue();
      expect(await utils.getElementTextIteration('.notification-text', 0)).toContain('We urgently need');
    });

    it('should have auto renewal notification', async () => {
      let currentUrl = await utils.getCurrentUrl();
      await utils.getElementByIdAndClick('nav-policies');
      await utils.waitUntilRouteChangedFrom(currentUrl);
      currentUrl = await utils.getCurrentUrl();
      expect(currentUrl).toMatch('^.*/portal/policies$');
      await utils.waitForViewAnimation();
      await policiesPage.clickSecondViewDetailsLink();
      await utils.waitUntilRouteChangedFrom(currentUrl);
      expect(await utils.getCurrentUrl()).toMatch('^.*/portal/policies/(motor|home)/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*/details$');
      await utils.waitForViewAnimation();
      expect(await utils.checkElementIsDisplayed('.notification.messages-container.is-success')).toBeTrue();
      expect(await utils.getElementTextIteration('.notification-text', 0)).toContain('insurance will automatically renew');
    });

  });
});
