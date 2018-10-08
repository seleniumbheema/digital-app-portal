import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { HttpErrorModel } from '../services/http.service';
import { DecodeUsernameResolver } from './decode-username.resolver';

describe('DecodeUsernameResolver', () => {

  let decodeUsernameResolver: DecodeUsernameResolver;
  let authService: AuthService;
  let router: any;
  const mockSnapshot = { params: { token: 'abc123.def456' } as any } as ActivatedRouteSnapshot;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    authService = new AuthService(null, null, null, null, null);
    decodeUsernameResolver = new DecodeUsernameResolver(authService, router);
  });

  it('should resolve an object with if http request is successful', (done) => {
    const returnValue = of({ status: 'OK ' });
    spyOn(authService, 'getUsernameFromToken').and.returnValue(returnValue);
    const resolve = decodeUsernameResolver.resolve(mockSnapshot);
    resolve.subscribe(
      (data) => {
        expect(data).toHaveMember('status');
        expect(authService.getUsernameFromToken).toHaveBeenCalled();
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate reset password page if http request returns an error', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 401, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(authService, 'getUsernameFromToken').and.returnValue(returnValue);
    const resolve = decodeUsernameResolver.resolve(mockSnapshot);
    resolve.subscribe(
      (data) => {
        expect(data).toBe(httpError);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/trouble/password/error');
        expect(authService.getUsernameFromToken).toHaveBeenCalled();
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

});
