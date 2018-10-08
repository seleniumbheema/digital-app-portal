import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, throwError } from 'rxjs';

import { TestModule } from '../../../../../test-helpers';
import { AuthService } from '../../../../components/auth/auth.service';
import { AuthSetPasswordComponent } from './auth-set-password.component';
import { HttpErrorModel } from '../../../../components/services/http.service';
import * as AUTH_INTERFACES from '../../../../components/auth/auth.interface';

describe('AuthSetPassword Component', () => {

  let component: AuthSetPasswordComponent;
  let fixture: ComponentFixture<AuthSetPasswordComponent>;
  const routerStub = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    routerState: {},
  };

  class MockCookieService {
    public get() { }
    public put() { }
  }

  let setNewAccountPasswordCalled: boolean;

  class MockAuthService {

    public confirmChallenge(credentials: AUTH_INTERFACES.NewPasswordCredentials): Observable<object> {

      setNewAccountPasswordCalled = true;

      if (credentials.newPassword === 'Password1') {
        return of({});
      }

      if (credentials.newPassword === 'Password4') {
        const error: HttpErrorModel = {
          body: { message: 'CUSTOMER_BARRED' },
          errMsg: '',
          statusCode: 403,
          statusText: '',
        };
        return throwError(error);
      }

      if (credentials.newPassword === 'Password3') {
        const error: HttpErrorModel = {
          body: { message: 'NOT_FOUND' },
          errMsg: '',
          statusCode: 404,
          statusText: '',
        };
        return throwError(error);
      }

      if (credentials.newPassword === 'Password6') {
        const error: HttpErrorModel = {
          body: { message: 'CUSTOMER_DEVICE' },
          errMsg: '',
          statusCode: 401,
          statusText: '',
        };
        return throwError(error);
      }

      const error: HttpErrorModel = {
        body: { message: 'NOT_AUTHORIZED' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }

    public decodeToken(): any {
      return {
        email: '',
      };
    }

    public setAccessToken(): void {
    }

    public setRefreshToken(): void {
    }
  }

  class MockJwtHelperService {
  }

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        AuthSetPasswordComponent,
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: CookieService, useValue: MockCookieService },
        { provide: JwtHelperService, useClass: MockJwtHelperService },
      ],
    });

    fixture = TestBed.createComponent(AuthSetPasswordComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    setNewAccountPasswordCalled = false;
  });

  it('should create Auth Register component instance', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Set Password Form', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('valid screeningForm', () => {
      describe('valid user', () => {
        it('should call setNewPassword', () => {
          component.form.controls.Password.setValue('Password1');
          component.form.controls.ConfirmPassword.setValue('Password1');
          component.onSubmit();

          expect(setNewAccountPasswordCalled).toBeTrue();
        });
      });

      describe('invalid user not authorized', () => {
        beforeEach(async(() => {
          component.form.controls.Password.setValue('Password2');
          component.form.controls.ConfirmPassword.setValue('Password2');
          component.onSubmit();
        }));

        it('should call setNewPassword', () => {
          expect(setNewAccountPasswordCalled).toBeTrue();
        });
      });

      describe('invalid user barred', () => {
        beforeEach(async(() => {
          component.form.controls.Password.setValue('Password4');
          component.form.controls.ConfirmPassword.setValue('Password4');
          component.onSubmit();
        }));

        it('should call setNewPassword', () => {
          expect(setNewAccountPasswordCalled).toBeTrue();
        });
      });

      describe('invalid user fraud check fail', () => {
        beforeEach(async(() => {
          component.form.controls.Password.setValue('Password6');
          component.form.controls.ConfirmPassword.setValue('Password6');
          component.onSubmit();
        }));

        it('should call setNewPassword', () => {
          expect(setNewAccountPasswordCalled).toBeTrue();
        });
      });

      describe('invalid user generic error', () => {
        beforeEach(async(() => {
          component.form.controls.Password.setValue('Password3');
          component.form.controls.ConfirmPassword.setValue('Password3');
          component.onSubmit();
        }));

        it('should call setNewPassword', () => {
          expect(setNewAccountPasswordCalled).toBeTrue();
          expect(component.disableSubmit).toBeFalse();
          expect(component.messages).toBeNonEmptyArray();
        });
      });
    });

    describe('invalid screeningForm', () => {
      it('should set submitted to true if screeningForm empty', () => {
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if password is too short', () => {
        component.form.controls.Password.setValue('Sh0rt');
        component.form.controls.ConfirmPassword.setValue('Sh0rt');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if has no uppercase chars', () => {
        component.form.controls.Password.setValue('password1');
        component.form.controls.ConfirmPassword.setValue('password1');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if has no lowercase chars', () => {
        component.form.controls.Password.setValue('PASSWORD1');
        component.form.controls.ConfirmPassword.setValue('PASSWORD1');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if has no numerical chars', () => {
        component.form.controls.Password.setValue('Passwordx');
        component.form.controls.ConfirmPassword.setValue('Passwordx');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if has passwords do not match', () => {
        component.form.controls.Password.setValue('Password1');
        component.form.controls.ConfirmPassword.setValue('Password2');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
      });
    });
  });
});
