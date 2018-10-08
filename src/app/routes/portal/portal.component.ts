import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CustomerDataService } from '../../components/services/customer-data.service';
import { routerTransition } from '../../components/animations/animations';
import { CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME } from '../../components/auth/auth.module';
import { LoadingHandlerComponent } from '../../components/shared/loading-handler.component';

@Component({
  selector: 'es-portal',
  templateUrl: './portal.component.html',
  animations: [routerTransition],
})

export class PortalComponent extends LoadingHandlerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private storageChangeFunction: EventListenerOrEventListenerObject;

  constructor(
    public customerDataService: CustomerDataService,
    private router: Router,
  ) {
    super();
  }

  /* istanbul ignore next */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME) {
      // Hack to get it to work for IE10, since the storage event fires on the same tab, and even when the value has not changed
      if (!document.hasFocus() && event.oldValue !== event.newValue) {
        // Only redirect if current URL starts with portal, as if it does not, they are not on a logged in page, so we can allow that
        if (this.router.url.startsWith('/portal')) {
          this.router.navigateByUrl('/error/security');
        }
      }
    }
  }

  /* istanbul ignore next */
  ngOnInit() {
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // FIXME: Temporarily commented out until we can work out why it makes the sidebar disappear in IE11 after clicking any link in it!
        // TODO: Cannot work out why I need to setTimeout because the scroll on returning to sign in falls short without it.
        // document.getElementById('scroll-container').scrollTop = 0;
        setTimeout(
          () => {
            this.backToTop();
          },
          350);
      });

    this.storageChangeFunction = (event: StorageEvent) => this.handleStorageChange(event);
    window.addEventListener('storage', this.storageChangeFunction, false);
  }

  public getRouterOutletState(outlet): string {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  /* istanbul ignore next */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('storage', this.storageChangeFunction, false);
  }

}
