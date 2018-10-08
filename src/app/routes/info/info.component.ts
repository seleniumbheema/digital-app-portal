import { Component } from '@angular/core';

@Component({
  selector: 'es-info',
  templateUrl: './info.component.html',
})
export class InfoComponent {
  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;
}
