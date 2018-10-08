import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  templateUrl: './auth-trouble-password.component.html',
})
export class AuthTroublePasswordComponent {

  public pageName: string = 'Portal Forgot Password';

  constructor(public route: ActivatedRoute) {
    const urlSegmentArray: UrlSegment[] = this.route.snapshot.url;
    /* istanbul ignore next */
    if (urlSegmentArray.length > 0) {
      this.pageName += ` (${urlSegmentArray[0].path})`;
    }
  }
}
