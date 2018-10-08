import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanLoad } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable()
export class LoggedInAlreadyGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    console.debug('GUARD: canActivate called for LoggedInAlreadyGuard');
    return this.doLoggedInCheck();
  }

  canActivateChild(): boolean {
    console.debug('GUARD: canActivateChild called for LoggedInAlreadyGuard');
    return this.doLoggedInCheck();
  }

  canLoad(): boolean {
    console.debug('GUARD: canLoad called for LoggedInAlreadyGuard');
    return this.doLoggedInCheck();
  }

  private doLoggedInCheck(): boolean {
    const loggedIn = this.authService.isUserLoggedIn();
    if (loggedIn) {
      // Important here to specify the full URL, just using / does not work when canLoad is called for some reason
      this.router.navigateByUrl('/portal');
      return false;
    }
    return true;
  }
}
