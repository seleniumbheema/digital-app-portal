import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanLoad } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    console.debug('GUARD: canActivate called for LoggedInGuard');
    return this.doLoggedInCheck();
  }

  canActivateChild(): boolean {
    console.debug('GUARD: canActivateChild called for LoggedInGuard');
    return this.doLoggedInCheck();
  }

  canLoad(): boolean {
    console.debug('GUARD: canLoad called for LoggedInGuard');
    return this.doLoggedInCheck();
  }

  private doLoggedInCheck(): boolean {
    const loggedIn = this.authService.isUserLoggedIn();
    if (loggedIn) {
      return true;
    }

    // TODO: Look into this a bit more, would we always want to call logout and remove the cookie etc???
    // this.authService.logout(false);
    // Important here to specify the full URL, just using / does not work when canLoad is called for some reason
    this.router.navigateByUrl('/auth');
    return false;
  }
}
