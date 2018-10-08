import { Router } from '@angular/router';

import { RegisterConfirmationGuard } from './register-confirmation.guard';
import { AuthService } from '../auth.service';

describe('RegisterConfirmationGuard', () => {

  let registerConfirmationGuard: RegisterConfirmationGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    registerConfirmationGuard = new RegisterConfirmationGuard(authService, router);
  });

  it('canActivate should return true if JWT has email key', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(true);
    expect(registerConfirmationGuard.canActivate()).toBeTrue();
  });

  it('canActivate should return false if JWT does not have email key', () => {
    spyOn(authService, 'tokenHasKey').and.returnValue(false);
    expect(registerConfirmationGuard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/register');
  });

});
