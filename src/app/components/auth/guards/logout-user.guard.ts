import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../auth.service';

/**
 * Guard that can be run on any routes to make sure a user gets logged out.
 */
@Injectable()
export class LogoutUserGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    console.debug('GUARD: canActivate called for LogoutUserGuard');
    // Logout the user but do not redirect
    this.authService.logout(false);
    return true;
  }
}
