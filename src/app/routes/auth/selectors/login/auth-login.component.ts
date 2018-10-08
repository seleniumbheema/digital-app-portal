import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginCredentials, AuthTokens } from '../../../../components/auth/auth.interface';
import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { AuthService } from '../../../../components/auth/auth.service';
import { JWT_CHALLENGE_KEY_PROPERTY_NAME, JWT_EMAIL_KEY_PROPERTY_NAME } from '../../../../components/auth/auth.module';
import { Message } from '../../../../components/view/global-messages/global-messages.component';
import { HttpErrorModel } from '../../../../components/services/http.service';
import { DeviceRecognitionComponent } from '../../../../components/shared/device-recognition.component';

@Component({
  selector: 'es-auth-login',
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent extends DeviceRecognitionComponent implements OnInit {
  public credentials: LoginCredentials; // login form data
  public form: FormGroup; // form group

  public submitted: boolean = false; // true if screeningForm has attempted to be sumbitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending screeningForm)
  public messages: Message[] = [];
  public authMessages: Message[] = [];

  public ncdAvailable: boolean = ESURE_GLOBALS.BRAND_CONFIG.brandCode !== 'FA';

  @Input()
  public hideRegister: boolean = false;

  /* istanbul ignore next */
  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public customerDataService: CustomerDataService) {
    super();
  }

  ngOnInit() {
    // Try and prepopulate the email address field if we have one in the token
    const emailFromToken = this.authService.getKeyFromToken(JWT_EMAIL_KEY_PROPERTY_NAME);
    this.form = this.formBuilder.group({
      Username: [emailFromToken, [
        Validators.required,
        Validators.maxLength(128),
        CustomValidators.email,
      ]],
      Password: ['', [
        Validators.required,
        CustomValidators.rangeLength([8, 72]),
      ]],
    });

    this.route.data.subscribe((data: any) => {
      /* istanbul ignore next */
      if (data.expiryMessage) {
        this.messages.push({
          severity: 'warning',
          heading: 'There was a problem',
          summary: 'For security reasons your password was not changed. Please login again using your temporary password',
          closable: false,
        });
      } else if (data.tempMessage) {
        this.messages.push({
          severity: 'info',
          heading: 'Check your email',
          summary: 'We have sent you an email with instructions to reset your password',
          closable: true,
        });
      } else if (data.changeEmailMessage) {
        this.messages.push({
          severity: 'success',
          heading: 'Email address successfully changed',
          summary: 'Please sign in using your new email',
          closable: true,
        });
      } else if (data.changePasswordMessage) {
        this.messages.push({
          severity: 'success',
          heading: 'Password changed successfully',
          summary: 'Please sign in using your new password',
          closable: true,
        });
      }
    });
  }

  onLogin() {
    // Clear any messages
    this.authMessages = [];

    if (this.form.valid) {
      // Get blackbox if available
      const blackbox = this.getBlackBox();
      this.disableSubmit = true;
      this.showLoader();
      this.credentials = { blackbox, email: this.form.controls.Username.value, password: this.form.controls.Password.value };
      this.authService
        .authenticate(this.credentials).subscribe(
          (data: AuthTokens) => {
            const hasChallengeKey = this.authService.tokenHasKey(JWT_CHALLENGE_KEY_PROPERTY_NAME);
            if (!hasChallengeKey) {
              this.authService.setAccessToken(data.accessToken);
              this.authService.setRefreshToken(data.refreshToken);
            }
            this.customerDataService.updateCookieBar();
            /* istanbul ignore next */
            const navigateTo = hasChallengeKey ? '/auth/set-password' : '/portal';
            this.router.navigateByUrl(navigateTo);
          },
          (error: HttpErrorModel) => {
            if (error.body['message'] === 'USER_LOCKED') {
              console.debug('USER IS LOCKED so navigating to suspended page....');
              return this.router.navigateByUrl('/auth/login/suspended');
            }
            if (error.body['message'] === 'CUSTOMER_BARRED') {
              console.debug('USER IS BARRED so navigating to login unavailable page....');
              return this.router.navigateByUrl('/auth/login/unavailable');
            }
            if (error.body['message'] === 'CUSTOMER_DISABLED') {
              console.debug('USER IS DISABLED so navigating to login unavailable page....');
              return this.router.navigateByUrl('/auth/login/unavailable');
            }
            if (error.body['message'] === 'CUSTOMER_DEVICE') {
              console.debug('USER FAILED DEVICE CHECK so navigating to login unavailable page....');
              return this.router.navigateByUrl('/auth/login/unavailable');
            }
            this.setFormError();
          });
    } else {
      this.submitted = true; // shows validation issues
    }
  }

  setFormError() {
    this.authMessages.push({
      severity: 'danger',
      closable: false,
      summary: null,
      heading: '',
    });
    this.disableSubmit = false;
    this.hideLoader();
  }
}
