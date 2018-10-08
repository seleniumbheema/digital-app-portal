import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { HttpErrorModel } from '../services/http.service';
import { PolicyDataService } from '../services/policy-data.service';
import { Documents } from '../../models/documents-transaction';
import { CustomerDataService } from '../services/customer-data.service';

@Injectable()
export class DocumentsResolver implements Resolve<Documents[] | {}> {

  constructor(private policyDataService: PolicyDataService, private router: Router, private customerDataService: CustomerDataService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Documents[] | {}> {
    console.debug('RESOLVER: DocumentsResolver called');

    return this.policyDataService.getDocuments(+route.params.policyNumber).pipe(
      first(),
      catchError((error: HttpErrorModel) => {
        if (error.statusCode !== 403 && error.statusCode !== 404) {
          this.customerDataService.setLastError(error, 'error with policyDataService.getDocuments');
          this.router.navigateByUrl('/error/500');
        }
        return of([]);
      }));
  }
}
