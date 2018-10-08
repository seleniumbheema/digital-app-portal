import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { BrandUrlPipe } from '../../../../../components/pipes/brand-url.pipe';
import { PolicyDetails } from '../../../../../models/policy/policy-details';
import { PolicySummary } from '../../../../../models/policy/policy-summary';
import { Message } from '../../../../../components/view/global-messages/global-messages.component';
import { RENEWAL_MESSAGE_CODES } from '../../policies.component';

@Component({
  templateUrl: './policy-details.component.html',
})
export class PolicyDetailsComponent implements OnInit {

  public policy: PolicyDetails;
  public policySummary: PolicySummary;
  public renewalOrMtaMessages: Message[] = [];
  public messages: Message[] = [];

  constructor(public route: ActivatedRoute, private brandUrlPipe: BrandUrlPipe) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      this.policy = data.policy;
      /* istanbul ignore next */
      if (this.policy) {
        const policySummaries: PolicySummary[] = data.policies;
        this.policySummary = policySummaries.find((summary: PolicySummary) => summary.number === this.policy.number);
        this.setMessages();
      }
    });
  }

  /* istanbul ignore next */
  private setMessages() {
    if (!this.policy.lapsed) {
      if (this.policySummary.isMotor && this.policySummary.ncdProof && ESURE_GLOBALS.BRAND_CONFIG.brandCode !== 'FA') {
        const url = this.brandUrlPipe.transform(ESURE_GLOBALS.BRAND_CONFIG.urls.proofOfNoClaims);
        this.messages.push({
          severity: 'warning',
          heading: '',
          summary: `We urgently need your proof of No Claims Discount (NCD) please can you send it to us as soon as possible.
          <a class="upload-ncd" href="${url}" rel="noopener" target="_blank">Upload your NCD proof</a>`,
          closable: false,
        });
      } else if (this.policySummary.renewalNotificationCode) {
        this.renewalOrMtaMessages.push({
          severity: RENEWAL_MESSAGE_CODES.get(this.policySummary.renewalNotificationCode).severity,
          heading: null,
          summary: null,
          closable: RENEWAL_MESSAGE_CODES.get(this.policySummary.renewalNotificationCode).closable,
        });
      } else if (this.policySummary.mtaNotificationCode) {
        this.renewalOrMtaMessages.push({
          severity: 'info',
          heading: '',
          summary: `The change you've made to your policy will come into effect on
          ${moment.utc(this.policySummary.mtaStartDate).format('ddd D, MMM YYYY')}`,
          closable: true,
        });
      }
    }
  }
}
