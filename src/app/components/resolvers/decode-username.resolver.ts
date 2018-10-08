import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpErrorModel } from '../services/http.service';

@Injectable()
export class DecodeUsernameResolver implements Resolve<object> {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<object> {
    console.debug('RESOLVER: DecodeUsernameResolver called');
    const tokenParam = route.params.token;

    return this.authService.getUsernameFromToken(tokenParam).pipe(
      first(),
      catchError((error: HttpErrorModel) => {
        this.router.navigateByUrl('/auth/trouble/password/error');
        return of(error);
      }));
  }
}
