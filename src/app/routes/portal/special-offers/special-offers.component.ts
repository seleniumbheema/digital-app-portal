import { Component, OnInit } from '@angular/core';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import { Offer } from '../../../models/offer';

@Component({
  templateUrl: './special-offers.component.html',
})
export class SpecialOffersComponent implements OnInit {

  public offers: Offer[];

  constructor(public customerDataService: CustomerDataService) {
  }

  ngOnInit() {
    this.offers = this.customerDataService.getSpecialOffers();
  }
}
