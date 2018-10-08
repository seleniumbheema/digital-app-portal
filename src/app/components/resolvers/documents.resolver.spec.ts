import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { DocumentsResolver } from './documents.resolver';
import { PolicyDataService } from '../services/policy-data.service';
import { HttpErrorModel } from '../services/http.service';
import { CustomerDataService } from '../services/customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('DocumentsResolver', () => {

  let documentsResolver: DocumentsResolver;
  let policyDataService: PolicyDataService;
  let customerDataService: CustomerDataService;
  let router: any;
  const mockSnapshot = { params: { policyNumber: 111 } as any } as ActivatedRouteSnapshot;
  const policyDocumentsArray = [{ id: 1 }, { id: 2 }];
  const cookieService = { get: (key: string) => { return key; } } as CookieService;
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    policyDataService = new PolicyDataService(null);
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    documentsResolver = new DocumentsResolver(policyDataService, router, customerDataService);
  });

  it('should resolve an array of PolicyDocument objects', (done) => {
    const returnValue = of(policyDocumentsArray);
    spyOn(policyDataService, 'getDocuments').and.returnValue(returnValue);
    const resolve = documentsResolver.resolve(mockSnapshot);
    resolve.subscribe(
      (data) => {
        expect(data).toBeArrayOfObjects();
        expect(data).toBeArrayOfSize(2);
        expect(data[0].id).toBe(1);
        expect(data[1].id).toBe(2);
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });

  it('should navigate to 500 page if error occurs that is not 404 or 403', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 500, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(policyDataService, 'getDocuments').and.returnValue(returnValue);
    const resolve = documentsResolver.resolve(mockSnapshot);

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

  it('should resolve empty array if error occurs that is 403', (done) => {
    const httpError: HttpErrorModel = { errMsg: '', body: '', statusCode: 403, statusText: '' };
    const returnValue = throwError(httpError);
    spyOn(policyDataService, 'getDocuments').and.returnValue(returnValue);
    const resolve = documentsResolver.resolve(mockSnapshot);

    resolve.subscribe(
      (data) => {
        expect(data).toBeEmptyArray();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        done();
      },
      () => {
        fail('Not expected to fail!');
      });
  });
});
