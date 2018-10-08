import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import * as AUTH_INTERFACES from '../../../components/auth/auth.interface';
import { AuthService } from '../../../components/auth/auth.service';
import { Message } from '../../../components/view/global-messages/global-messages.component';
import { LoadingHandlerComponent } from '../../../components/shared/loading-handler.component';
import { HttpErrorModel } from '../../../components/services/http.service';

@Component({
  templateUrl: './my-account.component.html',
})
export class MyAccountComponent extends LoadingHandlerComponent implements OnInit {

  public showChangePasswordForm = false;
  public showChangeEmailForm = false;

  public submitted: boolean = false; // true if form has attempted to be sumbitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending form)
  public messages: Message[] = [];

  private changePassFormCredentials: AUTH_INTERFACES.ChangePasswordCredentials;
  private changeEmailFormCredentials: AUTH_INTERFACES.ChangeUserNameDetails;

  changePassForm: FormGroup;
  changeEmailForm: FormGroup;

  oldPasswordControl: FormControl;
  newPasswordControl: FormControl;
  confirmPasswordControl: FormControl;

  newEmailControl: FormControl;
  confirmEmailControl: FormControl;
  verifyPasswordControl: FormControl;

  emailFormErrorMessages: {
    newEmail?: string;
    verifyPassword?: string;
  } = {};

  constructor(
    public customerDataService: CustomerDataService,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) {
    super();

    /*Change Email*/
    this.newEmailControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
      CustomValidators.email,
    ]);

    this.confirmEmailControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
      CustomValidators.email,
      CustomValidators.equalTo(this.newEmailControl),
    ]);

    this.verifyPasswordControl = new FormControl('', [
      Validators.required,
      Validators.required,
      Validators.required,
      CustomValidators.rangeLength([8, 72]),
      Validators.pattern(/.*[A-Z].*/),
      Validators.pattern(/.*[a-z].*/),
      Validators.pattern(/.*[0-9].*/),
    ]);

    /*Change Pass*/
    this.oldPasswordControl = new FormControl('', [
      Validators.required,
      CustomValidators.rangeLength([8, 72]),
    ]);

    this.newPasswordControl = new FormControl('', [
      Validators.required,
      CustomValidators.rangeLength([8, 72]),
      Validators.pattern(/.*[A-Z].*/),
      Validators.pattern(/.*[a-z].*/),
      Validators.pattern(/.*[0-9].*/),
      CustomValidators.notEqualTo(this.oldPasswordControl),
    ]);

    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      CustomValidators.equalTo(this.newPasswordControl),
    ]);
  }

  ngOnInit() {
    this.initEmail();
    this.initPass();
  }

  /* change password methods */
  initPass() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: this.oldPasswordControl,
      newPassword: this.newPasswordControl,
      confirmPassword: this.confirmPasswordControl,
    });
  }

  onPassSubmit() {
    // Clear any messages
    this.messages = [];

    if (this.changePassForm.valid) {
      this.disableSubmit = true;
      this.showLoader();
      this.changePassFormCredentials = {
        oldPassword: this.oldPasswordControl.value,
        newPassword: this.newPasswordControl.value,
      };
      this.customerDataService.changePassword(this.changePassFormCredentials).subscribe(
        () => {
          // this.showChangePasswordForm = false;
          this.authService.logout(false);
          this.router.navigateByUrl('/auth/login/change-password');
          // this.messages.push({ severity: 'success', closable: true, summary: 'Your password has been updated.', heading: '' });
          // this.resetChangePassword();
          // this.hideLoader();
        },
        (error: HttpErrorModel) => {
          console.debug('Error changing password....', error);
          this.disableSubmit = false;
          this.messages.push({ severity: 'danger', closable: false, summary: 'That\'s not working. Please check that you\'ve entered the correct' +
            ' password.', heading: '' });
          this.hideLoader();
        });
    } else {
      this.submitted = true; // shows validation issues
    }
  }

  showChangePassword() {
    this.showChangePasswordForm = true;
    this.messages = [];
    this.backToTop();
  }

  hideChangePassword() {
    this.resetChangePassword();
    this.messages = [];
    this.showChangePasswordForm = false;
    this.backToTop();
  }

  resetChangePassword() {
    this.changePassForm.reset();
    this.submitted = false;
  }

  /* change email methods*/
  initEmail() {
    this.changeEmailForm = this.formBuilder.group({
      newEmail: this.newEmailControl,
      confirmEmail: this.confirmEmailControl,
      verifyPassword: this.verifyPasswordControl,
    });
  }

  onEmailSubmit() {
    // Clear any messages
    this.messages = [];
    this.emailFormErrorMessages = {};

    if (this.changeEmailForm.valid) {
      this.disableSubmit = true;
      this.showLoader();
      this.changeEmailFormCredentials = {
        email: this.newEmailControl.value,
        password: this.verifyPasswordControl.value,
      };
      this.customerDataService.changeEmail(this.changeEmailFormCredentials).subscribe(
        () => {
          this.authService.logout(false);
          this.router.navigateByUrl('/auth/login/change-email');
        },
        (error: HttpErrorModel) => {
          console.debug('Error changing username....', error);

          const status = error.body['message'];

          console.log('status', status);

          if (/.*TAKEN.*/.test(status)) {
            this.emailFormErrorMessages.newEmail = 'This email address is already in use with another account. Please enter an alternative email.';
          }

          if (/.*UNAUTHORIZED.*/.test(status)) {
            this.emailFormErrorMessages.verifyPassword = 'Please check that you\'ve entered the correct password.';
          }

          this.disableSubmit = false;

          this.messages.push({
            severity: 'danger',
            closable: false,
            summary: 'That\'s not working.',
            heading: '',
          });

          this.hideLoader();
        });
    } else {
      this.submitted = true; // shows validation issues
    }
  }

  showChangeEmail() {
    this.showChangeEmailForm = true;
    this.messages = [];
    this.backToTop();
  }

  hideChangeEmail() {
    this.resetChangeEmail();
    this.messages = [];
    this.showChangeEmailForm = false;
    this.backToTop();
  }

  resetChangeEmail() {
    this.changeEmailForm.reset();
    this.emailFormErrorMessages = {};
    this.submitted = false;
  }

  clearChangeEmailNewEmailError() {
    this.emailFormErrorMessages.newEmail = null;
  }

  clearChangeEmailVerifyPasswordError() {
    this.emailFormErrorMessages.verifyPassword = null;
  }

}
