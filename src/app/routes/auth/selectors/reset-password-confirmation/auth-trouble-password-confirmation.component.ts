import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

import { AuthService } from '../../../../components/auth/auth.service';
import { PasswordResetConfirmationDetails } from '../../../../components/auth/auth.interface';
import { Message } from '../../../../components/view/global-messages/global-messages.component';
import { LoadingHandlerComponent } from '../../../../components/shared/loading-handler.component';
import { HttpErrorModel } from '../../../../components/services/http.service';
import { JWT_EMAIL_KEY_PROPERTY_NAME } from '../../../../components/auth/auth.module';

@Component({
  selector: 'es-auth-reset-password-confirmation',
  templateUrl: './auth-trouble-password-confirmation.component.html',
})
export class AuthTroublePasswordConfirmationComponent extends LoadingHandlerComponent implements OnInit {

  public credentials: PasswordResetConfirmationDetails; // login screeningForm data
  public form: FormGroup; // screeningForm group

  public submitted: boolean = false; // true if screeningForm has attempted to be sumbitted (for validation)
  public disableSubmit: boolean = false; // set to true during login attempt (stops resending screeningForm)
  public messages: Message[] = [];

  public emailFromToken: string;

  private verificationCodeControl: FormControl;
  private passwordControl: FormControl;
  private confirmPasswordControl: FormControl;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) {
    super();
    this.verificationCodeControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/),
    ]);

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
      VerificationCode: this.verificationCodeControl,
      Password: this.passwordControl,
      ConfirmPassword: this.confirmPasswordControl,
    });
    this.emailFromToken = this.authService.getKeyFromToken(JWT_EMAIL_KEY_PROPERTY_NAME);
  }

  onSubmit() {
    // Clear any messages
    this.messages = [];

    if (this.form.valid) {
      this.disableSubmit = true;
      this.showLoader();

      this.credentials = {
        confirmationCode: this.verificationCodeControl.value,
        password: this.passwordControl.value,
      };

      this.authService.confirmResetPassword(this.credentials).subscribe(
        () => {
          return this.router.navigateByUrl('/auth/login/change-password');
        },
        (error: HttpErrorModel) => {
          console.debug('Error with confirm forgot password: ', error);
          this.setFormError();
        });
    } else {
      this.submitted = true; // shows validation issues
    }
  }

  setFormError() {
    this.disableSubmit = false;
    this.messages.push({ severity: 'danger', closable: false, summary: 'The code you entered is incorrect - please try again', heading: '' });
    this.hideLoader();
  }
}
