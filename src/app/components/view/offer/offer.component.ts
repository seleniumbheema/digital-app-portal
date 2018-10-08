import { Component, Input, OnInit } from '@angular/core';

import { Offer } from '../../../models/offer';

interface OfferIcon {
  classes: string[];
  path: string;
}

@Component({
  selector: 'es-special-offer',
  templateUrl: './offer.component.html',
})
export class OfferComponent implements OnInit {

  @Input() offer: Offer;
  @Input() totalOffers: number;

  /**
   * Whether to show the more details links for the offer, optional parameter that defaults to true.
   */
  @Input() showDetailLinks?: boolean = true;

  public icon: OfferIcon;

  ngOnInit() {
    this.setOfferIcon();
  }

  setOfferIcon() {
    switch (this.offer.class) {
      case 'motor':
        this.icon = {
          classes: ['icon', 'icon-car'],
          path: './img/core-icons.svg#icon-car',
        };
        break;
      case 'home-one':
      case 'home':
        this.icon = {
          classes: ['icon', 'icon-buildings'],
          path: './img/core-icons.svg#icon-buildings',
        };
        break;
      case 'multicar-one':
        this.icon = {
          classes: ['icon', 'icon-multicar'],
          path: './img/core-icons.svg#icon-multicar',
        };
        break;
      case 'travel':
        this.icon = {
          classes: ['icon', 'icon-travel'],
          path: './img/core-icons.svg#icon-travel',
        };
        break;
      default:
        break;
    }
  }

}
