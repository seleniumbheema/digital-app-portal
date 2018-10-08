import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'esBrandImage',
})
export class BrandImagePipe implements PipeTransform {
  transform(value: string): string {
    return `./${ESURE_GLOBALS.BRAND}${value}`;
  }
}
