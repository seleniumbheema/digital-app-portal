import { Router, ActivatedRouteSnapshot } from '@angular/router';

import { DisallowedBrandsGuard } from './disallowed-brands-guard';

describe('DisallowedBrandsGuard', () => {

  let disallowedBrandsGuard: DisallowedBrandsGuard;
  let router: any;
  const currentBrandCode = ESURE_GLOBALS.BRAND_CONFIG.brandCode;
  const allBrandCodes = ['ES', 'SW', 'FA'];

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    disallowedBrandsGuard = new DisallowedBrandsGuard(router);
  });

  it(`canActivate should disallow access if brand code is ${currentBrandCode} and disallowed brands array contains ${currentBrandCode}`, () => {
    const mockSnapshot = { data: { disallowedBrands: [currentBrandCode] } as any } as ActivatedRouteSnapshot;
    expect(disallowedBrandsGuard.canActivate(mockSnapshot)).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/error/404');
  });

  it(`canActivate should allow access if brand code is ${currentBrandCode} and disallowed brands array does not contain ${currentBrandCode}`, () => {
    const mockSnapshot = {
      data: {
        disallowedBrands: [allBrandCodes.filter((brand: string) => brand !== currentBrandCode)],
      } as any,
    } as ActivatedRouteSnapshot;
    expect(disallowedBrandsGuard.canActivate(mockSnapshot)).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

});
