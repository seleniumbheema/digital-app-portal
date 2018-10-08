import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../global-messages/global-messages.component';
import { BrandUrlPipe } from '../../pipes/brand-url.pipe';
import { PolicySummary } from '../../../models/policy/policy-summary';
import { RENEWAL_MESSAGE_CODES } from '../../../routes/portal/policies/policies.component';

@Component({
  selector: 'es-portal-policy-card',
  templateUrl: './policy-card.component.html',
})
export class PolicyCardComponent implements OnInit {
  @Input() policy: PolicySummary;

  public icon: any = {};
  public identifier: any = {};
  public messages: Message[] = [];
  public renewalOrMtaMessages: Message[] = [];
  public notifications = [];

  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  constructor(private brandUrlPipe: BrandUrlPipe) { }

  ngOnInit() {
    this.setIcon();
    this.setIdentifier();
    this.setMessages();
  }

  private setIcon(): void {
    const iconName = (this.policy.isMotor)
      ? 'icon-car'
      : 'icon-buildings';

    this.icon.classes = ['icon', iconName];
    this.icon.path = `./img/core-icons.svg#${iconName}`;
  }

  private setIdentifier(): void {
    if (this.policy.isMotor) {
      this.identifier = {
        label: 'Vehicle Make & Model',
        shortLabel: 'Registration number',
        short: this.policy.vehicle.reg,
        full: `${this.policy.vehicle.make} ${this.policy.vehicle.model}`,
      };
    } else {
      this.identifier = {
        label: 'Insured Address',
        shortLabel: 'Postcode',
        short: this.policy.riskAddress.postcode,
        full: `${this.policy.riskAddress.number} ${this.policy.riskAddress.street}, ${this.policy.riskAddress.city}`,
      };
    }
  }

  private setMessages() {
    if (!this.policy.lapsed) {
      if (this.isAddNcdMessage()) {
        const url = this.brandUrlPipe.transform(ESURE_GLOBALS.BRAND_CONFIG.urls.proofOfNoClaims);
        this.messages.push({
          severity: 'warning',
          heading: '',
          summary: `We urgently need your proof of No Claim Discount (NCD) please can you send it to us as soon as possible.
          <a class="upload-ncd" href="${url}" rel="noopener" target="_blank">Upload your NCD proof</a>`,
          closable: false,
        });
      } else if (this.policy.renewalNotificationCode) {
        this.renewalOrMtaMessages.push({
          severity: RENEWAL_MESSAGE_CODES.get(this.policy.renewalNotificationCode).severity,
          heading: null,
          summary: null,
          closable: RENEWAL_MESSAGE_CODES.get(this.policy.renewalNotificationCode).closable,
        });
      } else if (this.policy.mtaNotificationCode) {
        this.renewalOrMtaMessages.push({
          severity: 'info',
          heading: null,
          summary: null,
          closable: true,
        });
      }
    }
  }

  private isAddNcdMessage(): boolean {
    return this.policy.isMotor && this.policy.ncdProof && ESURE_GLOBALS.BRAND_CONFIG.brandCode !== 'FA';
  }
}
