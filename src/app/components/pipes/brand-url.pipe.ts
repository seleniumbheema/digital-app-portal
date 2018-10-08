import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that can be used to transform a URL to be brand specific, can also be used for dependency injection.
 *
 * @export
 * @class BrandUrlPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'esBrandUrl',
})
export class BrandUrlPipe implements PipeTransform {

  private prodBrandUrl: string = ESURE_GLOBALS.BRAND_CONFIG.brandUrl;

  transform(value: string, subDomain?: string, prodOnly?: boolean): string {

    // Only set the subdomain to www. if it's production URL
    let sub = (this.prodBrandUrl === window['esure-env'].BRAND_URL || prodOnly) ? 'www.' : '';

    // If prodOnly is true, then the brand url is always the prod one
    const brandUrl: string = prodOnly ? this.prodBrandUrl : window['esure-env'].BRAND_URL;

    // If a subdomain was passed in, then use that instead of the initial value it was set to
    if (subDomain) {
      sub = `${subDomain}.`;
    }

    // If localhost and not prod only, then return an http localhost url, otherwise https
    const protocol = brandUrl && brandUrl.startsWith('localhost') && !prodOnly ? 'http' : 'https';

    // If localhost and not prod only, then return an http localhost url
    return `${protocol}://${sub}${brandUrl}${value}`;
  }
}
