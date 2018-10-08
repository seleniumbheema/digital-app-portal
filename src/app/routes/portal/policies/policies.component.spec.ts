import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerDataService } from '../../../components/services/customer-data.service';
import { PolicySummary } from '../../../models/policy/policy-summary';
import { Offer } from '../../../models/offer';
import { PoliciesComponent } from './policies.component';
import { PolicyLapsedPipe } from '../../../components/pipes/policy-lapsed.pipe';
import { SharedModule } from '../../../components/shared/shared.module';
import { AuthService } from '../../../components/auth/auth.service';

const mockCustomerDataService = {

  getDynamicOffers: () => {
    const motorOffer: Offer = {
      class: 'motor',
      heading: 'Car Insurance',
      url: 'https://www.esure.com/new/motor',
      info: 'https://www.esure.com/car-insurance',
      content: 'Lorem ipsum dolor sit amet,dolore ea esse explicabo hic, incidunt labore laudantium magni maiores molestiae quaerat recusandae.',
      enabled: true,
    };

    const travelOffer: Offer = {
      class: 'travel',
      heading: 'Travel Insurance',
      url: 'https://www.esure.com/travel-insurance',
      info: 'https://www.esure.com/travel-insurance',
      content: 'Lorem ipsum dolor sit amet,dolore ea esse explicabo hic, incidunt labore laudantium magni maiores molestiae quaerat recusandae.',
      enabled: true,
    };

    const dynOffers: Offer[] = [];
    dynOffers.push(motorOffer, travelOffer);
    return dynOffers;
  },
};

const mockHomePolicy = {
  accidentalDamage: false,
  riskAddress: { number: 1, street: 'Pall Mall', city: 'London', postcode: 'SW1A 1AA' },
  addons: [
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
  startDate: moment().subtract(165, 'days').format('YYYY-MM-DD'),
  renewalDate: moment().add(200, 'days').format('YYYY-MM-DD'),
};

const mockMotorPolicy = {
  addons: [
    { code: 'CHC', price: 12.88, purchased: true },
    { code: 'LGL', price: 18.52, purchased: true },
    { code: 'KYC', price: 18.17, purchased: true },
    { code: 'BKC', price: 3.99, purchased: false },
    { code: 'PIB', price: 11.07, purchased: false },
    { code: 'MFC', price: 15.02, purchased: false },
  ],
  coverType: 'Third Party',
  documents: [
    { id: 'A7E262118_PD1', type: 'policy_document', date: '2017-02-13' },
  ],
  driveOtherVehicle: true,
  drivers: [
    { firstName: 'Bruce', lastName: 'Wayne' },
  ],
  mainDriver: { firstName: 'Bruce', lastName: 'Wayne' },
  europeanCover: true,
  excessCompulsory: 0,
  excessVoluntary: 1000,
  installmentPlan: 1,
  mileage: 40000,
  ncdProof: false,
  ncdProtected: true,
  ncdYears: 9,
  number: 'A7E262118',
  type: 'motor',
  startDate: moment().subtract(165, 'days').format('YYYY-MM-DD'),
  renewalDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
  useClass: 'Commuting',
  vehicleReg: 'PM17GJM',
  vehicleType: { make: 'BMW', model: 'X3' },
};

const mockActivatedRoute = { data: of({ policies: [] }) };

@Component({
  selector: 'es-portal-policy-card',
  template: '<div>placeholder: es-portal-policy-card</div>',
})
class MockPolicySummaryComponent {
  @Input() policy: PolicySummary;
}

@Component({
  selector: 'es-portal-sidebar',
  template: '<div>placeholder: es-portal-sidebar</div>',
})
class MockPortalSideBarComponent {
  // @Input() crossSellProduct: CrossSellProduct;
}

class MockAuthService {
  public getKeyFromToken(key: string): string {
    return key;
  }
}

describe('PoliciesComponent', () => {
  let component: PoliciesComponent;
  // let policies: PolicySummary[];
  let fixture: ComponentFixture<PoliciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoliciesComponent,
        MockPolicySummaryComponent,
        MockPortalSideBarComponent,
        PolicyLapsedPipe,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CustomerDataService, useValue: mockCustomerDataService },
        { provide: AuthService, useClass: MockAuthService },
      ],
      imports: [
        SharedModule,
      ],
    });
  });

  describe('customer with no policies', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PoliciesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
      expect(component.policies.length).toBe(0);
    });
  });

  describe('customer with only home policy', () => {
    beforeEach(() => {
      const mockHomeActivatedRoute = { data: of({ policies: [new PolicySummary(mockHomePolicy)] }) };
      TestBed.overrideProvider(ActivatedRoute, { useValue: mockHomeActivatedRoute });

      fixture = TestBed.createComponent(PoliciesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
      expect(component.policies.length).toBe(1);
    });
  });

  describe('customer with only motor policy', () => {
    beforeEach(() => {
      const mockMotorActivatedRoute = { data: of({ policies: [new PolicySummary(mockMotorPolicy)] }) };
      TestBed.overrideProvider(ActivatedRoute, { useValue: mockMotorActivatedRoute });

      fixture = TestBed.createComponent(PoliciesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
      expect(component.policies.length).toBe(1);
    });
  });

  describe('customer with both home and motor policies', () => {
    beforeEach(() => {
      const mockMotorHomeActivatedRoute = { data: of({ policies: [new PolicySummary(mockMotorPolicy), new PolicySummary(mockHomePolicy)] }) };
      TestBed.overrideProvider(ActivatedRoute, { useValue: mockMotorHomeActivatedRoute });

      fixture = TestBed.createComponent(PoliciesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
      expect(component.policies.length).toBe(2);
    });
  });
});
