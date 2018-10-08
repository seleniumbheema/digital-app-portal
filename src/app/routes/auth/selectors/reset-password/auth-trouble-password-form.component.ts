import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { RecaptchaComponent } from 'ng-recaptcha';

import { AuthService } from '../../../../components/auth/auth.service';
import { Message } from '../../../../components/view/global-messages/global-messages.component';
import { LoadingHandlerComponent } from '../../../../components/shared/loading-handler.component';
import { HttpErrorModel } from '../../../../components/services/http.service';
import {
  JWT_EMAIL_KEY_PROPERTY_NAME,
  JWT_RECAPTCHA_ENABLED_KEY_PROPERTY_NAME,
} from '../../../../components/auth/auth.module';

@Component({
  selector: 'es-auth-reset-password',
  templateUrl: './auth-trouble-password-form.component.html',
})
export class AuthTroublePasswordFormComponent extends LoadingHandlerComponent implements OnInit {

  private phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  public submitted: boolean = false; // true if screeningForm has attempted to be sumbitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending screeningForm)
  public messages: Message[] = [];
  public recaptchaEnabled: boolean = false;

  public form: FormGroup;

  private emailControl: FormControl;

  @ViewChild(RecaptchaComponent) recaptchaComponent: RecaptchaComponent;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();

    const recapEnabledString = this.authService.getKeyFromToken(JWT_RECAPTCHA_ENABLED_KEY_PROPERTY_NAME);
    this.recaptchaEnabled = recapEnabledString && recapEnabledString.toLowerCase() === 'true';

    // Try and prepopulate the email address field if we have one in the token
    const emailFromToken = this.authService.getKeyFromToken(JWT_EMAIL_KEY_PROPERTY_NAME);
    this.emailControl = new FormControl(emailFromToken, [
      Validators.required,
      Validators.maxLength(128),
      CustomValidators.email,
    ]);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Email: this.emailControl,
    });

    this.route.data.subscribe((data: any) => {
      /* istanbul ignore next */
      if (data.tokenError) {
        this.messages.push({
          severity: 'danger',
          heading: 'Invalid link',
          summary: 'Unfortunately the link you clicked is no longer valid. Please try again to reset your password',
          closable: false,
        });
      }
    });
  }

  onSubmit(captchaResponse: string): void {
    // Clear any messages
    this.messages = [];

    if (this.form.valid) {
      this.showLoader();
      this.authService
        .resetPassword(this.emailControl.value, captchaResponse).subscribe(
          (data: { status: string }) => {
            if (data.status === 'CONFIRMATION_CODE_REQUEST_SENT') {
              console.debug('CONFIRMATION_CODE_REQUEST_SENT so navigating to reset page....');
              return this.router.navigateByUrl('/auth/trouble/password/reset');
            }
            if (data.status === 'TEMPORARY_PASSWORD_REQUEST_SENT') {
              console.debug('TEMPORARY_PASSWORD_REQUEST_SENT so navigating to login page....');
              return this.router.navigateByUrl('/auth/login/temp');
            }
            console.debug('Status back was: %s - Not expected!', data.status);
            this.hideLoader();
          },
          (error: HttpErrorModel) => {
            if (error.body['message'] === 'UNAUTHORISED_OPERATION_ERROR') {
              console.debug('UNAUTHORISED_OPERATION_ERROR so navigating to login unavailable page....');
              return this.router.navigateByUrl('/auth/login/unavailable');
            }
            if (error.body['message'] === 'RECAPTCHA_ERROR') {
              console.debug('RECAPTCHA_ERROR so navigating to login unavailable page....');
              return this.router.navigateByUrl('/auth/login/unavailable');
            }
            this.setFormError();
          });
    } else {
      this.submitted = true;
    }
  }

  private setFormError() {
    this.messages.push({
      severity: 'danger', closable: false,
      summary: `We don't recognise your details, please try again. If you still can't access &quot;My Account&quot; please call
      <a href="tel:${this.phoneNumbers.motorCustomerService}">${this.phoneNumbers.motorCustomerService}</a>`,
      heading: '',
    });
    this.hideLoader();
    /* istanbul ignore next */
    if (this.recaptchaComponent !== undefined) {
      this.recaptchaComponent.reset();
    }
  }
}
