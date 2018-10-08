import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { JWT_EMAIL_KEY_PROPERTY_NAME } from '../../../../components/auth/auth.module';
import { AuthService } from '../../../../components/auth/auth.service';

@Component({
  templateUrl: './confirm-register.component.html',
})
export class ConfirmRegisterComponent {

  public emailFromToken: string;
  public pageName: string = 'Portal Confirm Registration';

  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

  /** Whether the account exists or not. */
  public accountExists: boolean = true;

  constructor(
    public customerDataService: CustomerDataService,
    public route: ActivatedRoute,
    public authService: AuthService) {
    this.route.data.subscribe((data: any) => {
      this.accountExists = data.accountExists;
      this.emailFromToken = this.authService.getKeyFromToken(JWT_EMAIL_KEY_PROPERTY_NAME);
    });

    const urlSegmentArray: UrlSegment[] = this.route.snapshot.url;
    /* istanbul ignore next */
    if (urlSegmentArray.length > 0) {
      this.pageName += ` (${urlSegmentArray[0].path})`;
    }
  }

}
