import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PolicyDetails } from '../../../../models/policy/policy-details';

@Component({
  templateUrl: './policy.component.html',
})
export class PolicyComponent implements OnInit {

  public policy: PolicyDetails;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.policy = data.policy;

    });
  }
}
