import { LogoutPage } from '../po/logout.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

describe('Logout page', () => {
  const logoutPage = new LogoutPage();

  beforeEach(async () => {
    await logoutPage.navigateTo();
  });

  afterEach(async () => {
    await utils.deleteAppStorage();
  });

  describe('landing on logout page', () => {
    it('should display logged out message', async () => {
      expect(await utils.checkElementIsPresent('.signed-out-text')).toBeTrue();
    });

    it('should display get quote button', async () => {
      expect(await utils.checkElementIsPresent('.get-quote')).toBeTrue();
    });

    it('should display more details link', async () => {
      expect(await utils.checkElementIsPresent('.more-details')).toBeTrue();
    });

    it('should display NPS survey elements', async () => {
      expect(await utils.checkElementByIdCanBeClicked('answerYes')).toBeTrue();
      expect(await utils.checkElementByIdCanBeClicked('answerNo')).toBeTrue();
      expect(await utils.checkElementCanBeClicked('.delete')).toBeTrue();
      expect(await utils.getElementText('.surveyModal .modal-card-body')).
        toContain('Has My Account saved you from phoning the call centre today?');
    });
  });

});
