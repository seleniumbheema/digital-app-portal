import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { Customer } from '../../models/customer';
import { HttpService } from './http.service';
import { CustomerDataService } from './customer-data.service';
// import { Offer } from '../../models/offer';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';
import { Offer } from '../../models/offer';

describe('CustomerDataService', () => {
  let service: CustomerDataService;
  let serviceResponse: any;

  const mockPolicySummary = {
    policyNumber: '111',
    address: {},
  };

  const mockCustomer = new Customer({
    given_name: 'Boaty',
    family_name: 'McBoatFace',
    email: 'cccccc@ccccc.com',
    policies: [mockPolicySummary],
  });

  class MockHttpService {
    public get(): Observable<Customer> {
      return of(mockCustomer);
    }

    public post(): Observable<void> {
      return of(undefined);
    }
  }

  class MockCookieService {

    get(key: string) {
      return key;
    }

    public put(): void {

    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerDataService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: CookieService, useClass: MockCookieService },
        { provide: 'Window', useValue: window },
        BrandUrlPipe,
      ],
    });

    service = TestBed.get(CustomerDataService);
  });

  it('should get logoutOffers if brand not FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(false);
    const offers: Offer[] = service.getLogoutOffers();
    expect(offers).toBeArrayOfSize(1);
    expect(offers[0].class).toEqual('travel');
  });

  it('should not get logoutOffers if brand is FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(true);
    const offers: Offer[] = service.getLogoutOffers();
    expect(offers).toBeEmptyArray();
  });

  it('should get getTimeoutOffers if brand not FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(false);
    const offers: Offer[] = service.getTimeoutOffers();
    expect(offers).toBeArrayOfSize(3);
  });

  it('should not get getTimeoutOffers if brand is FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(true);
    const offers: Offer[] = service.getTimeoutOffers();
    expect(offers).toBeEmptyArray();
  });

  it('should get getLoginOffers if brand not FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(false);
    const offers: Offer[] = service.getLoginOffers();
    expect(offers).toBeArrayOfSize(3);
  });

  it('should not get getLoginOffers if brand is FA', () => {
    spyOn<any>(service, 'isFirstAlternative').and.returnValue(true);
    const offers: Offer[] = service.getLoginOffers();
    expect(offers).toBeEmptyArray();
  });

  describe('setCustomer() method', () => {
    it('should return a Customer object', (done) => {
      service.setCustomer().subscribe((response) => {
        serviceResponse = response;
        expect(serviceResponse instanceof Customer).toBeTrue();
        done();
      });
    });
  });

  describe('logError() method', () => {
    it('should return void', (done) => {
      service.logError().subscribe((response) => {
        expect(response).toBeUndefined();
        done();
      });
    });
  });

  describe('updateCookieBar() method', () => {

    it('should leave cookie bar hidden if cookie agreement was accepted on this browser', () => {
      service.cookieBarHidden = true;
      service.updateCookieBar();
      expect(service.cookieBarHidden).toBeTrue();
    });

    it('should hide cookie bar and leave hideCookieBarAfterLogin false if not already hidden and userClicked true', () => {
      service.cookieBarHidden = false;
      service.updateCookieBar();
      expect(service.cookieBarHidden).toBeFalse();
    });

  });

  describe('updateBrowserWarningBar() method', () => {

    it('should leave browser warning message hidden if agreement was accepted on this browser', () => {
      service.browserWarningHidden = true;
      service.updateBrowserWarningBar();
      expect(service.browserWarningHidden).toBeTrue();
    });

    it('should hide the browser warning bar message if the user accepts the agreement on their browser', () => {
      service.browserWarningHidden = false;
      service.updateBrowserWarningBar();
      expect(service.browserWarningHidden).toBeFalse();
    });

    it('should set a cookie if not already set', () => {
      spyOn(MockCookieService.prototype, 'get').and.returnValue(undefined);
      spyOn(MockCookieService.prototype, 'put');
      service.browserWarningHidden = false;
      service.updateBrowserWarningBar();
      expect(service.browserWarningHidden).toBeTrue();
      expect(MockCookieService.prototype.put).toHaveBeenCalled();
    });

  });

  describe('getLastError and setLastError methods', () => {

    it('should set the lastError property as an object and get it', () => {
      service.setLastError('error', 'extra');
      const err = service.getLastError();
      expect(err.error).toEqual('error');
      expect(err.extraInfo).toEqual('extra');

      service.clearLastError();
      expect(service.getLastError()).toBeUndefined();
    });
  });
});
