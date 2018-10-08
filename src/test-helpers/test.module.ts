// Testing Kitchen sink
import { Component, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleModule } from '@ng-idle/core';
import { CookieModule, CookieService } from 'ngx-cookie';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AuthComponentModule } from '../app/components/auth/auth.module';
import { SharedModule } from '../app/components/shared/shared.module';
import { HttpService } from '../app/components/services/http.service';
import { ScriptLoaderService } from '../app/components/services/script-loader.service';
import { jwtOptionsFactory } from '../app/app.module';
import { BrandUrlPipe } from '../app/components/pipes/brand-url.pipe';

@Component({
  selector: 'es-mock-component',
  template: '',
})
/* istanbul ignore next */
export class MockComponent { }

@NgModule({
  imports: [
    RouterTestingModule.withRoutes([
      { path: 'portal/policies', component: MockComponent },
      { path: 'portal', component: MockComponent },
      { path: 'auth/set-password', component: MockComponent },
      { path: 'auth/register/confirmation/create', component: MockComponent },
      { path: 'auth/trouble/password/reset', component: MockComponent },
    ]),
    CookieModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [CookieService],
      },
    }),
    NgIdleModule.forRoot(),
  ],
  declarations: [
    MockComponent,
  ],
  providers: [
    HttpService,
    ScriptLoaderService,
    BrandUrlPipe,
    {
      provide: 'Window',
      useValue: window,
    },
    // { provide: HttpService, useClass: HttpServiceMock }
  ],
  exports: [
    RouterTestingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthComponentModule,
    CookieModule,
    JwtModule,
    NgIdleModule,
  ],
})
export class TestModule {
}
