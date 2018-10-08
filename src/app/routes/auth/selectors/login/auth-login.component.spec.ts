import { Router } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { TestModule } from '../../../../../test-helpers';
import { LoginCredentials } from '../../../../components/auth/auth.interface';
import { AuthService } from '../../../../components/auth/auth.service';
import { AuthLoginComponent } from './auth-login.component';
import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { HttpErrorModel } from '../../../../components/services/http.service';

let authServiceCalled: boolean;
let authServiceResultedInSuccesfullLogin: boolean;
let authServiceResultedInPasswordReset: boolean;
let authServiceIsUserLoggedIn: boolean;
let tokenHasChallengeKey: boolean = false;

class MockAuthService {
  public authenticate(credentials: LoginCredentials): Observable<object> {
    authServiceCalled = true;

    if (credentials.email === 'valid@email.com') {
      authServiceResultedInSuccesfullLogin = true;
      return of({ accessToken: '1', refreshToken: '2' });
    }
    if (credentials.email === 'newpass@email.com') {
      tokenHasChallengeKey = true;
      authServiceResultedInPasswordReset = true;
      return of({ newPass: true });
    }
    if (credentials.email === 'locked@email.com') {
      authServiceResultedInSuccesfullLogin = false;
      const error: HttpErrorModel = {
        body: { message: 'USER_LOCKED' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }
    if (credentials.email === 'barred@email.com') {
      authServiceResultedInSuccesfullLogin = false;
      const error: HttpErrorModel = {
        body: { message: 'CUSTOMER_BARRED' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }
    if (credentials.email === 'disabled@email.com') {
      authServiceResultedInSuccesfullLogin = false;
      const error: HttpErrorModel = {
        body: { message: 'CUSTOMER_DISABLED' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }
    if (credentials.email === 'fraud@email.com') {
      authServiceResultedInSuccesfullLogin = false;
      const error: HttpErrorModel = {
        body: { message: 'CUSTOMER_DEVICE' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }

    authServiceResultedInSuccesfullLogin = false;
    const error: HttpErrorModel = {
      body: { message: 'NOT_AUTHORIZED' },
      errMsg: '',
      statusCode: 401,
      statusText: '',
    };
    return throwError(error);
  }

  public isUserLoggedIn(): boolean {
    return authServiceIsUserLoggedIn;
  }

  public tokenHasKey(): boolean {
    return tokenHasChallengeKey;
  }

  public getKeyFromToken(key: string): string {
    return key;
  }

  public logout(): void {
    if (authServiceIsUserLoggedIn) authServiceIsUserLoggedIn = !authServiceIsUserLoggedIn;
  }

  public setAccessToken(): void {
  }

  public setRefreshToken(): void {
  }
}

describe('AuthLoginComponent', () => {
  let component: AuthLoginComponent;
  let fixture: ComponentFixture<AuthLoginComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        AuthLoginComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        CustomerDataService,
      ],
    });

    fixture = TestBed.createComponent(AuthLoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Login screeningForm', () => {
    beforeEach(async () => {
      fixture.detectChanges();
    });

    it('should be valid if screeningForm inputs are valid', () => {
      component.form.controls.Username.setValue('valid@email.com');
      component.form.controls.Password.setValue('UPPERlower1234');

      expect(component.form.valid).toBeTrue();
    });

    it('should be invalid if email input is invalid', () => {
      const invalidEmails: string[] = [
        'Dave',
        'invalid.email.com',
      ];

      invalidEmails.forEach((email) => {
        component.form.controls.Username.setValue(email);
        component.form.controls.Password.setValue('UPPERlower1234');

        expect(component.form.valid).toBeFalse();
      });
    });

    it('should display validation error if no password is entered', () => {
      component.form.controls.Username.setValue('valid@email.com');
      expect(component.form.valid).toBeFalse();
    });
  });

  describe('onLogin() method', () => {

    beforeEach(async () => {
      fixture.detectChanges();
      component.disableSubmit = false;
    });

    afterEach(() => {
      authServiceCalled = false;
      authServiceResultedInSuccesfullLogin = null;
      authServiceResultedInPasswordReset = null;
      component.disableSubmit = false;
    });

    describe('valid screeningForm, current user exists', () => {

      beforeEach(() => {
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = true;
        component.form.controls.Username.setValue('valid@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        component.onLogin();
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInSuccesfullLogin).toBeTrue();
      });

      it('should disable the submit button', () => {
        expect(component.disableSubmit).toBeTrue();
      });
    });

    describe('valid screeningForm, current user requires password change', () => {

      beforeEach(() => {
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('newpass@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        component.onLogin();
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeTrue();
      });

      it('should disable the submit button', () => {
        expect(component.disableSubmit).toBeTrue();
      });
    });

    describe('valid screeningForm, current user doesn\'t exist', () => {

      beforeEach(() => {
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('nonuser@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        component.onLogin();
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeFalsy();
        expect(authServiceResultedInSuccesfullLogin).toBeFalsy();
      });

      it('should disable the submit button', () => {
        expect(component.disableSubmit).toBeFalse();
      });
    });

    describe('valid screeningForm, current user locked', () => {

      beforeEach(() => {
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('locked@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onLogin();
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeFalsy();
        expect(authServiceResultedInSuccesfullLogin).toBeFalsy();
      });

      it('should redirect to login suspended page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/suspended');
      });
    });

    describe('valid screeningForm, current user barred', () => {

      beforeEach(() => {
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('barred@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onLogin();
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeFalsy();
        expect(authServiceResultedInSuccesfullLogin).toBeFalsy();
      });

      it('should redirect to login unavailable page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/unavailable');
      });
    });

    describe('valid screeningForm, current user disabled', () => {

      beforeEach(() => {
        window['ioGetBlackbox'] = () => {
          return {
            finished: true,
            blackbox: 'abcd',
          };
        };
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('disabled@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onLogin();
      });

      afterAll(() => {
        delete window['ioGetBlackbox'];
      });

      it('should submit the form', () => {
        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeFalsy();
        expect(authServiceResultedInSuccesfullLogin).toBeFalsy();
        expect(component.credentials.blackbox).toEqual('abcd');
      });

      it('should redirect to login unavailable page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/unavailable');
      });
    });

    describe('valid form, current user failed device fraud check', () => {

      beforeEach(() => {
        window['ioGetBlackbox'] = () => {
          return {
            finished: false,
            blackbox: null,
          };
        };
        tokenHasChallengeKey = false;
        authServiceIsUserLoggedIn = false;
        component.form.controls.Username.setValue('fraud@email.com');
        component.form.controls.Password.setValue('UPPERlower1234');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onLogin();
      });

      afterAll(() => {
        delete window['ioGetBlackbox'];
      });

      it('should submit the form', () => {

        expect(authServiceCalled).toBeTrue();
        expect(authServiceResultedInPasswordReset).toBeFalsy();
        expect(authServiceResultedInSuccesfullLogin).toBeFalsy();
        expect(component.credentials.blackbox).toBeUndefined();
      });

      it('should redirect to login unavailable page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/unavailable');
      });
    });

    describe('invalid screeningForm', () => {

      beforeEach(() => {
        authServiceCalled = false;
        component.form.controls.Username.setValue('invalid.email.com');
        component.form.controls.Password.setValue('lower1234');
        component.onLogin();
      });

      it('should not submit the screeningForm', () => {
        expect(authServiceCalled).toBeFalse();
      });

      it('should not disable the submit button', () => {
        expect(component.disableSubmit).toBeFalse();
      });

      it('should set submitted to true', () => {
        expect(component.submitted).toBeTrue();
      });
    });
  });
});
