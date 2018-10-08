import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService, CookieOptionsProvider } from 'ngx-cookie';
import { of, throwError } from 'rxjs';

import { MtaService } from './mta.service';
import { CustomerDataService } from './customer-data.service';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';
import { HttpService } from './http.service';
import { MotorPolicyDetails } from '../../models/policy/motor-details';
import { Customer } from '../../models/customer';
import { AuthService } from '../auth/auth.service';

describe('MtaService', () => {

  const httpClient = new HttpClient(null);
  const httpService = new HttpService(httpClient);
  const cookieServie: CookieService = new CookieService(new CookieOptionsProvider({}, Injector.create([])));
  const customerDataService: CustomerDataService = new CustomerDataService(null, cookieServie, new BrandUrlPipe());
  customerDataService.customer = new Customer({ address: {} });
  const authService = new AuthService(httpService, null, null, customerDataService, null);
  const mtaService: MtaService = new MtaService(httpService, customerDataService, authService);

  const motorPolicy: MotorPolicyDetails = {
    drivers: [],
    mainDriver: null,
    vehicle: null,
    europeanCover: null,
    number: 1,
    type: 'motor',
    lapsed: false,
    startDate: '',
    renewalDate: '',
    endDate: '',
    ncdProof: false,
    installmentPlan: 1,
    holder: null,
    isMotor: true,
    isHome: false,
    addOns: null,
    cost: 0,
    mtaAvailable: false,
  };

  it('should construct the service', () => {
    expect(mtaService).toBeTruthy();
  });

  it('should post car change with purchased Y', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const post = mtaService.postCarChange(motorPolicy, {
      purchased: 'Y', purchaseDate: { Day: '01', Month: '01', Year: '2018' }, valuation: 1,
    });
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post car change with purchased N', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const post = mtaService.postCarChange(motorPolicy, {
      purchased: 'N', valuation: 1,
    });
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post conviction change', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const post = mtaService.postConvictionChange(motorPolicy, {});
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post registration change', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const post = mtaService.postRegistrationChanges(motorPolicy, {});
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post add driver change with cover type permanent', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const driverForm = {
      dateOfBirth: {
        Day: '',
        Month: '',
        Year: '',
      },
    };
    const screenForm = {
      typeOfCover: 'P',
    };
    const post = mtaService.postAddDriverChange(motorPolicy, driverForm, screenForm);
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
        expect(screenForm).not.toHaveMember('dateFrom');
        expect(screenForm).not.toHaveMember('dateUntil');
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post add driver change with cover type temporary', () => {
    spyOn(httpClient, 'post').and.returnValue(of());
    const driverForm = {
      dateOfBirth: {
        Day: '',
        Month: '',
        Year: '',
      },
    };
    const screenForm = {
      typeOfCover: 'T',
      dateFrom: {
        Day: '01',
        Month: '01',
        Year: '2019',
      },
      dateUntil: {
        Day: '03',
        Month: '01',
        Year: '2019',
      },
    };
    const post = mtaService.postAddDriverChange(motorPolicy, driverForm, screenForm);
    post.subscribe(
      (data: void) => {
        expect(data).toBeUndefined();
        expect(screenForm.dateFrom as any).toEqual('01/01/2018');
        expect(screenForm.dateUntil as any).toEqual('01/01/2018');
        expect(screenForm).not.toHaveMember('twoDriversAlready');
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should refresh the token', () => {
    spyOn(authService, 'refreshToken').and.returnValue(of(undefined));
    mtaService.refreshToken();
    expect(authService.refreshToken).toHaveBeenCalled();
  });

  it('should not error if refresh token call fails', () => {
    spyOn(authService, 'refreshToken').and.returnValue(throwError('Error'));
    mtaService.refreshToken();
    expect(authService.refreshToken).toHaveBeenCalled();
  });

});
