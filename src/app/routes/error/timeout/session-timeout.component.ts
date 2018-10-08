import { Component } from '@angular/core';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import { Offer } from '../../../models/offer';

@Component({
  templateUrl: './session-timeout.component.html',
})
export class SessionTimeoutComponent {

  public offers: Offer[];

  constructor(public customerDataService: CustomerDataService) {
    this.offers = this.customerDataService.getTimeoutOffers();
  }
}
