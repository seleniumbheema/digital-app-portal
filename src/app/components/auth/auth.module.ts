import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthService } from './auth.service';
import { SetPasswordGuard } from './guards/set-password.guard';
import { ResetPasswordGuard } from './guards/reset-password.guard';
import { DisallowedBrandsGuard } from './guards/disallowed-brands-guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedInAlreadyGuard } from './guards/logged-in-already.guard';
import { LogoutUserGuard } from './guards/logout-user.guard';
import { TokenResolver } from '../resolvers/token.resolver';
import { RegisterConfirmationGuard } from './guards/register-confirmation.guard';
import { DecodeUsernameResolver } from '../resolvers/decode-username.resolver';

export const JWT_ACCESS_TOKEN_NAME = `${ESURE_GLOBALS.BRAND_CONFIG.brandCode}-AT`;
export const JWT_REFRESH_TOKEN_NAME = `${ESURE_GLOBALS.BRAND_CONFIG.brandCode}-RT`;
export const JWT_STATE_TOKEN_NAME = `${ESURE_GLOBALS.BRAND_CONFIG.brandCode}-ST`;
export const JWT_HEADER_NAME = 'token';
export const JWT_COOKIE_EXPIRY_MINUTES = 15;
export const JWT_MASTER_ID_PROPERTY_NAME = 'mid';
export const JWT_CHALLENGE_KEY_PROPERTY_NAME = 'challengeKey';
export const JWT_EMAIL_KEY_PROPERTY_NAME = 'email';
export const JWT_RECAPTCHA_ENABLED_KEY_PROPERTY_NAME = 'recap';
export const SESSION_TIMEOUT_WARNING_SECONDS = 60;
export const CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME = `${ESURE_GLOBALS.BRAND_CONFIG.brandCode}-customer-status`;

@NgModule({
  declarations: [
  ],
  providers: [
    AuthService,
    SetPasswordGuard,
    ResetPasswordGuard,
    RegisterConfirmationGuard,
    DisallowedBrandsGuard,
    LoggedInGuard,
    LoggedInAlreadyGuard,
    LogoutUserGuard,
    TokenResolver,
    DecodeUsernameResolver,
  ],
  imports: [
  ],
  exports: [
  ],
})
export class AuthComponentModule {

  constructor(
    @Optional() @SkipSelf() parentModule: AuthComponentModule) {
    if (parentModule) {
      throw new Error('AuthComponentModule is already loaded. It is designed to be loaded only once');
    }
  }
}
