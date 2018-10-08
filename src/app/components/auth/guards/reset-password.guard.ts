import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from '../auth.service';
import { JWT_EMAIL_KEY_PROPERTY_NAME } from '../auth.module';

@Injectable()
export class ResetPasswordGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    console.debug('GUARD: canActivate called for ResetPasswordGuard');
    const hasEmailKey = this.authService.tokenHasKey(JWT_EMAIL_KEY_PROPERTY_NAME);

    if (hasEmailKey) {
      return true;
    }
    this.router.navigateByUrl('/auth/trouble/password');
    return false;
  }
}
