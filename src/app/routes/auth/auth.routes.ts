import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthTroublePasswordComponent } from './pages/trouble/password/auth-trouble-password.component';
import { AuthTroublePasswordResetComponent } from './pages/trouble/password/reset/auth-trouble-password-reset.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { SetPasswordComponent } from './pages/set-password/set-password.component';
import { SetPasswordGuard } from '../../components/auth/guards/set-password.guard';
import { LoggedInAlreadyGuard } from '../../components/auth/guards/logged-in-already.guard';
import { SuspendedComponent } from './pages/login/suspended/suspended.component';
import { LoginUnavailableComponent } from './pages/login/login-unavailable/login-unavailable.component';
import { LogoutUserGuard } from '../../components/auth/guards/logout-user.guard';
import { ResetPasswordGuard } from '../../components/auth/guards/reset-password.guard';
import { TokenResolver } from '../../components/resolvers/token.resolver';
import { RegisterComponent } from './pages/register/register.component';
import { ConfirmRegisterComponent } from './pages/register-confirmation/confirm-register.component';
import { RegisterConfirmationGuard } from '../../components/auth/guards/register-confirmation.guard';
import { DecodeUsernameResolver } from '../../components/resolvers/decode-username.resolver';

const AUTH_FORM_ROUTES: Routes = [
  {
    path: '', component: AuthComponent, canActivate: [LoggedInAlreadyGuard], canActivateChild: [LoggedInAlreadyGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        children: [
          { path: '', component: LoginComponent, resolve: { token: TokenResolver } },
          { path: 'registered', component: LoginComponent, data: { hideRegister: true }, resolve: { token: TokenResolver } },
          { path: 'expiry', component: LoginComponent, data: { expiryMessage: true, hideRegister: true }, resolve: { token: TokenResolver } },
          { path: 'temp', component: LoginComponent, data: { tempMessage: true, hideRegister: true }, resolve: { token: TokenResolver } },
          { path: 'change-email', component: LoginComponent, data: { changeEmailMessage: true, hideRegister: true },
            resolve: { token: TokenResolver } },
          { path: 'change-password', component: LoginComponent, data: { changePasswordMessage: true, hideRegister: true },
            resolve: { token: TokenResolver } },
          { path: 'suspended', component: SuspendedComponent },
          { path: 'unavailable', component: LoginUnavailableComponent, canActivate: [LogoutUserGuard] },
        ],
      },
      {
        path: 'logout', component: LogoutComponent, canActivate: [LogoutUserGuard],
      },
      {
        path: 'register', resolve: { token: TokenResolver },
        children: [
          { path: '', component: RegisterComponent },
          {
            path: 'confirmation', canActivate: [RegisterConfirmationGuard],
            children: [
              { path: '', component: ConfirmRegisterComponent, data: { accountExists: true } },
              { path: 'create', component: ConfirmRegisterComponent, data: { accountExists: false } },
            ],
          },
        ],
      },
      {
        path: 'trouble', resolve: { token: TokenResolver },
        children: [
          // { path: '', component: AuthTroubleComponent },
          // { path: 'email', component: AuthTroubleEmailComponent },
          { path: '', redirectTo: 'password', pathMatch: 'full' },
          {
            path: 'password',
            children: [
              { path: '', component: AuthTroublePasswordComponent },
              { path: 'error', component: AuthTroublePasswordComponent, data: { tokenError: true } },
              { path: 'reset', component: AuthTroublePasswordResetComponent, canActivate: [ResetPasswordGuard] },
              {
                path: 'reset/:token', component: AuthTroublePasswordResetComponent,
                resolve: { decodeUsername: DecodeUsernameResolver },
              },
            ],
          },
        ],
      },
      {
        path: 'set-password', component: SetPasswordComponent, canActivate: [SetPasswordGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_FORM_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
/* istanbul ignore next */
export class AuthRoutingModule { }

export const routingComponents = [AuthComponent, AuthTroublePasswordComponent, AuthTroublePasswordResetComponent, LoginComponent,
  LogoutComponent, SetPasswordComponent, SuspendedComponent, LoginUnavailableComponent];
