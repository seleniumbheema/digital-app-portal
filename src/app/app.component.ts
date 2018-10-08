import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, Event, NavigationCancel, NavigationError } from '@angular/router';
import { filter, first } from 'rxjs/operators';

import { AppReadyEventService } from './components/services/app-ready-event.service';
import { ScriptLoaderService, ScriptModel } from './components/services/script-loader.service';
import { LoadingHandlerComponent } from './components/shared/loading-handler.component';

const googleRecaptchaApiUrl = '//www.google.com/recaptcha/api.js';

@Component({
  selector: 'es-app',
  templateUrl: './app.component.html',
})
export class AppComponent extends LoadingHandlerComponent implements OnInit {

  /**
   * Constructor, injects in any required dependencies.
   * @param {ScriptLoaderService} scriptLoaderService service for loading scripts
   * @param {AppReadyEventService} appReadyEventService service for triggering the app is ready
   * @param {Window} window window object
   * @param {Router} router router
   */
  constructor(
    public scriptLoaderService: ScriptLoaderService,
    private appReadyEventService: AppReadyEventService,
    @Inject('Window') private window: Window,
    private router: Router,
  ) {
    super();
    /* istanbul ignore next */
    this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd), first()).subscribe(() => {
      console.debug('Navigation end first instance, so triggering app ready event');
      setTimeout(() => this.appReadyEventService.trigger(), 0);
    });

    /* istanbul ignore next */
    this.router.events.subscribe((event: Event) => {
      // Show the loader on navigation start
      if (event instanceof NavigationStart) {
        this.showLoader();
      }

      // Hide the loader on any navigation ending events
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.hideLoader();
      }
    });
  }

  ngOnInit() {
    this.addScriptsToHeadElement();
  }

  private addScriptsToHeadElement(): void {
    this.addScript({ src: this.window['esure-env'].TAG_MANAGER_URL, name: 'TAG_MANAGER', loaded: false, async: true });
    this.addScript({ src: this.window['esure-env'].OPTIMIZELY_URL, name: 'OPTIMIZELY', loaded: false, async: true });
    this.addScript({ src: this.window['esure-env'].LIVECHAT_URL, name: 'LIVECHAT', loaded: false, id: 'getsyn', async: true });
    this.addScript({ src: this.window['esure-env'].IOVATION_URL, name: 'IOVATION', loaded: false, async: true });
    this.addScript({
      src: this.window['esure-env'].RECAPTCHA_SITEKEY ? googleRecaptchaApiUrl : '', name: 'GOOGLE_RECAPTCHA', loaded: false, async: true,
    });
  }

  private addScript(model: ScriptModel): void {
    if (model.src !== '') {
      this.scriptLoaderService.load(model)
        .subscribe(
          (data: any) => {
            console.debug('Completed script load: data is:', data);
          },
          /* istanbul ignore next */
          (error: any) => {
            console.error('Error loading script:', error);
          },
        );
    }
  }
}
