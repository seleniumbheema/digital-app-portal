import { Component } from '@angular/core';

@Component({
  selector: 'accident-support',
  templateUrl: './accident-support.component.html',
})
export class AccidentSupportComponent {

  public brandCode: string = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;
  public phoneNumbers: BrandPhoneNumbers = ESURE_GLOBALS.BRAND_CONFIG.phoneNumbers;

}
