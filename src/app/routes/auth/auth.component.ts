import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CustomerDataService } from '../../components/services/customer-data.service';
import { LoadingHandlerComponent } from '../../components/shared/loading-handler.component';

@Component({
  selector: 'es-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent extends LoadingHandlerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  login: boolean;

  constructor(public customerDataService: CustomerDataService, public router: Router) {
    super();
    this.login = true;
  }

  ngOnInit() {
    /* istanbul ignore next */
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // TODO: Cannot work out why I need to setTimeout because the scroll on returning to sign in falls short without it.
        setTimeout(
          () => {
            this.scrollToHeader();
          },
          350);
      });
  }

  /* istanbul ignore next */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
