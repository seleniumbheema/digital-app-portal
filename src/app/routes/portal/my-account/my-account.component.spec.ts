import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { TestModule } from '../../../../test-helpers';
import { Customer } from '../../../models/customer';
import { CustomerDataService } from '../../../components/services/customer-data.service';
import { MyAccountComponent } from './my-account.component';
import { AuthService } from '../../../components/auth/auth.service';
import { HttpErrorModel } from '../../../components/services/http.service';
// import { HttpErrorModel } from '../../../components/services/http.service';

const customerObject = {
  firstName: 'Elizabeth',
  lastName: 'Windsor',
};

class MockAuthService {
  // changePassword(credentials): Observable<object> {
  //   changePasswordCalled = true;
  //   if (credentials.oldPassword === 'InvalidPassword') {
  //     const err: HttpErrorModel = {
  //       errMsg: '',
  //       body: '',
  //       statusCode: 404,
  //       statusText: '',
  //     };
  //     return Observable.throw(err);
  //   }
  //   return Observable.of(credentials);
  // }

  logout() {
  }
}

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyAccountComponent,
      ],
      providers: [
        CustomerDataService,
        { provide: AuthService, useClass: MockAuthService },
      ],
      imports: [
        TestModule,
        NoopAnimationsModule,
      ],
    });

    TestBed.get(CustomerDataService).customer = new Customer(customerObject);
    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Change email form', () => {
    describe('when inactive', () => {
      it('should display a button to open form', () => {
        const element = fixture.debugElement.query(By.css('button#changeEmail'));
        expect(element).toBeTruthy();
      });

      it('should display the form on button click', () => {
        spyOn<any>(component, 'backToTop').and.stub();
        const buttonElement = fixture.debugElement.query(By.css('button#changeEmail'));
        buttonElement.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#newEmail'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('#confirmEmail'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('#verifyPassword'))).toBeTruthy();
      });
    });

    describe('when active', () => {
      beforeEach(() => {
        spyOn<any>(component, 'backToTop').and.stub();
        const buttonElement = fixture.debugElement.query(By.css('button#changeEmail'));
        buttonElement.triggerEventHandler('click', {});
        fixture.detectChanges();
      });

      describe('hide form', () => {
        it('should hide the form', () => {
          component.hideChangeEmail();
          fixture.detectChanges();

          const element = fixture.debugElement.query(By.css('button#changeEmail'));
          expect(element).toBeTruthy();
        });

        describe('view password toggle', () => {

          let input;
          let toggle;

          beforeEach(() => {
            input = fixture.debugElement.query(By.css('#verifyPassword'));
            toggle = fixture.debugElement.query(By.css('#verifyPasswordToggle'));
          });

          it('should init the form with password fields', () => {
            expect(input.properties.type).toBe('password');
          });

          it('should toggle button should change the input type', () => {
            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(input.properties.type).toBe('text');

            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(input.properties.type).toBe('password');
          });
        });

        describe('valid form', () => {
          it('should call changeEmail', () => {
            spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(of(true));
            component.changeEmailForm.controls.newEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.confirmEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.verifyPassword.setValue('Password1');
            component.onEmailSubmit();
            expect(CustomerDataService.prototype.changeEmail).toHaveBeenCalled();
          });
        });

        describe('preflight errors', () => {

          describe('invalid Email', () => {
            beforeEach(async(() => {
              spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(of('ERROR'));
              component.changeEmailForm.controls.newEmail.setValue('invalidEmail.com');
              component.changeEmailForm.controls.confirmEmail.setValue('invalidEmail.com');
              component.changeEmailForm.controls.verifyPassword.setValue('Password1');
              component.onEmailSubmit();
            }));

            it('should call not send the form', () => {
              expect(CustomerDataService.prototype.changeEmail).not.toHaveBeenCalled();
            });

            it('should show the error message', () => {
              fixture.detectChanges();

              const element = fixture.debugElement.query(By.css('#newEmail-container .help'));
              expect(element.nativeElement.textContent).toContain('Please enter a valid email address');
            });
          });

          describe('non matching Emails', () => {
            beforeEach(async(() => {
              spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(of('ERROR'));
              component.changeEmailForm.controls.newEmail.setValue('invalid1@Email.com');
              component.changeEmailForm.controls.confirmEmail.setValue('invalid2@Email.com');
              component.changeEmailForm.controls.verifyPassword.setValue('Password1');
              component.onEmailSubmit();
            }));

            it('should call not send the form', () => {
              expect(CustomerDataService.prototype.changeEmail).not.toHaveBeenCalled();
            });

            it('should show the error message', () => {
              fixture.detectChanges();

              const element = fixture.debugElement.query(By.css('#confirmEmail-container .help'));
              expect(element.nativeElement.textContent).toContain('The email addresses do not match');
            });
          });

          describe('invalid password', () => {
            beforeEach(async(() => {
              spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(of('ERROR'));
              component.changeEmailForm.controls.newEmail.setValue('valid@email.com');
              component.changeEmailForm.controls.confirmEmail.setValue('valid@email.com');
              component.changeEmailForm.controls.verifyPassword.setValue('invalid');
              component.onEmailSubmit();
            }));

            it('should call not send the form', () => {
              expect(CustomerDataService.prototype.changeEmail).not.toHaveBeenCalled();
            });

            it('should show the error message', () => {
              fixture.detectChanges();

              const element = fixture.debugElement.query(By.css('#verifyPassword-container .help'));
              expect(element.nativeElement.textContent).toContain('');
            });
          });

        });
      });

      describe('postflight errors', () => {
        describe('with username taken', () => {
          beforeEach(async(() => {
            const err: HttpErrorModel = {
              errMsg: '',
              body: {
                message: 'CUSTOMER_ACCOUNT_TAKEN',
              },
              statusCode: 401,
              statusText: '',
            };

            spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(throwError(err));
            component.changeEmailForm.controls.newEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.confirmEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.verifyPassword.setValue('Password1');
            component.onEmailSubmit();
          }));

          it('should call changeEmail', () => {
            expect(CustomerDataService.prototype.changeEmail).toHaveBeenCalled();
          });

          it('should have non empty messages array', () => {
            expect(component.messages).toBeNonEmptyArray();
          });

          it('show the field error messsage', () => {
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#newEmail-container .help'));
            expect(element.nativeElement.textContent).toContain('This email address is already in use with another account');
          });

          it('should hide the new email help', () => {
            component.clearChangeEmailNewEmailError();
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#newEmail-container .help'));
            expect(element).toBeFalsy();
          });
        });

        describe('with incorrect password', () => {
          beforeEach(async(() => {
            const err: HttpErrorModel = {
              errMsg: '',
              body: {
                message: 'CUSTOMER_ACCOUNT_UNAUTHORIZED',
              },
              statusCode: 401,
              statusText: '',
            };

            spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(throwError(err));
            component.changeEmailForm.controls.newEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.confirmEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.verifyPassword.setValue('Password1');
            component.onEmailSubmit();
          }));

          it('should call changeEmail', () => {
            expect(CustomerDataService.prototype.changeEmail).toHaveBeenCalled();
          });

          it('should have non empty messages array', () => {
            expect(component.messages).toBeNonEmptyArray();
          });

          it('show the field error messsage', () => {
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#verifyPassword-container .help'));
            expect(element.nativeElement.textContent).toContain('Please check that you\'ve entered the correct password');
          });

          it('show clear the field error messsage', () => {
            component.clearChangeEmailVerifyPasswordError();
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#verifyPassword-container .help'));
            expect(element).toBeFalsy();
          });
        });

        describe('with new email taken and incorrect password', () => {
          beforeEach(async(() => {
            const err: HttpErrorModel = {
              errMsg: '',
              body: {
                message: 'CUSTOMER_ACCOUNT_UNAUTHORIZED_AND_TAKEN',
              },
              statusCode: 401,
              statusText: '',
            };

            spyOn(CustomerDataService.prototype, 'changeEmail').and.returnValue(throwError(err));
            component.changeEmailForm.controls.newEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.confirmEmail.setValue('valid@email.com');
            component.changeEmailForm.controls.verifyPassword.setValue('Password1');
            component.onEmailSubmit();
          }));

          it('should call changeEmail', () => {
            expect(CustomerDataService.prototype.changeEmail).toHaveBeenCalled();
          });

          it('should have non empty messages array', () => {
            expect(component.messages).toBeNonEmptyArray();
          });

          it('show the field error messsage', () => {
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#newEmail-container .help'));
            expect(element.nativeElement.textContent).toContain('This email address is already in use with another account');
          });

          it('show clear the field error messsage', () => {
            fixture.detectChanges();

            const element = fixture.debugElement.query(By.css('#verifyPassword-container .help'));
            expect(element.nativeElement.textContent).toContain('Please check that you\'ve entered the correct password');
          });
        });
      });
    });
  });

  describe('Change password form', () => {

    describe('when inactive', () => {
      it('should display a masked string as the password', () => {
        const element = fixture.debugElement.query(By.css('.change-password-section .current-password'));
        expect(element.nativeElement.textContent).toContain('**');
      });

      it('should display a button to open form', () => {
        const element = fixture.debugElement.query(By.css('button#changePass'));
        expect(element).toBeTruthy();
      });

      it('should display the form on button click', () => {
        spyOn<any>(component, 'backToTop').and.stub();
        const buttonElement = fixture.debugElement.query(By.css('button#changePass'));
        buttonElement.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#oldPassword'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('#newPassword'))).toBeTruthy();
      });
    });

    describe('when active', () => {
      beforeEach(() => {
        spyOn<any>(component, 'backToTop').and.stub();
        const buttonElement = fixture.debugElement.query(By.css('button#changePass'));
        buttonElement.triggerEventHandler('click', {});
        fixture.detectChanges();
      });

      describe('hide form', () => {
        it('should hide the form and show masked current password', () => {
          component.hideChangePassword();
          fixture.detectChanges();

          const element = fixture.debugElement.query(By.css('.change-password-section .current-password'));
          expect(element.nativeElement.textContent).toContain('**');
        });
      });

      describe('view password toggle', () => {

        let oldInput;
        let oldToggle;
        let newInput;
        let newToggle;
        let confirmInput;
        let confirmToggle;

        beforeEach(() => {
          oldInput = fixture.debugElement.query(By.css('#oldPassword'));
          oldToggle = fixture.debugElement.query(By.css('#oldPasswordToggle'));

          newInput = fixture.debugElement.query(By.css('#newPassword'));
          newToggle = fixture.debugElement.query(By.css('#newPasswordToggle'));

          confirmInput = fixture.debugElement.query(By.css('#confirmPassword'));
          confirmToggle = fixture.debugElement.query(By.css('#confirmPasswordToggle'));
        });

        it('should init the form with password fields', () => {
          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('password');
        });

        it('should toggle button should change the old input type', () => {
          oldToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('text');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('password');

          oldToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('password');
        });

        it('should toggle button should change the new input type', () => {
          newToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('text');
          expect(confirmInput.properties.type).toBe('password');

          newToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('password');
        });

        it('should toggle button should change the confirm input type', () => {
          confirmToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('text');

          confirmToggle.triggerEventHandler('click', {});
          fixture.detectChanges();

          expect(oldInput.properties.type).toBe('password');
          expect(newInput.properties.type).toBe('password');
          expect(confirmInput.properties.type).toBe('password');
        });
      });

      describe('valid form', () => {
        it('should call changePassword', () => {
          spyOn(CustomerDataService.prototype, 'changePassword').and.returnValue(of(true));
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('Password2');
          component.changePassForm.controls.confirmPassword.setValue('Password2');
          component.onPassSubmit();
          expect(CustomerDataService.prototype.changePassword).toHaveBeenCalled();
        });
      });

      describe('invalid Password', () => {
        beforeEach(async(() => {
          spyOn(CustomerDataService.prototype, 'changePassword').and.returnValue(throwError('ERROR!'));
          component.changePassForm.controls.oldPassword.setValue('InvalidPassword');
          component.changePassForm.controls.newPassword.setValue('Password2');
          component.changePassForm.controls.confirmPassword.setValue('Password2');
          component.onPassSubmit();
        }));

        it('should call changePassword', () => {
          expect(CustomerDataService.prototype.changePassword).toHaveBeenCalled();
        });

        it('should have non empty messages array', () => {
          expect(component.messages).toBeNonEmptyArray();
        });
      });

      describe('invalid form', () => {
        it('should set submitted to true if form empty', () => {
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if old password empty', () => {
          component.changePassForm.controls.oldPassword.setValue('');
          component.changePassForm.controls.newPassword.setValue('Password2');
          component.changePassForm.controls.confirmPassword.setValue('Password2');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if new password empty', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('');
          component.changePassForm.controls.confirmPassword.setValue('Password2');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if confirm password empty', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('Password2');
          component.changePassForm.controls.confirmPassword.setValue('');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if confirm does not match', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('Password2');
          component.changePassForm.controls.confirmPassword.setValue('Password3');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if new password has no number', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('Password');
          component.changePassForm.controls.confirmPassword.setValue('Password');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if new password has no uppercase', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('password2');
          component.changePassForm.controls.confirmPassword.setValue('password2');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if new password has no lowercase', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('PASSWORD2');
          component.changePassForm.controls.confirmPassword.setValue('PASSWORD2');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });

        it('should set submitted to true if new password his too short', () => {
          component.changePassForm.controls.oldPassword.setValue('Password1');
          component.changePassForm.controls.newPassword.setValue('Pass2');
          component.changePassForm.controls.confirmPassword.setValue('Pass2');
          component.onPassSubmit();

          expect(component.submitted).toBeTrue();
          expect(component.messages).toBeEmptyArray();
        });
      });
    });
  });
});
