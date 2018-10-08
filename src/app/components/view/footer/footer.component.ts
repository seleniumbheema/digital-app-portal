import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'es-portal-footer',
  templateUrl: './footer.component.html',
})
export class PortalFooterComponent {

  @Input() login: boolean;

  public year: number;
  public brandCode: string = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  public content: string;

  constructor() {
    this.year = moment().year();
  }
}
