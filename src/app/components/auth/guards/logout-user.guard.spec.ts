import { LogoutUserGuard } from './logout-user.guard';
import { AuthService } from '../auth.service';

describe('LogoutUserGuard', () => {

  let logoutUserGuard: LogoutUserGuard;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(null, null, null, null, null);
    logoutUserGuard = new LogoutUserGuard(authService);
  });

  it('canActivate should logout user and return true', () => {
    spyOn(authService, 'logout');
    expect(logoutUserGuard.canActivate()).toBeTrue();
    expect(authService.logout).toHaveBeenCalledWith(false);
  });

});
