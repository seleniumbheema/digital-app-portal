import { Component, Input } from '@angular/core';

import { CustomerDataService } from '../../services/customer-data.service';
import { fadeIn } from '../../animations/animations';

@Component({
  selector: 'es-portal-header',
  templateUrl: './header.component.html',
  animations: [fadeIn],
})
export class PortalHeaderComponent {

  private hours: number = new Date().getHours();

  public greeting: string = (this.hours < 12) ? 'morning' : (this.hours < 18) ? 'afternoon' : 'evening';

  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;

  public notify = true;

  @Input() login: boolean;

  constructor(
    public customerDataService: CustomerDataService,
  ) { }

  closeNavBarIfMobileView(windowWidth: number) {
    if (windowWidth < this.customerDataService.sideBar.autoCollapseWidth) {
      this.customerDataService.sideBar.opened = false;
    }
  }

}
