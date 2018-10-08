import { Component } from '@angular/core';

@Component({
  selector: 'es-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  public brandName: string = ESURE_GLOBALS.BRAND_CONFIG.brandName;
}
