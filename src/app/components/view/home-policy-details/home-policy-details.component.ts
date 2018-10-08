import { Component, OnInit, Input } from '@angular/core';

import { HomePolicyDetails } from '../../../models/policy/home-details';

@Component({
  selector: 'es-home-policy-details',
  templateUrl: './home-policy-details.component.html',
})
export class HomePolicyDetailsComponent implements OnInit {

  @Input() policy: HomePolicyDetails;

  public brandCode: string = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  constructor() {
  }

  ngOnInit() {
  }
}
