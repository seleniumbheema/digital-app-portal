import { APP_INITIALIZER, LOCALE_ID, NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NgIdleModule } from '@ng-idle/core';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { AppRoutingModule } from './app.routes';
import { AppInitService } from './components/services/app-init.service';
import { AppReadyEventService } from './components/services/app-ready-event.service';
import { HttpService } from './components/services/http.service';
import { CustomerDataService } from './components/services/customer-data.service';
import { PolicyDataService } from './components/services/policy-data.service';
import { ScriptLoaderService } from './components/services/script-loader.service';
import { ErrorHandlerService } from './components/services/error-handler.service';
import { JWT_STATE_TOKEN_NAME } from './components/auth/auth.module';
import { AppComponent } from './app.component';
import { HttpModifyInterceptor } from './components/interceptors/http.interceptor';
import { LoadingBoxComponent } from './components/view/loading-box/loading-box.component';
import { TimeoutComponent } from './components/view/timeout/timeout.component';
import { BrandUrlPipe } from './components/pipes/brand-url.pipe';

/* istanbul ignore next */
export function initApp(appInitService: AppInitService) {
  return () => appInitService.init();
}

/* istanbul ignore next */
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem(JWT_STATE_TOKEN_NAME);
    },
    whitelistedDomains: ['localhost:4000', /escloud\.co\.uk$/, /es-dte\.co\.uk$/,
      /esure\.com$/, /firstalternative\.com$/, /sheilaswheels\.com$/],
    throwNoTokenError: false,
    skipWhenExpired: false,
  };
}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    CookieModule.forRoot(),
    NgIdleModule.forRoot(),
    RecaptchaModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    LoadingBoxComponent,
    TimeoutComponent,
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitService],
      multi: true,
    },
    AppReadyEventService,
    CustomerDataService,
    PolicyDataService,
    ScriptLoaderService,
    BrandUrlPipe,
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpModifyInterceptor,
      multi: true,
    },
    {
      provide: 'Window',
      useValue: window,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-GB',
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: window['esure-env'].RECAPTCHA_SITEKEY,
        size: 'invisible',
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
})
/* istanbul ignore next */
export class AppModule { }
