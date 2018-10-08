import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { JWT_HEADER_NAME } from '../auth/auth.module';

@Injectable()
export class HttpModifyInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.debug('Req is: ', req);
    const started = Date.now();
    const authService = this.injector.get(AuthService);
    const accessToken = authService.getAccessToken();
    /* istanbul ignore next */
    const httpHeaders = {
      // Add the access token only if we have one
      ...accessToken && {
        AccessToken: accessToken,
      },
      Brand: ESURE_GLOBALS.BRAND_CONFIG.brandCode,
    };
    const modifiedReq = req.clone({ setHeaders: httpHeaders });
    /* istanbul ignore next */
    return next
      .handle(modifiedReq).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            this.handleTokenHeader(event.headers);
            const elapsed = Date.now() - started;
            console.debug(`${req.method} to ${req.urlWithParams} took ${elapsed} ms. Response status code was ${event.status}.`);
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleTokenHeader(err.headers);
          const elapsed = Date.now() - started;
          console.debug(`${req.method} to ${req.urlWithParams} took ${elapsed} ms. Response status code was ${err.status}.`);
          return throwError(err);
        }));
  }

  /**
   * If there is a JWT in the headers, then update the app with the token.
   * @param headers the headers
   */
  /* istanbul ignore next */
  private handleTokenHeader(headers: HttpHeaders) {
    const tokenHeader = headers.get(JWT_HEADER_NAME);
    if (tokenHeader) {
      const authService = this.injector.get(AuthService);
      authService.setJwtToken(tokenHeader);
    }
  }
}
