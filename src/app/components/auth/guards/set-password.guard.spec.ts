import { Router } from '@angular/router';

import { SetPasswordGuard } from './set-password.guard';
import { AuthService } from '../auth.service';

describe('SetPasswordGuard', () => {

  let setPasswordGuard: SetPasswordGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    setPasswordGuard = new SetPasswordGuard(authService, router);
  });

  it('canActivate should return true if JWT has challengeKey', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(true);
    expect(setPasswordGuard.canActivate()).toBeTrue();
  });

  it('canActivate should return false if JWT does not have challenge key', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(false);
    expect(setPasswordGuard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

});
