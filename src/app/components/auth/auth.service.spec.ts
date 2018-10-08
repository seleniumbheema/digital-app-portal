import { NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Idle, SimpleExpiry } from '@ng-idle/core';
import * as moment from 'moment';

import { CustomerDataService } from '../services/customer-data.service';
import { AuthService } from './auth.service';
import { JWT_MASTER_ID_PROPERTY_NAME, JWT_STATE_TOKEN_NAME, JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME } from './auth.module';
import { BrandUrlPipe } from '../pipes/brand-url.pipe';

describe('AuthService', () => {

  let authService: AuthService;
  let cookieService: CookieService;
  let jwtHelperService: JwtHelperService;
  let router: any;
  let customerDataService: CustomerDataService;
  let idle: Idle;
  const brandUrlPipe = new BrandUrlPipe();

  beforeEach(() => {
    idle = new Idle(new SimpleExpiry(), new NgZone({}));
    jwtHelperService = new JwtHelperService({
      tokenGetter: () => localStorage.getItem(JWT_STATE_TOKEN_NAME),
    });
    cookieService = {
      get: (key: string) => { return key; },
      remove: (key: string) => { return {}[key]; },
      put: (key: string, value: string) => { key; value; return; },
    } as CookieService;
    router = {
      navigateByUrl: (): void => {
        return;
      },
    };
    customerDataService = new CustomerDataService(null, cookieService, brandUrlPipe);
    authService = new AuthService(null, jwtHelperService, router, customerDataService, idle);
  });

  describe('isUserLoggedIn', () => {
    it('should return false if JWT does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(undefined);
      expect(authService.isUserLoggedIn()).toBeFalse();
    });

    it('should return false if JWT exists but is expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(true);
      expect(authService.isUserLoggedIn()).toBeFalse();
    });

    it('should return false if JWT exists and is not expired, and does not contain mid property', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);
      spyOn(jwtHelperService, 'decodeToken').and.returnValue({ mi6: 666 });
      expect(authService.isUserLoggedIn()).toBeFalse();
    });

    it('should return true if JWT exists and is not expired, and contains mid property', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);
      spyOn(jwtHelperService, 'decodeToken').and.returnValue({ [JWT_MASTER_ID_PROPERTY_NAME]: 666 });
      expect(authService.isUserLoggedIn()).toBeTrue();
    });

    it('should redirect to 500 page if unable to get token expiration date', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(router, 'navigateByUrl');
      expect(authService.isUserLoggedIn()).toBeFalse();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/error/500');
    });
  });

  describe('logout', () => {
    it('should logout the user', () => {
      authService.logout(false);
      expect(customerDataService.customer).toBeNull();
    });
  });

  describe('get and set JwtToken', () => {
    it('should set the JWT', () => {
      spyOn(localStorage, 'setItem').and.stub();
      spyOn(localStorage, 'getItem').and.returnValue('token');
      const expiryDate = moment().add(15, 'm').toDate();

      spyOn(jwtHelperService, 'getTokenExpirationDate').and.returnValue(expiryDate);
      authService.setJwtToken('token');
      expect(localStorage.setItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME, 'token');
      expect(jwtHelperService.getTokenExpirationDate).toHaveBeenCalled();
    });

    it('should get the JWT', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');
      expect(authService.getJwtToken()).toEqual('token');
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('get and set access token', () => {
    it('should set the access token', () => {
      spyOn(localStorage, 'setItem').and.stub();
      authService.setAccessToken('token');
      expect(localStorage.setItem).toHaveBeenCalledWith(JWT_ACCESS_TOKEN_NAME, 'token');
    });

    it('should get the access token', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');
      expect(authService.getAccessToken()).toEqual('token');
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('get and set refresh token', () => {
    it('should set the refresh token', () => {
      spyOn(localStorage, 'setItem').and.stub();
      authService.setRefreshToken('token');
      expect(localStorage.setItem).toHaveBeenCalledWith(JWT_REFRESH_TOKEN_NAME, 'token');
    });

    it('should get the refresh token', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');
      expect(authService.getRefreshToken()).toEqual('token');
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('decodeToken', () => {
    it('should decode the token', () => {
      const decoded = { email: 'email' };
      spyOn(jwtHelperService, 'decodeToken').and.returnValue(decoded);
      expect(authService.decodeToken()).toBe(decoded);
    });
  });

  describe('getTokenExpirationDate', () => {
    it('should return null for token expiration date if no token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(authService.getTokenExpirationDate()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
    });

    it('should return a date for getTokenExpirationDate if token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      const date = new Date();
      spyOn(jwtHelperService, 'getTokenExpirationDate').and.returnValue(date);
      expect(authService.getTokenExpirationDate()).toBe(date);
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
      expect(jwtHelperService.getTokenExpirationDate).toHaveBeenCalledWith('TOKEN');
    });

    it('should redirect to 500 page if error caught getting date', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'getTokenExpirationDate').and.throwError('error');
      spyOn(router, 'navigateByUrl');
      expect(authService.getTokenExpirationDate()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
      expect(jwtHelperService.getTokenExpirationDate).toHaveBeenCalledWith('TOKEN');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/error/500');
    });
  });

  describe('getKeyFromToken', () => {
    it('should get the key value if key exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);
      const decoded = { email: 'a@a.com' };
      spyOn(jwtHelperService, 'decodeToken').and.returnValue(decoded);
      expect(authService.getKeyFromToken('email')).toEqual('a@a.com');
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
      expect(jwtHelperService.isTokenExpired).toHaveBeenCalled();
      expect(jwtHelperService.decodeToken).toHaveBeenCalled();
    });

    it('should return undefined if key does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(false);
      const decoded = { email: 'a@a.com' };
      spyOn(jwtHelperService, 'decodeToken').and.returnValue(decoded);
      expect(authService.getKeyFromToken('key')).toBeUndefined();
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
      expect(jwtHelperService.isTokenExpired).toHaveBeenCalled();
      expect(jwtHelperService.decodeToken).toHaveBeenCalled();
    });

    it('should return undefined if token is not valid', () => {
      spyOn(localStorage, 'getItem').and.returnValue('TOKEN');
      spyOn(jwtHelperService, 'isTokenExpired').and.returnValue(true);
      expect(authService.getKeyFromToken('key')).toBeUndefined();
      expect(localStorage.getItem).toHaveBeenCalledWith(JWT_STATE_TOKEN_NAME);
      expect(jwtHelperService.isTokenExpired).toHaveBeenCalled();
    });
  });

});
