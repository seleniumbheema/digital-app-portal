import { Router } from '@angular/router';

import { LoggedInGuard } from './logged-in.guard';
import { AuthService } from '../auth.service';

describe('LoggedInGuard', () => {

  let loggedInGuard: LoggedInGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    loggedInGuard = new LoggedInGuard(authService, router);
  });

  it('canActivate should return true if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInGuard.canActivate()).toBeTrue();
  });

  it('canActivate should return false if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInGuard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

  it('canActivateChild should return true if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInGuard.canActivateChild()).toBeTrue();
  });

  it('canActivateChild should return false if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInGuard.canActivateChild()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

  it('canLoad should return true if user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    expect(loggedInGuard.canLoad()).toBeTrue();
  });

  it('canLoad should return false if user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
    expect(loggedInGuard.canLoad()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

});
