import { Router } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { RecaptchaModule } from 'ng-recaptcha';

import { TestModule } from '../../../../../test-helpers';
import { AuthService } from '../../../../components/auth/auth.service';
import { AuthTroublePasswordFormComponent } from './auth-trouble-password-form.component';
import { HttpErrorModel } from '../../../../components/services/http.service';

let authServiceCalled: boolean = false;

class MockAuthService {
  resetPassword(email: string): Observable<object> {
    authServiceCalled = true;

    if (email === 'valid@email.com') {
      return of({ status: 'CONFIRMATION_CODE_REQUEST_SENT' });
    }

    if (email === 'validTemp@email.com') {
      return of({ status: 'TEMPORARY_PASSWORD_REQUEST_SENT' });
    }

    if (email === 'validUnexpectedStatus@email.com') {
      return of({ status: 'UGH!' });
    }

    if (email === 'unauthorised@email.com') {
      const error: HttpErrorModel = {
        body: { message: 'UNAUTHORISED_OPERATION_ERROR' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }

    if (email === 'recaptcha@email.com') {
      const error: HttpErrorModel = {
        body: { message: 'RECAPTCHA_ERROR' },
        errMsg: '',
        statusCode: 401,
        statusText: '',
      };
      return throwError(error);
    }

    const error: HttpErrorModel = {
      body: { message: 'ERROR_MESSAGE' },
      errMsg: '',
      statusCode: 401,
      statusText: '',
    };

    return throwError(error);
  }

  getKeyFromToken(key: string): string {
    return key;
  }
}

describe('AuthTroublePasswordFormComponent', () => {
  let component: AuthTroublePasswordFormComponent;
  let fixture: ComponentFixture<AuthTroublePasswordFormComponent>;
  const captchaResponse = '03AJpayVGR9MG4r3IRHy2KwMdxSuBhaQ6C4N2QHMBjvJaAW2J-OgcHh9SpRR-tQTejyntQd8Z6Cs0muy8EcmCh7jIznUuGCIj6cjCEepQZ';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        RecaptchaModule.forRoot(),
      ],
      declarations: [
        AuthTroublePasswordFormComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    fixture = TestBed.createComponent(AuthTroublePasswordFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Reset screeningForm', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be valid if screeningForm inputs are valid', () => {
      component.form.controls.Email.setValue('valid@email.com');

      expect(component.form.valid).toBeTrue();
    });

    it('should be invalid if email input is invalid', () => {
      const invalidEmails: string[] = [
        'Dave',
        'invalid.email.com',
      ];

      invalidEmails.forEach((email) => {
        component.form.controls.Email.setValue(email);
        expect(component.form.valid).toBeFalse();
      });
    });

    it('should display validation error if no email is entered', () => {
      expect(component.form.valid).toBeFalse();
    });
  });

  describe('onPassSubmit() method', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('valid form, current user exists', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('valid@email.com');
        component.onSubmit(captchaResponse);
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
      });

    });

    describe('valid screeningForm, current user exists but still has temp password', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('validTemp@email.com');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onSubmit(captchaResponse);
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
      });

      it('should redirect to login page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/temp');
      });
    });

    describe('valid screeningForm, current user exists with unexpected status returned', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('validUnexpectedStatus@email.com');
        component.onSubmit(captchaResponse);
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
      });

    });

    describe('valid screeningForm, current user exists but is not authorised (disabled account)', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('unauthorised@email.com');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onSubmit(captchaResponse);
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
      });

      it('should redirect to login unavailable page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/unavailable');
      });
    });

    describe('valid form, current user exists but is not authorised (failed recaptcha)', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('recaptcha@email.com');
        spyOn(Router.prototype, 'navigateByUrl');
        component.onSubmit(captchaResponse);
      });

      it('should submit the form', () => {
        expect(authServiceCalled).toBeTrue();
      });

      it('should redirect to login unavailable page', () => {
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('/auth/login/unavailable');
      });
    });

    describe('valid screeningForm, current user doesn\'t exist', () => {

      beforeEach(() => {
        component.form.controls.Email.setValue('invalid@email.com');
        component.onSubmit(captchaResponse);
      });

      it('should submit the screeningForm', () => {
        expect(authServiceCalled).toBeTrue();
      });

    });

    describe('invalid screeningForm', () => {

      beforeEach(() => {
        authServiceCalled = false;
        component.form.controls.Email.setValue('invalid.email.com');
        component.onSubmit(captchaResponse);
      });

      it('should not submit the form', () => {
        expect(authServiceCalled).toBeFalse();
      });

      it('should set submitted to true', () => {
        expect(component.submitted).toBeTrue();
      });
    });
  });
});
