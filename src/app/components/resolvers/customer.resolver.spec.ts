import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { Customer } from '../../models/customer';
import { CustomerResolver } from './customer.resolver';
import { CustomerDataService } from '../services/customer-data.service';
import { HttpErrorModel } from '../services/http.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('CustomerResolver', () => {

  let customerResolver: CustomerResolver;
  let customerDataService: CustomerDataService;
  let router: any;
  let cookieService: CookieService;
  const customer = new Customer({});
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    cookieService = {
      get: (key: string) => { return key; },
    } as CookieService;
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    customerResolver = new CustomerResolver(customerDataService, router);
  });

  it('should resolve a Customer object', (done) => {
    const returnValue = of(customer);
    spyOn(customerDataService, 'setCustomer').and.returnValue(returnValue);
    const resolve = customerResolver.resolve();
    resolve.subscribe(
      (data) => {
        expect(data).toBe(customer);
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 404 page if 404 error occurs', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 404, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(customerDataService, 'setCustomer').and.returnValue(returnValue);
    const resolve = customerResolver.resolve();

    resolve.subscribe(
      (data) => {
        expect(data).toBeUndefined();
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
    spyOn(customerDataService, 'setCustomer').and.returnValue(returnValue);
    const resolve = customerResolver.resolve();

    resolve.subscribe(
      (data) => {
        expect(data).toBeUndefined();
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
    spyOn(customerDataService, 'setCustomer').and.returnValue(returnValue);
    const resolve = customerResolver.resolve();

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
});
