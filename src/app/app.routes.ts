import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthComponentModule } from './components/auth/auth.module';
import { LoggedInGuard } from './components/auth/guards/logged-in.guard';
import { LoggedInAlreadyGuard } from './components/auth/guards/logged-in-already.guard';

/* istanbul ignore next */
const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth', loadChildren: './routes/auth/auth.module#AuthRoutesModule',
    canLoad: [LoggedInAlreadyGuard],
  },
  { path: 'error', loadChildren: './routes/error/error.module#ErrorModule' },
  { path: 'info', loadChildren: './routes/info/info.module#InfoModule' },
  {
    path: 'portal', loadChildren: './routes/portal/portal.module#PortalModule',
    canLoad: [LoggedInGuard],
  },
  { path: '**', redirectTo: '/error/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
    AuthComponentModule,
  ],
  providers: [
  ],
  exports: [
    RouterModule,
    AuthComponentModule,
  ],
})
/* istanbul ignore next */
export class AppRoutingModule { }
