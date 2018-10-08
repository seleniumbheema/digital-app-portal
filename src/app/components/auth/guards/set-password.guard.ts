import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from '../auth.service';
import { JWT_CHALLENGE_KEY_PROPERTY_NAME } from '../auth.module';

@Injectable()
export class SetPasswordGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    console.debug('GUARD: canActivate called for SetPasswordGuard');
    const hasChallengeKey = this.authService.tokenHasKey(JWT_CHALLENGE_KEY_PROPERTY_NAME);

    if (hasChallengeKey) {
      return true;
    }
    this.router.navigateByUrl('/auth');
    return false;
  }
}
