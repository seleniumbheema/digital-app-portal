import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

import { HttpService } from './http.service';
import { PolicyDataService } from './policy-data.service';
import { HomePolicyDetails } from '../../models/policy/home-details';
import { MotorPolicyDetails } from '../../models/policy/motor-details';

describe('PolicyDataService', () => {
  let service: PolicyDataService;

  let mockHttpServiceUrl: string;
  let mockHttpServiceCallCount = 0;
  let serviceResponse: any;

  const httpResponse = new HttpResponse();

  const mockHomePolicy = {
    accidentalDamage: false,
    address: { houseNumber: 1, street: 'Pall Mall', location: 'London', postcode: 'SW1A 1AA' },
    addOns: [
      { code: 'FLP', price: 2.16, purchased: true },
      { code: 'HEC', price: 18.29, purchased: true },
      { code: 'PES', price: 18.72, purchased: true },
      { code: 'ATV', price: 15.68, purchased: false },
    ],
    buildingSumInsured: 224643,
    contentsSumInsured: 7544,
    coverType: 'Buildings Only',
    documents: [
      { id: 'E18EFFBB2_PD1', type: 'policy_document', date: '2017-05-02' },
    ],
    excessCompulsory: 500,
    excessVoluntary: 250,
    installmentPlan: 1,
    ncdProof: false,
    ncdProtected: false,
    ncdYears: 9,
    personalPossesions: false,
    personalValue: 4331,
    number: 'E18EFFBB2',
    type: 'home',
    startDate: '2017-05-02',
    renewalDate: moment().subtract(20, 'days').format('YYYY-MM-DD'),
  };

  const mockMainDriver = {
    driverType: 'M',
  };

  const mockVehicle = {
    vehicleRegNo: 'PM17GJM',
    vehicleMake: 'BMW',
    vehicleModel: 'X3',
    mileageDescription: '1000 - 2000',
  };

  const mockMotorPolicy = {
    accidentalDamage: false,
    riskAddress: { houseNumber: 1, street: 'Pall Mall', location: 'London', postcode: 'SW1A 1AA' },
    addOns: [
      { code: 'FLP', price: 2.16, purchased: true },
      { code: 'HEC', price: 18.29, purchased: true },
      { code: 'PES', price: 18.72, purchased: true },
      { code: 'ATV', price: 15.68, purchased: false },
    ],
    buildingSumInsured: 224643,
    contentsSumInsured: 7544,
    coverType: 'Buildings Only',
    documents: [
      { id: 'E18EFFBB2_PD1', type: 'policy_document', date: '2017-05-02' },
    ],
    excessCompulsory: 500,
    excessVoluntary: 250,
    installmentPlan: 1,
    ncdProof: false,
    ncdProtected: false,
    ncdYears: 9,
    personalPossesions: false,
    personalValue: 4331,
    number: 'E18EFFBB2',
    type: 'home',
    startDate: '2017-05-02',
    renewalDate: moment().subtract(20, 'days').format('YYYY-MM-DD'),
    drivers: [mockMainDriver],
    mainDriver: mockMainDriver,
    coveredVehicle: mockVehicle,
  };

  class MockHttpService {

    public get(url: string): Observable<any> {
      mockHttpServiceUrl = url;
      mockHttpServiceCallCount += 1;
      if (url === '/policies') return of([mockHomePolicy]);
      if (url.startsWith('/policies/motor')) return of(mockMotorPolicy);
      if (url.startsWith('/policies/home')) return of(mockHomePolicy);
      if (url.startsWith('/documents')) return of([]);
    }

    public getBinary(url: string): Observable<any> {
      mockHttpServiceUrl = url;
      mockHttpServiceCallCount += 1;
      return of(httpResponse);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PolicyDataService,
        { provide: HttpService, useClass: MockHttpService },
      ],
    });

    service = TestBed.get(PolicyDataService);
  });

  afterEach(() => {
    mockHttpServiceUrl = null;
    mockHttpServiceCallCount = 0;
  });

  describe('getPolicy() method', () => {
    it('should pass the policy url to the HttpService for motor policy', (done) => {
      service.getPolicy(123, 1234, 'motor').subscribe((response) => {
        serviceResponse = response;
        done();
      });
      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/policies/motor/123/1234');
      expect(serviceResponse instanceof MotorPolicyDetails).toBeTrue();
    });

    it('should pass the policy url to the HttpService for home policy', (done) => {
      service.getPolicy(123, 1234, 'home').subscribe((response) => {
        serviceResponse = response;
        done();
      });
      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/policies/home/123/1234');
      expect(serviceResponse instanceof HomePolicyDetails).toBeTrue();
    });
  });

  describe('getPolicies() method', () => {
    it('should get all policies', (done) => {
      service.getPolicies().subscribe((response) => {
        serviceResponse = response;
        done();
      });
      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/policies');
      expect(serviceResponse).toBeArrayOfSize(1);
      expect(serviceResponse[0]).toBe(mockHomePolicy);
    });
  });

  describe('getDocuments() method', () => {
    it('should get all documents', (done) => {
      service.getDocuments(123).subscribe((response) => {
        serviceResponse = response;
        done();
      });
      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/documents/123');
      expect(serviceResponse).toBeEmptyArray();
    });
  });

  describe('getDocument() method', () => {
    it('should get a single document', (done) => {
      service.getDocument(1, 123).subscribe((response) => {
        serviceResponse = response;
        done();
      });
      expect(mockHttpServiceCallCount).toBe(1);
      expect(mockHttpServiceUrl).toBe('/document/1/123');
      expect(serviceResponse).toBe(httpResponse);
    });
  });

});
