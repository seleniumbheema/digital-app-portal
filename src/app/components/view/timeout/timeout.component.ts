import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import * as moment from 'moment';

import { AuthService } from '../../../components/auth/auth.service';
import { HttpErrorModel } from '../../../components/services/http.service';
import { JWT_COOKIE_EXPIRY_MINUTES, SESSION_TIMEOUT_WARNING_SECONDS } from '../../../components/auth/auth.module';
import { CustomerDataService } from '../../services/customer-data.service';

@Component({
  selector: 'es-timeout',
  templateUrl: './timeout.component.html',
})
export class TimeoutComponent {

  public showTimeoutWarning: boolean = false;
  public countSeconds: number;
  public buttonsClicked: boolean = false;

  constructor(private router: Router, private idle: Idle, private authService: AuthService, private customerDataService: CustomerDataService) {
    this.initSessionTimeoutIdle();
  }

  /* istanbul ignore next */
  public continueSession(): void {
    this.buttonsClicked = true;
    this.idle.stop();
    // Calling this will already stop and stat watching the timer again in the http interceptor
    this.authService.refreshToken()
      .subscribe(
        () => {
          this.showTimeoutWarning = false;
        },
        (error: HttpErrorModel) => {
          if (error.statusCode === 403) {
            return this.router.navigateByUrl('/error/timeout');
          }
          if (error.statusCode === 404) {
            return this.router.navigateByUrl('/error/404');
          }
          this.customerDataService.setLastError(error, 'error with authService.refreshToken');
          return this.router.navigateByUrl('/error/500');
        });
  }

  /* istanbul ignore next */
  public endSession(): void {
    this.buttonsClicked = true;
    this.idle.stop();
    this.showTimeoutWarning = false;
    this.authService.logout(true);
  }

  /* istanbul ignore next */
  private initSessionTimeoutIdle(): void {

    // Initially set to 15 minutes less the timeout seconds
    let idleSeconds = (JWT_COOKIE_EXPIRY_MINUTES * 60) - SESSION_TIMEOUT_WARNING_SECONDS;
    let timeoutSeconds = SESSION_TIMEOUT_WARNING_SECONDS;

    // If there is a token, get the expiry date from it, and adjust the idleSeconds accordingly
    const expiryDate = this.authService.getTokenExpirationDate();
    if (expiryDate !== null) {
      const expiry = moment.utc(expiryDate);
      const now = moment.utc();
      const diffSeconds = expiry.diff(now, 'seconds');
      // Since we are storing in local storage, the expiry could be in the past, so only modify the idle and timeout
      // if the expiry date is in the future
      if (diffSeconds > 0) {
        console.debug('IDLE: Seconds until expiry of JWT is', diffSeconds);
        idleSeconds = diffSeconds > SESSION_TIMEOUT_WARNING_SECONDS ? diffSeconds - SESSION_TIMEOUT_WARNING_SECONDS : 0;
        timeoutSeconds = diffSeconds < SESSION_TIMEOUT_WARNING_SECONDS ? diffSeconds : SESSION_TIMEOUT_WARNING_SECONDS;
      }
    }

    // Take off 2 seconds to avoid the chance that someone hits continue session at exact point token becomes expired
    idleSeconds -= 2;

    // Can't be less than or equal to zero, so set to 1 if it is
    if (idleSeconds <= 0) {
      idleSeconds = 1;
      // If we set idle to 1, then minus one from timeout, only if greater than 1 as can't set timoeout to zero
      if (timeoutSeconds > 1) {
        timeoutSeconds -= 1;
      }
    }

    console.debug('IDLE: Idle seconds is', idleSeconds);
    console.debug('IDLE: Timeout seconds is', timeoutSeconds);
    // This is the amount of time until we show the modal warning them their session will expire soon unless click the button to continue it.
    this.idle.setIdle(idleSeconds);

    // Sets a timeout period of specified seconds. After this amount of time, the user will be considered timed out if they haven't clicked
    // something to say they want to continue being logged in
    this.idle.setTimeout(timeoutSeconds);

    // Sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // Commented out as we don't want any interrupts, we handle this ourselves whenever a new JWT is generated
    // this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      console.debug('IDLE: No longer idle.');
    });

    // On time out, redirect to timeout error page
    this.idle.onTimeout.subscribe(() => {
      console.debug('IDLE: Timed out!');
      this.showTimeoutWarning = false;
      this.router.navigateByUrl('/error/timeout');
    });

    // Show the timeout warning on start of going idle
    this.idle.onIdleStart.subscribe(() => {
      console.debug('IDLE: You have gone idle!');
      // If not logged in, no need to show the modal, can just refresh unauth token in background
      if (this.authService.isValidToken()) {
        if (!this.authService.isUserLoggedIn()) {
          console.debug('IDLE: Not logged in but has a valid unauth token, so refreshing token in background');
          this.continueSession();
        } else {
          console.debug('IDLE: Logged in, so displaying session timeout warning modal');
          this.buttonsClicked = false;
          this.showTimeoutWarning = true;
        }
      } else {
        console.debug('IDLE: Not a valid token, so stopping the idle');
        this.idle.stop();
        if (this.router.url.startsWith('/portal')) {
          console.debug('Redirecting to session timeout as user is on a logged in page with no valid token');
          this.router.navigateByUrl('/error/timeout');
        }
      }
    });

    // Update the count every second, this will be displayed in the modal
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countSeconds = countdown;
    });

    // On interruption of the idle, not currently being used anywhere...
    this.idle.onInterrupt.subscribe(() => console.debug('IDLE: Idle interrupted!'));

    // Start watching the idle
    this.idle.watch();
  }

}
