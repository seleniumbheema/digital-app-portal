import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { HttpErrorModel } from '../services/http.service';
import { PolicyDetails } from '../../models/policy/policy-details';
import { PolicyDataService } from '../services/policy-data.service';
import { CustomerDataService } from '../services/customer-data.service';

@Injectable()
export class PolicyResolver implements Resolve<PolicyDetails> {

  constructor(private policyDataService: PolicyDataService, private router: Router, private customerDataService: CustomerDataService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PolicyDetails> {
    console.debug('RESOLVER: PolicyResolver called');

    return this.policyDataService.getPolicy(+route.params.policyNumber, +route.params.sequenceNumber, route.data.policyType).pipe(
      first(),
      catchError((error: HttpErrorModel) => {
        // 403 and 404 we wil show error message on policy view, any other errors redirect to 500 page
        if (error.statusCode !== 403 && error.statusCode !== 404) {
          this.customerDataService.setLastError(error, 'error with policyDataService.getPolicy');
          this.router.navigateByUrl('/error/500');
        }
        return of(undefined);
      }));
  }
}
