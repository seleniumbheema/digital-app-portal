import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, first, catchError } from 'rxjs/operators';

import { HttpErrorModel } from '../services/http.service';
import { PolicySummary } from '../../models/policy/policy-summary';
import { PolicyDataService } from '../services/policy-data.service';
import { CustomerDataService } from '../services/customer-data.service';

@Injectable()
export class PoliciesResolver implements Resolve<PolicySummary[]> {

  constructor(private policyDataService: PolicyDataService, private router: Router, private customerDataService: CustomerDataService) { }

  resolve(): Observable<PolicySummary[]> {
    console.debug('RESOLVER: PoliciesResolver called');
    return this.policyDataService.getPolicies().pipe(
      map((userPolicies: any) => {
        const policies: PolicySummary[] = [];
        for (const policy of userPolicies) {
          const policySummary = new PolicySummary(policy);
          policies.push(policySummary);
        }
        return policies;
      }),
      first(),
      catchError((error: HttpErrorModel) => {
        console.warn(error);
        this.customerDataService.setLastError(error, 'error with policyDataService.getPolicies');
        this.router.navigateByUrl('/error/500');
        return of([]);
      }));
  }
}
