import { Router } from '@angular/router';

import { ResetPasswordGuard } from './reset-password.guard';
import { AuthService } from '../auth.service';

describe('ResetPasswordGuard', () => {

  let resetPasswordGuard: ResetPasswordGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    resetPasswordGuard = new ResetPasswordGuard(authService, router);
  });

  it('canActivate should return true if JWT has email key', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(true);
    expect(resetPasswordGuard.canActivate()).toBeTrue();
  });

  it('canActivate should return false if JWT does not have email key', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(false);
    expect(resetPasswordGuard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/trouble/password');
  });

});
