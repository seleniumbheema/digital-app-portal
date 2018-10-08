import { ElementFinder } from 'protractor';

import { LoginPage, LoginCredentials } from '../po/login.po';
import { PoliciesPage } from '../po/policies.po';
import { DocumentsPage } from '../po/documents.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Documents page', () => {

  let loginPage = new LoginPage();
  let policiesPage = new PoliciesPage();
  let documentsPage = new DocumentsPage();

  beforeAll(async () => {

    loginPage = new LoginPage();
    policiesPage = new PoliciesPage();
    documentsPage = new DocumentsPage();

    await utils.navigateToLogin();
    await utils.setScreenDesktop();

    let credentials: LoginCredentials;
    credentials = {
      email: 'documents@esmock.com',
      password: 'documents1',
    };
    await loginPage.loginAs(credentials.email, credentials.password);
    await utils.waitUntilRouteChangedTo('/portal/policies');
    await utils.waitForViewAnimation();
  });

  afterAll(async () => {
    await utils.deleteAppStorage();
  });

  describe('Policy with no documents', () => {

    beforeAll(async () => {
      await policiesPage.clickSpecifiedViewDocumentsLink(0);
      await utils.waitUntilRouteChangedTo('^.*/portal/policies/home/[0-9]+/[0-9]+/documents$');
      await utils.waitForViewAnimation();
    });

    it('should have Cover Details tab', async () => {
      const hasTab = await documentsPage.hasViewDetailsTab();
      expect(hasTab).toBeTrue();
    });

    it('should have Policy Documents tab', async () => {
      const hasTab = await documentsPage.hasViewDocsTab();
      expect(hasTab).toBeTrue();
    });

    it('should have Make Changes tab', async () => {
      const hasTab = await documentsPage.hasMakeChangeTab();
      expect(hasTab).toBeTrue();
    });

    it('should have Make Claim tab', async () => {
      const hasTab = await documentsPage.hasMakeClaimTab();
      expect(hasTab).toBeTrue();
    });

    it('should have cover type title', async () => {
      const hasCoverType = await utils.checkElementIsPresent('.cover-type');
      expect(hasCoverType).toBeTrue();
    });

    it('should have policy number', async () => {
      const hasPolicyNumber = await utils.checkElementIsPresent('.policy-number');
      expect(hasPolicyNumber).toBeTrue();
    });

    it('should display message about no documents found', async () => {
      expect(await utils.checkElementIsDisplayed('.notification.messages-container.is-info'));
    });
  });

  describe('Policy with documents in policy year 1', () => {

    beforeAll(async () => {
      await utils.getElementAndClick('#nav-policies');
      await utils.waitUntilRouteChangedTo('^.*/portal/policies$');
      await utils.waitForViewAnimation();
      await policiesPage.clickSpecifiedViewDocumentsLink(1);
      await utils.waitUntilRouteChangedTo('^.*/portal/policies/home/[0-9]+/[0-9]+/documents$');
      await utils.waitForViewAnimation();
    });

    it('should display current policy documents header', async () => {
      const header: ElementFinder = await documentsPage.getCurrentDocumentsHeader();
      expect(await header.getText()).toStartWith('Current');
    });

    it('should display 1 period of cover header', async () => {
      expect(await utils.elementArrayFinder('#documents header.card-header').count()).toBe(1);
    });

    it('should have 5 columns, one for each document', async () => {
      expect(await utils.elementArrayFinder('#documents .content .columns').count()).toBe(5);
    });

    it('should have 5 download links', async () => {
      expect(await utils.elementArrayFinder('#documents .content .columns .fa-download').count()).toBe(5);
    });

    it('should have a minus icon to indicate cover header can be collapsed', async () => {
      expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-minus').count()).toBe(1);
    });

    it('should have a plus icon if cover header is collapsed', async () => {
      await utils.elementArrayFinder('#documents header.card-header').click();
      expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-plus').count()).toBe(1);
    });
  });

  describe('Policy with documents in policy year 4', () => {

    beforeAll(async () => {
      await utils.getElementAndClick('#nav-policies');
      await utils.waitUntilRouteChangedTo('^.*/portal/policies$');
      await utils.waitForViewAnimation();
      await policiesPage.clickSpecifiedViewDocumentsLink(2);
      await utils.waitUntilRouteChangedTo('^.*/portal/policies/home/[0-9]+/[0-9]+/documents$');
      await utils.waitForViewAnimation();
    });

    it('should display current policy documents header', async () => {
      const header: ElementFinder = await documentsPage.getCurrentDocumentsHeader();
      expect(await header.getText()).toStartWith('Current');
    });

    it('should display previous policy documents header', async () => {
      expect(await documentsPage.getPreviousDocumentsHeader().getText()).toStartWith('Previous');
    });

    it('should display 7 period of cover headers', async () => {
      expect(await utils.elementArrayFinder('#documents header.card-header').count()).toBe(7);
    });

    it('should have 2 period of covers expanded and 5 collapsed', async () => {
      expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-minus').count()).toBe(2);
      expect(await utils.elementArrayFinder('#documents header.card-header .icon .fa-plus').count()).toBe(5);
    });

  });

});
