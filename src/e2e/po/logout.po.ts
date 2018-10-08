import { browser, promise } from 'protractor';

export class LogoutPage {

  navigateTo(): promise.Promise<any> {
    return browser.get('/auth/logout');
  }
}
