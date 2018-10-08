import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { HttpService } from './http.service';
import { VehicleDataService } from './vehicle-data.service';

const mockRespone = {
  make: 'FORD',
  model: 'FIESTA XYZ',
  fuel: 'D',
  transmission: 'A',
  registrationDate: '2010-10-10T10:10:00Z',
};

describe('VehicleDataService', () => {
  let service: VehicleDataService;

  let mockHttpServiceUrl: string;
  let mockHttpServiceCallCount = 0;
  let serviceResponse: any;

  class MockHttpService {

    public get(url: string): Observable<any> {
      mockHttpServiceUrl = url;
      mockHttpServiceCallCount += 1;
      if (url === '/vehicles/AB12DEF') return of({ vehicle: mockRespone });
      if (url === '/vehicles/XX99XXX') return of({ vehicle: null });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VehicleDataService,
        { provide: HttpService, useClass: MockHttpService },
      ],
    });

    service = TestBed.get(VehicleDataService);
  });

  afterEach(() => {
    mockHttpServiceUrl = null;
    mockHttpServiceCallCount = 0;
  });

  describe('getVehicleWithReg() method', () => {
    it('should pass the policy url to the HttpService for motor policy', (done) => {
      service.getVehicleWithReg('AB12DEF').subscribe((response) => {
        serviceResponse = response;
        done();
      });

      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/vehicles/AB12DEF');
      expect(serviceResponse.vehicle).toBe(mockRespone);
    });

    it('should pass the policy url to the HttpService for motor policy', (done) => {
      service.getVehicleWithReg('XX99XXX').subscribe((response) => {
        serviceResponse = response;
        done();
      });

      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/vehicles/XX99XXX');
      expect(serviceResponse.vehicle).toBe(null);
    });
  });
});
