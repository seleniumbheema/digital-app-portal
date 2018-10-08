import { Component, OnInit } from '@angular/core';

import { CustomerDataService } from '../../services/customer-data.service';

@Component({
  selector: 'es-cookie-bar',
  templateUrl: './cookie-bar.component.html',
})
export class CookieBarComponent implements OnInit {

  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;

  constructor(public customerDataService: CustomerDataService) { }

  ngOnInit() {
  }

}
