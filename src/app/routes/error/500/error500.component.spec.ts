import { TestBed } from '@angular/core/testing';
import { of, Observable, throwError } from 'rxjs';

import { Error500Component } from './error500.component';
import { DataLayerComponent } from '../../../components/shared/data-layer.component';
import { BrandUrlPipe } from '../../../components/pipes/brand-url.pipe';
import { CustomerDataService } from '../../../components/services/customer-data.service';
import { HttpErrorModel } from '../../../components/services/http.service';

class MockCustomerDataService {

  private lastError: {
    error: any,
    extraInfo: string;
    browserInfo?: string;
  };

  getLastError() {
    return this.lastError;
  }

  setLastError(error: any) {
    this.lastError = {
      error,
      extraInfo: 'extra',
    };
  }

  logError(): Observable<void> {
    if (this.lastError.error === 'error') {
      return of(undefined);
    }

    const error: HttpErrorModel = {
      errMsg: 'Error',
      body: 'Body',
      statusCode: 400,
      statusText: 'text',
    };
    return throwError(error);

  }

  clearLastError(): void {
    this.lastError = undefined;
  }
}

describe('Error 500 Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DataLayerComponent,
        Error500Component,
        BrandUrlPipe,
      ],
      providers: [
        { provide: CustomerDataService, useClass: MockCustomerDataService },
      ],
    });
  });

  it('should create Error 500 component instance', () => {
    const fixture = TestBed.createComponent(Error500Component);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call logError if an error exists', () => {
    const customerDataService = TestBed.get(CustomerDataService);
    customerDataService.setLastError('error');
    const fixture = TestBed.createComponent(Error500Component);
    fixture.detectChanges();
    expect(customerDataService.getLastError()).toBeUndefined();
  });

  it('should call logError and ignore any error returned by the call', () => {
    const customerDataService = TestBed.get(CustomerDataService);
    customerDataService.setLastError('err');
    const fixture = TestBed.createComponent(Error500Component);
    fixture.detectChanges();
  });

});
