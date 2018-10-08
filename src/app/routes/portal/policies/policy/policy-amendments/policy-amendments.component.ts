import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PolicyDetails } from '../../../../../models/policy/policy-details';

@Component({
  templateUrl: './policy-amendments.component.html',
})
export class PolicyAmendmentsComponent implements OnInit {

  public policy: PolicyDetails;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public customerUrl: string = window['esure-env'].CUSTOMER_URL;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe((data: any) => {
      this.policy = data.policy;
    });
  }
}
