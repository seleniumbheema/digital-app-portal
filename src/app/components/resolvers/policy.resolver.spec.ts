import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { PolicyResolver } from './policy.resolver';
import { PolicyDataService } from '../services/policy-data.service';
import { HttpErrorModel } from '../services/http.service';
import { HomePolicyDetails } from '../../models/policy/home-details';
import { CustomerDataService } from '../services/customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('PolicyResolver', () => {

  let policyResolver: PolicyResolver;
  let policyDataService: PolicyDataService;
  let customerDataService: CustomerDataService;
  let router: any;
  const mockSnapshot = { params: { policyNumber: 111 } as any, data: { policyType: 'home' } as any } as ActivatedRouteSnapshot;
  const policyDetails = new HomePolicyDetails({ address: {} });
  const cookieService = { get: (key: string) => { return key; } } as CookieService;
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    policyDataService = new PolicyDataService(null);
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    policyResolver = new PolicyResolver(policyDataService, router, customerDataService);
  });

  it('should resolve a PolicyDetails object', (done) => {
    const returnValue = of(policyDetails);
    spyOn(policyDataService, 'getPolicy').and.returnValue(returnValue);
    const resolve = policyResolver.resolve(mockSnapshot);
    resolve.subscribe(
      (data) => {
        expect(data).toBe(policyDetails);
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 500 page if error occurs that is not 404 or 403', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 500, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(policyDataService, 'getPolicy').and.returnValue(returnValue);
    const resolve = policyResolver.resolve(mockSnapshot);

    resolve.subscribe(
      (data) => {
        expect(data).toBeUndefined();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error/500');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should resolve undefined if error occurs that is 404 or 403', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 404, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(policyDataService, 'getPolicy').and.returnValue(returnValue);
    const resolve = policyResolver.resolve(mockSnapshot);

    resolve.subscribe(
      (data) => {
        expect(data).toBeUndefined();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });
});
