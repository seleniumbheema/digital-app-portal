import { LoginPage, LoginCredentials } from '../po/login.po';
import { SidebarNav } from '../po/app/sidebarNav.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Sidebar navigation', () => {
  let loginPage: LoginPage;
  let sidebarNav: SidebarNav;

  beforeAll(async () => {
    loginPage = new LoginPage();
    sidebarNav = new SidebarNav();

    await utils.navigateToLogin();

    let credentials: LoginCredentials;
    credentials = {
      email: 'two@esmock.com',
      password: 'Customer2',
    };
    await loginPage.loginAs(credentials.email, credentials.password);
  });

  afterAll(async () => {
    await utils.deleteAppStorage();
  });

  describe('Desktop view', () => {
    beforeEach(async () => {
      await utils.setScreenDesktop();
      await sidebarNav.waitForSidebarOpen();
    });

    it('should navigate policies page', async () => {
      const url = await utils.getCurrentUrl();
      expect(url).toContain('/portal/policies');
    });

    it('should have visible sidebar', async () => {
      expect(await utils.checkElementIsDisplayed('.ng-sidebar')).toBeTrue();
      const position = await sidebarNav.sidebarPosition();
      expect(position).toEqual(0);
    });

    it('should have my policies link', async () => {
      expect(await utils.checkElementIsDisplayed('aside a[href="/portal/policies"]')).toBeTrue();
    });

    it('should have my logout link', async () => {
      expect(await utils.checkElementIsDisplayed('aside')).toBeTrue();
    });
  });

  describe('Mobile view', () => {
    beforeAll(async () => {
      await utils.setScreenMobile();
      await sidebarNav.waitForSidebarClosed();
    });

    afterAll(async () => {
      await utils.setScreenDesktop();
    });

    it('should navigate policies page', async () => {
      const url = await utils.getCurrentUrl();
      expect(url).toContain('/portal/policies');
    });

    it('should have sidebar off screen', async () => {
      expect(await utils.checkElementIsDisplayed('.ng-sidebar')).toBeTrue();
      const positionMobile = await sidebarNav.sidebarPosition();
      expect(positionMobile).toBeLessThanOrEqual(-200);
    });

    it('should have hamburger button', async () => {
      expect(await utils.checkElementIsDisplayed('.hamburger-btn')).toBeTrue();
    });

    describe('Open hamburger', () => {
      beforeEach(async () => {
        await sidebarNav.clickHamburgerBtn();
      });

      it('should slide to open position', async () => {
        expect(await utils.checkElementIsDisplayed('.ng-sidebar')).toBeTrue();
        const position = await sidebarNav.sidebarPosition();
        expect(position).toEqual(0);
      });
    });

    describe('Close hamburger', () => {
      beforeEach(async () => {
        await sidebarNav.clickHamburgerBtn();
      });

      it('should slide to closed position', async () => {
        expect(await utils.checkElementIsDisplayed('.ng-sidebar')).toBeTrue();
        const positionMobile = await sidebarNav.sidebarPosition();
        expect(positionMobile).toBeLessThanOrEqual(-200);
      });
    });

  });
});
