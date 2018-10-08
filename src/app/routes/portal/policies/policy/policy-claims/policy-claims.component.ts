import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PolicyDetails } from '../../../../../models/policy/policy-details';

@Component({
  templateUrl: './policy-claims.component.html',
})
export class PolicyClaimsComponent implements OnInit {

  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;
  public brandCode: string = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;

  public policy: PolicyDetails;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      this.policy = data.policy;
    });
  }
}
