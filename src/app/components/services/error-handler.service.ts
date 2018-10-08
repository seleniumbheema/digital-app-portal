import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerDataService } from './customer-data.service';

/**
 * Custom error handler, the default Angular one just console logs an error, this does the same but also will redirect to the 500 error page.
 */
@Injectable()
export class ErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector, private zone: NgZone) {
  }

  get router(): Router {
    return this.injector.get(Router);
  }

  get customerDataService(): CustomerDataService {
    return this.injector.get(CustomerDataService);
  }

  handleError(error: any): void {
    console.error(error);
    this.customerDataService.setLastError(error, 'runtime error, handled by custom ErrorHandlerService');
    // As we are outside of Angular zone at this point, need to run the router navigate inside ngzone
    this.zone.run(() => this.router.navigateByUrl('/error/500'));
  }
}
