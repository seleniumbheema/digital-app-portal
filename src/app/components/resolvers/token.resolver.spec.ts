import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { TokenResolver } from './token.resolver';
import { AuthService } from '../auth/auth.service';
import { HttpErrorModel } from '../services/http.service';
import { CustomerDataService } from '../services/customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('TokenResolver', () => {

  let tokenResolver: TokenResolver;
  let authService: AuthService;
  let customerDataService: CustomerDataService;
  let router: any;
  const cookieService = { get: (key: string) => { return key; } } as CookieService;
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    tokenResolver = new TokenResolver(authService, router, customerDataService);
  });

  it('should resolve an object with data property if token is valid', (done) => {
    spyOn(authService, 'isValidToken').and.returnValue(true);
    const resolve = tokenResolver.resolve();
    resolve.subscribe(
      (data) => {
        expect(data).toHaveMember('data');
        expect(data['data']).toBe('Token already existed');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should resolve an object with body null if token does not exist', (done) => {
    const returnValue = of(null);
    spyOn(authService, 'isValidToken').and.returnValue(false);
    spyOn(authService, 'getToken').and.returnValue(returnValue);
    const resolve = tokenResolver.resolve();
    resolve.subscribe(
      (data) => {
        expect(data).toBeNull();
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 404 page if 404 error occurs', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 404, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(authService, 'isValidToken').and.returnValue(false);
    spyOn(authService, 'getToken').and.returnValue(returnValue);
    const resolve = tokenResolver.resolve();
    resolve.subscribe(
      (data) => {
        expect(data).toBe(httpError);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error/404');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 404 page if 403 error occurs', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 403, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(authService, 'isValidToken').and.returnValue(false);
    spyOn(authService, 'getToken').and.returnValue(returnValue);

    const resolve = tokenResolver.resolve();

    resolve.subscribe(
      (data) => {
        expect(data).toBe(httpError);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error/404');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 500 page if error occurs that is not 404 or 403', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 500, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(authService, 'isValidToken').and.returnValue(false);
    spyOn(authService, 'getToken').and.returnValue(returnValue);
    const resolve = tokenResolver.resolve();

    resolve.subscribe(
      (data) => {
        expect(data).toBe(httpError);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error/500');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });
});
