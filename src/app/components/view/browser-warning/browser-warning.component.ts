import { Component, OnInit } from '@angular/core';
import * as bowser from 'bowser';

import { CustomerDataService } from '../../services/customer-data.service';

/**
 * List of desktop and mobile browser names, with the minimum version that we support. Any version lower
 * than that specified will show the browser warning.
 */
const minBrowserSupport: { desktop: Map<string, number>, mobile: Map<string, number> } = {
  desktop: new Map<string, number>()
    .set('Chrome', 45)
    .set('Safari', 8)
    .set('Firefox', 45)
    .set('Microsoft Edge', 14)
    .set('Internet Explorer', 10),
  // Removed Opera as we don't test against it
  // .set('Opera', 30),
  mobile: new Map<string, number>()
    .set('Chrome', 47)
    .set('Safari', 8)
    .set('Firefox', 51)
    .set('Samsung Internet for Android', 3),
};

/**
 * Whether to show the warning for any browser names that we have not specified in the minBrowserSupport object.
 */
const showWarningForUnspecifiedBrowsers: boolean = true;

@Component({
  selector: 'es-browser-warning-bar',
  templateUrl: './browser-warning.component.html',
})
export class BrowserWarningComponent implements OnInit {

  /** Whether to show the warning banner. */
  public showWarningBanner: boolean;

  /** Reference to bowser so the template can access bowser. */
  public browserDetect = bowser;

  constructor(public customerDataService: CustomerDataService) { }

  ngOnInit() {
    this.setBannerVisibility();
  }

  /**
   * Sets the browser warning banner visibility.
   */
  private setBannerVisibility(): void {
    const minVersion = this.browserDetect.mobile ? minBrowserSupport.mobile.get(this.browserDetect.name)
      : minBrowserSupport.desktop.get(this.browserDetect.name);
    this.showWarningBanner = minVersion !== undefined ? parseInt(this.browserDetect.version.toString(), 10) < minVersion
      : showWarningForUnspecifiedBrowsers;
  }

}
