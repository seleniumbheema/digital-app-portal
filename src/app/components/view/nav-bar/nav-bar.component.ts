import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CustomerDataService } from '../../services/customer-data.service';
import { AuthService } from '../../auth/auth.service';
import { fadeIn, fadeInStagger } from '../../animations/animations';

@Component({
  selector: 'es-nav-bar',
  templateUrl: './nav-bar.component.html',
  animations: [fadeInStagger, fadeIn],
})
export class NavBarComponent implements OnInit, OnDestroy {

  public brandCode: string = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;

  private resizeSubscription: Subscription;

  constructor(
    public customerDataService: CustomerDataService,
    public authService: AuthService,
    @Inject('Window') public window: Window,
  ) {
    this.customerDataService.initSidebar(this.window.innerWidth);
  }

  /* istanbul ignore next */
  ngOnInit() {
    this.resizeSubscription = fromEvent(window, 'resize').pipe(
      debounceTime(100))
      .subscribe((event: Event) => {
        this.customerDataService.initSidebar(event.target['innerWidth']);
      });
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }
}
