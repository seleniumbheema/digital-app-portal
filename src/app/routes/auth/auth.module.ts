import { NgModule, NO_ERRORS_SCHEMA, Optional, SkipSelf } from '@angular/core';
import { RecaptchaModule } from 'ng-recaptcha';

import { AuthLoginComponent } from './selectors/login/auth-login.component';
import { AuthSetPasswordComponent } from './selectors/set-password/auth-set-password.component';
import { AuthTroublePasswordFormComponent } from './selectors/reset-password/auth-trouble-password-form.component';
import { AuthTroublePasswordConfirmationComponent } from './selectors/reset-password-confirmation/auth-trouble-password-confirmation.component';
import { AuthRoutingModule, routingComponents } from './auth.routes';
import { SharedModule } from '../../components/shared/shared.module';
import { CookieBarComponent } from '../../components/view/cookie-bar/cookie-bar.component';
import { BrowserWarningComponent } from '../../components/view/browser-warning/browser-warning.component';
import { PostcodeComponent } from '../../components/view/forms/postcode/postcode.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterOnlineComponent } from './selectors/register-online/register-online.component';
import { PolicyNumberFieldComponent } from '../../components/view/forms/policy-number/policy-number.component';
import { ConfirmRegisterComponent } from './pages/register-confirmation/confirm-register.component';

console.debug('ROUTE: AuthRoutesModule loaded asynchronously');

@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthSetPasswordComponent,
    AuthTroublePasswordFormComponent,
    AuthTroublePasswordConfirmationComponent,
    RegisterComponent,
    RegisterOnlineComponent,
    ConfirmRegisterComponent,
    CookieBarComponent,
    BrowserWarningComponent,
    PostcodeComponent,
    PolicyNumberFieldComponent,
    routingComponents,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    AuthRoutingModule,
    SharedModule,
    RecaptchaModule,
  ],
  exports: [
  ],
})
/* istanbul ignore next */
export class AuthRoutesModule {

  constructor(
    @Optional() @SkipSelf() parentModule: AuthRoutesModule) {
    if (parentModule) {
      throw new Error('AuthRoutesModule is already loaded. It is designed to be lazy loaded only once');
    }
  }
}
