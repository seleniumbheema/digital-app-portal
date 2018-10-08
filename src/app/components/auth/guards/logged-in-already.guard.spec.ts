import { Router } from '@angular/router';

import { LoggedInAlreadyGuard } from './logged-in-already.guard';
import { AuthService } from '../auth.service';

describe('LoggedInAlreadyGuard', () => {

  let loggedInAlreadyGuard: LoggedInAlreadyGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    loggedInAlreadyGuard = new LoggedInAlreadyGuard(authService, router);
  });

  it('canActivate should return false if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInAlreadyGuard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/portal');
  });

  it('canActivate should return true if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInAlreadyGuard.canActivate()).toBeTrue();
  });

  it('canActivateChild should return false if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInAlreadyGuard.canActivateChild()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/portal');
  });

  it('canActivateChild should return true if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInAlreadyGuard.canActivateChild()).toBeTrue();
  });

  it('canLoad should return false if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInAlreadyGuard.canLoad()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/portal');
  });

  it('canLoad should return true if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInAlreadyGuard.canLoad()).toBeTrue();
  });

});
