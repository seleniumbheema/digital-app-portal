import { LoginPage, LoginCredentials } from '../po/login.po';
import { SidebarNav } from '../po/app/sidebarNav.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Special Offers view', () => {
  let loginPage = new LoginPage();
  let sidebarNav = new SidebarNav();

  beforeAll(async () => {
    loginPage = new LoginPage();
    sidebarNav = new SidebarNav();

    await utils.navigateToLogin();

    let credentials: LoginCredentials;
    credentials = {
      email: 'six@esmock.com',
      password: 'Customer6',
    };
    await loginPage.loginAs(credentials.email, credentials.password);
  });

  afterAll(async () => {
    await utils.deleteAppStorage();
  });

  describe('Has links to relevant offers', () => {
    beforeAll(async () => {
      await sidebarNav.clickSpecialOffersBtn();
      await utils.waitUntilRouteChangedTo('/portal/offers');
      await utils.waitForViewAnimation();
    });

    it('should navigate to special offers view', async () => {
      const url = await utils.getCurrentUrl();
      expect(url).toContain('/portal/offers');
    });

    it('should have valid motor offer link', async () => {
      expect(await utils.checkElementIsDisplayed('.motor a.get-quote')).toBeTrue();
      expect(await utils.getElementAttribute('.motor a.get-quote', 'href')).toContain('/new/motor');
      expect(await utils.getFirstElementText('.travel .more-details')).toContain('More Details');
    });

    it('should have valid home offer link', async () => {
      expect(await utils.checkElementIsDisplayed('.home-one a.get-quote')).toBeTrue();
      expect(await utils.getElementAttribute('.home-one a.get-quote', 'href')).toContain('/new/home');
      expect(await utils.getFirstElementText('.home-one .more-details')).toContain('More Details');
    });

    it('should have valid multicar offer link', async () => {
      expect(await utils.checkElementIsDisplayed('.multicar-one a.get-quote')).toBeTrue();
      expect(await utils.getElementAttribute('.multicar-one a.get-quote', 'href')).toContain('https://multicar.esure.com/video');
      expect(await utils.getFirstElementText('.multicar-one .more-details')).toContain('More Details');
    });

    it('should have valid travel offer link', async () => {
      expect(await utils.checkElementIsDisplayed('.travel a.get-quote')).toBeTrue();
      expect(await utils.getElementAttribute('.travel a.get-quote', 'href')).toContain('/esure.hoodtravel.co.uk');
      expect(await utils.getFirstElementText('.travel .more-details')).toContain('More Details');
    });
  });

});
