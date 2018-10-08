import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class DisallowedBrandsGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (route.data.disallowedBrands.indexOf(ESURE_GLOBALS.BRAND_CONFIG.brandCode) !== -1) {
      this.router.navigateByUrl('/error/404');
      return false;
    }
    return true;
  }
}
