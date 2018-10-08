import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { TestModule } from '../../../../../test-helpers';
import { AuthService } from '../../../../components/auth/auth.service';
import { AuthTroublePasswordConfirmationComponent } from './auth-trouble-password-confirmation.component';
import { PasswordResetConfirmationDetails } from '../../../../components/auth/auth.interface';
import { HttpErrorModel } from '../../../../components/services/http.service';

let confirmResetPasswordCalled: boolean;

const routerStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
  routerState: {},
};

class MockAuthService {

  confirmResetPassword(credentials: PasswordResetConfirmationDetails): Observable<object> {
    confirmResetPasswordCalled = true;

    if (credentials.confirmationCode === 123456) {
      return of({ status: 'OK' });
    }

    const error: HttpErrorModel = {
      errMsg: '',
      body: '',
      statusCode: 400,
      statusText: '',
    };

    return throwError(error);
  }

  public getKeyFromToken(key: string): string {
    return key;
  }
}

describe('AuthTroublePasswordConfirmationComponent', () => {
  let component: AuthTroublePasswordConfirmationComponent;
  let fixture: ComponentFixture<AuthTroublePasswordConfirmationComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        AuthTroublePasswordConfirmationComponent,
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    fixture = TestBed.createComponent(AuthTroublePasswordConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Reset Confirmation Form', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    afterEach(() => {
      confirmResetPasswordCalled = false;
    });

    describe('valid screeningForm', () => {

      beforeEach(() => {
        component.form.controls.Password.setValue('validPassword1');
        component.form.controls.ConfirmPassword.setValue('validPassword1');

      });

      it('should be valid if screeningForm inputs are valid', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.onSubmit();
        expect(component.form.valid).toBeTrue();
      });

      it('should call the authService confirmResetPassword method', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.onSubmit();
        expect(confirmResetPasswordCalled).toBeTrue();
      });

      it('should add an error message if error occurs', () => {
        component.form.controls.VerificationCode.setValue(123457);
        component.onSubmit();
        expect(confirmResetPasswordCalled).toBeTrue();
        expect(component.messages).toBeArrayOfSize(1);
      });
    });

    describe('invalid screeningForm', () => {
      it('should be invalid if verification code input is not six numbers', () => {
        const invalidCodes: (string | number)[] = [
          1,
          12,
          123,
          1234,
          12345,
          1234567,
          12345678,
          'abcdef',
          '12345x',
        ];

        component.form.controls.Password.setValue('validPassword1');
        component.form.controls.ConfirmPassword.setValue('validPassword1');

        invalidCodes.forEach((code: string | number) => {
          component.form.controls.VerificationCode.setValue(code);
          expect(component.form.valid).toBeFalse();
        });
      });

      it('should display validation error if no verification code is entered', () => {
        expect(component.form.valid).toBeFalse();
      });

      it('should set submitted to true if screeningForm empty', () => {
        component.onSubmit();
        expect(component.messages).toBeEmptyArray();
        expect(component.submitted).toBeTrue();
      });

      it('should set submitted to true if password is too short', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.form.controls.Password.setValue('Sh0rt');
        component.form.controls.ConfirmPassword.setValue('Sh0rt');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
        expect(component.messages).toBeEmptyArray();
      });

      it('should set submitted to true if has no uppercase chars', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.form.controls.Password.setValue('password1');
        component.form.controls.ConfirmPassword.setValue('password1');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
        expect(component.messages).toBeEmptyArray();
      });

      it('should set submitted to true if has no lowercase chars', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.form.controls.Password.setValue('PASSWORD1');
        component.form.controls.ConfirmPassword.setValue('PASSWORD1');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
        expect(component.messages).toBeEmptyArray();
      });

      it('should set submitted to true if has no numerical chars', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.form.controls.Password.setValue('Passwordx');
        component.form.controls.ConfirmPassword.setValue('Passwordx');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
        expect(component.messages).toBeEmptyArray();
      });

      it('should set submitted to true if has passwords do not match', () => {
        component.form.controls.VerificationCode.setValue(123456);
        component.form.controls.Password.setValue('Password1');
        component.form.controls.ConfirmPassword.setValue('Password2');
        component.onSubmit();

        expect(component.submitted).toBeTrue();
        expect(component.messages).toBeEmptyArray();
      });
    });
  });
});
