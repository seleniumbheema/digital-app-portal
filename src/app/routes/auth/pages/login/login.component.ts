import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { Offer } from '../../../../models/offer';
import { CustomerDataService } from '../../../../components/services/customer-data.service';

@Component({
  selector: 'es-portal-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  public offers: Offer[];
  public pageName: string = 'Portal Sign In';

  /** Whether the register panel is shown or not. */
  public hideRegister: boolean = false;

  constructor(public customerDataService: CustomerDataService, public route: ActivatedRoute) {
    this.offers = this.customerDataService.getLoginOffers();
    this.route.data.subscribe((data: any) => {
      this.hideRegister = data.hideRegister;
    });

    const urlSegmentArray: UrlSegment[] = this.route.snapshot.url;
    /* istanbul ignore next */
    if (urlSegmentArray.length > 0) {
      this.pageName += ` (${urlSegmentArray[0].path})`;
    }
  }
}
