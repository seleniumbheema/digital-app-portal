import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpErrorModel } from '../services/http.service';
import { CustomerDataService } from '../services/customer-data.service';

@Injectable()
export class TokenResolver implements Resolve<object> {

  constructor(
    private authService: AuthService,
    private router: Router,
    private customerDataService: CustomerDataService,
  ) { }

  resolve(): Observable<object> {
    console.debug('RESOLVER: TokenResolver called');
    const jwtTokenValid = this.authService.isValidToken();
    if (!jwtTokenValid) {
      return this.authService.getToken().pipe(
        first(),
        catchError((error: HttpErrorModel) => {
          if (error.statusCode === 404 || error.statusCode === 403) {
            this.router.navigateByUrl('/error/404');
          } else {
            this.customerDataService.setLastError(error, 'error with authService.getToken');
            this.router.navigateByUrl('/error/500');
          }
          return of(error);
        }));
    }
    return of({ data: 'Token already existed' });
  }
}
