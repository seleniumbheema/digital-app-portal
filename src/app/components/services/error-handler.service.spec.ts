import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { CustomerDataService } from './customer-data.service';

class MockCustomerDataService {
  setLastError() {
  }
}

describe('ErrorHandlerService', () => {

  const mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  let errorHandlerService: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: CustomerDataService, useClass: MockCustomerDataService,
        },
        {
          provide: Router, useValue: mockRouter,
        },
      ],
    });
    errorHandlerService = TestBed.get(ErrorHandlerService);
  });

  it('should navigate to 500 error page on an error', () => {
    errorHandlerService.handleError('error');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/error/500');
  });

});
