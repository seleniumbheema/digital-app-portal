import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { HttpErrorModel } from '../services/http.service';
import { CustomerDataService } from '../services/customer-data.service';
import { Customer } from '../../models/customer';

@Injectable()
export class CustomerResolver implements Resolve<Customer> {

  constructor(private customerDataService: CustomerDataService, private router: Router) { }

  resolve(): Observable<Customer> {
    console.debug('RESOLVER: CustomerResolver called');

    return this.customerDataService.setCustomer().pipe(
      first(),
      catchError((error: HttpErrorModel) => {
        if (error.statusCode === 404 || error.statusCode === 403) {
          this.router.navigateByUrl('/error/404');
        } else {
          this.customerDataService.setLastError(error, 'error with customerDataService.setCustomer');
          this.router.navigateByUrl('/error/500');
        }
        return of(undefined);
      }));
  }
}
