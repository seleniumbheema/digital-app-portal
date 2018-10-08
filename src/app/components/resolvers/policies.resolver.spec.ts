import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { PoliciesResolver } from './policies.resolver';
import { PolicyDataService } from '../services/policy-data.service';
import { HttpErrorModel } from '../services/http.service';
import { CustomerDataService } from '../services/customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('PoliciesResolver', () => {

  let policiesResolver: PoliciesResolver;
  let policyDataService: PolicyDataService;
  let customerDataService: CustomerDataService;
  let router: any;
  const policySummaryArray = [{ number: 1, address: {} }];
  const cookieService = { get: (key: string) => { return key; } } as CookieService;
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    policyDataService = new PolicyDataService(null);
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    policiesResolver = new PoliciesResolver(policyDataService, router, customerDataService);
  });

  it('should resolve an array of PolicySummary objects', (done) => {
    const returnValue = of(policySummaryArray);
    spyOn(policyDataService, 'getPolicies').and.returnValue(returnValue);
    const resolve = policiesResolver.resolve();
    resolve.subscribe(
      (data) => {
        expect(data).toBeArrayOfObjects();
        expect(data).toBeArrayOfSize(1);
        expect(data[0].number).toBe(1);
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 500 page if error occurs', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 500, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(policyDataService, 'getPolicies').and.returnValue(returnValue);
    const resolve = policiesResolver.resolve();

    resolve.subscribe(
      (data) => {
        expect(data).toBeEmptyArray();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/error/500');
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });
});
