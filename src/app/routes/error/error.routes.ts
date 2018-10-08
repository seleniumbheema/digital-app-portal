import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error.component';
import { Error404Component } from './404/error404.component';
import { Error500Component } from './500/error500.component';
import { LogoutUserGuard } from '../../components/auth/guards/logout-user.guard';
import { SessionTimeoutComponent } from './timeout/session-timeout.component';
import { MultipleLoginsComponent } from './multiple-logins/multiple-logins.component';

const ERROR_ROUTES: Routes = [
  {
    path: '', component: ErrorComponent,
    children: [
      { path: '', redirectTo: '404', pathMatch: 'full' },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component, canActivate: [LogoutUserGuard] },
      { path: 'timeout', component: SessionTimeoutComponent, canActivate: [LogoutUserGuard] },
      { path: 'security', component: MultipleLoginsComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ERROR_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
/* istanbul ignore next */
export class ErrorRoutingModule { }

export const routingComponents = [ErrorComponent, Error404Component, Error500Component, SessionTimeoutComponent, MultipleLoginsComponent];
