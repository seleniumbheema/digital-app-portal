import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

import { AuthService } from '../../../../components/auth/auth.service';
import { NewPasswordCredentials, AuthTokens } from '../../../../components/auth/auth.interface';
import { Message } from '../../../../components/view/global-messages/global-messages.component';
import { HttpErrorModel } from '../../../../components/services/http.service';
import { DeviceRecognitionComponent } from '../../../../components/shared/device-recognition.component';

@Component({
  selector: 'es-auth-set-password',
  templateUrl: './auth-set-password.component.html',
})
export class AuthSetPasswordComponent extends DeviceRecognitionComponent implements OnInit {

  public emailAddress: string;
  public credentials: NewPasswordCredentials; // login screeningForm data
  public form: FormGroup; // screeningForm group

  public submitted: boolean = false; // true if screeningForm has attempted to be sumbitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending screeningForm)
  public messages: Message[] = [];

  private passwordControl: FormControl;
  private confirmPasswordControl: FormControl;

  /* istanbul ignore next */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    super();
    this.passwordControl = new FormControl('', [
      Validators.required,
      CustomValidators.rangeLength([8, 72]),
      Validators.pattern(/.*[A-Z].*/),
      Validators.pattern(/.*[a-z].*/),
      Validators.pattern(/.*[0-9].*/),
    ]);

    this.confirmPasswordControl = new FormControl('', [
      Validators.required,
      CustomValidators.equalTo(this.passwordControl),
    ]);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Password: this.passwordControl,
      ConfirmPassword: this.confirmPasswordControl,
    });
    this.emailAddress = this.authService.decodeToken().email;
  }

  onSubmit() {
    // Clear any messages
    this.messages = [];
    if (this.form.valid) {
      // Get blackbox if available
      const blackbox = this.getBlackBox();
      this.disableSubmit = true;
      this.showLoader();
      this.credentials = {
        blackbox,
        newPassword: this.passwordControl.value,
      };

      this.authService.confirmChallenge(this.credentials).subscribe(
        (data: AuthTokens) => {
          this.authService.setAccessToken(data.accessToken);
          this.authService.setRefreshToken(data.refreshToken);
          this.router.navigateByUrl('/portal/policies/welcome');
        },
        (error: HttpErrorModel) => {
          const errorMessage = 'Failed to set password, please try again.';
          if (error.body['message'] === 'NOT_AUTHORIZED') {
            console.debug('NOT_AUTHORIZED, assume session token expired so redirecting to login page');
            return this.router.navigateByUrl('/auth/login/expiry');
          }
          if (error.body['message'] === 'CUSTOMER_BARRED') {
            console.debug('USER IS BARRED so navigating to barred page....');
            return this.router.navigateByUrl('/auth/login/unavailable');
          }
          if (error.body['message'] === 'CUSTOMER_DEVICE') {
            console.debug('USER FAILED DEVICE CHECK so navigating to login unavailable page....');
            return this.router.navigateByUrl('/auth/login/unavailable');
          }
          this.disableSubmit = false;
          this.messages.push({ severity: 'danger', closable: false, summary: errorMessage, heading: '' });
          this.hideLoader();
        });
    } else {
      this.submitted = true; // shows validation issues
    }
  }

}
