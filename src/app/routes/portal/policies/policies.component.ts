import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import { PolicySummary } from '../../../models/policy/policy-summary';
import { Message } from '../../../components/view/global-messages/global-messages.component';
import { Offer } from '../../../models/offer';
import { AuthService } from '../../../components/auth/auth.service';

interface MessageState {
  severity: Message['severity'];
  closable: boolean;
}

export const RENEWAL_MESSAGE_CODES = new Map<string, MessageState>()
  .set('RENEWAL_AUTO', { severity: 'success', closable: true })
  .set('RENEWAL_NOT_DONE', { severity: 'warning', closable: false })
  .set('RENEWAL_DONE', { severity: 'success', closable: true })
  .set('RENEWAL_DECLINED', { severity: 'warning', closable: false });

@Component({
  templateUrl: './policies.component.html',
})
export class PoliciesComponent implements OnInit {

  public offers: Offer[];
  public policies: PolicySummary[];
  public messages: Message[] = [];
  public welcome: boolean;
  public policiesList: string = '';
  public customerNumber: number;

  constructor(public route: ActivatedRoute, public customerDataService: CustomerDataService, public authService: AuthService) {
    this.offers = this.customerDataService.getDynamicOffers();
    this.customerNumber = this.authService.getKeyFromToken('mid');
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.policies = data.policies;
      /* istanbul ignore next */
      if (data.welcome) {
        this.messages.push({
          severity: 'success',
          heading: 'Good news, you\'re all set up.',
          summary: 'Welcome to My Account.',
          closable: true,
        });
        this.welcome = data.welcome;
      }
    });

    const policiesListArray: string[] = [];

    this.policies.forEach((item: PolicySummary) => {
      policiesListArray.push(`${item.number.toString()},${item.type},${item.startDate},${item.renewalDate}`);
    });
    this.policiesList = policiesListArray.join('|');
  }
}
