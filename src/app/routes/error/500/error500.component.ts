import { Component, OnInit } from '@angular/core';
import * as bowser from 'bowser';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import { HttpErrorModel } from '../../../components/services/http.service';

@Component({
  selector: 'es-error500',
  templateUrl: './error500.component.html',
})
export class Error500Component implements OnInit {

  constructor(private customerDataService: CustomerDataService) {
  }

  ngOnInit() {
    const lastError = this.customerDataService.getLastError();
    if (lastError) {
      lastError.browserInfo = `Name: ${bowser.name} - Version: ${bowser.version}`;
      this.customerDataService.logError().subscribe(
        () => { this.customerDataService.clearLastError(); },
        (error: HttpErrorModel) => { console.error('Error sending error log:', error); });
    }
  }
}
