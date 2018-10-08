import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { of } from 'rxjs';

import { SharedModule } from '../../../../../components/shared/shared.module';
import { PolicyDetails } from '../../../../../models/policy/policy-details';
import { PolicyDetailsComponent } from './policy-details.component';
import { HomePolicyDetails } from '../../../../../models/policy/home-details';
import { MotorPolicyDetailsComponent } from '../../../../../components/view/motor-policy-details/motor-policy-details.component';
import { HomePolicyDetailsComponent } from '../../../../../components/view/home-policy-details/home-policy-details.component';
import { PolicySummary } from '../../../../../models/policy/policy-summary';
import { BrandUrlPipe } from '../../../../../components/pipes/brand-url.pipe';

const coverStartDate: moment.Moment = moment().subtract(165, 'days');

const mockHomePolicy = {
  accidentalDamage: false,
  address: { number: 1, street: 'Pall Mall', city: 'London', postcode: 'SW1A 1AA' },
  addOns: [
    { code: 'FLP', price: 2.16, purchased: true },
    { code: 'HEC', price: 18.29, purchased: true },
    { code: 'PES', price: 18.72, purchased: true },
    { code: 'ATV', price: 15.68, purchased: false },
  ],
  buildingSumInsured: 224643,
  contentsSumInsured: 7544,
  coverType: 'Buildings Only',
  excessCompulsory: 500,
  excessVoluntary: 250,
  installmentPlan: 1,
  ncdProof: false,
  ncdProtected: false,
  ncdYears: 9,
  personalPossesions: false,
  personalValue: 4331,
  number: 1,
  type: 'home',
  startDate: coverStartDate.format('YYYY-MM-DD'),
  renewalDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  endDate: moment().add(200, 'days').format('YYYY-MM-DD'),
};

const mockDocuments = [
  { id: 'A7E262118_PD1', type: 'policy_document', date: '2017-02-13' },
];

let expectedPolicy: PolicyDetails;

const policySummary = new PolicySummary({
  number: mockHomePolicy.number,
  sequenceNumber: 2,
  type: mockHomePolicy.type,
  lapsed: false,
  startDate: mockHomePolicy.startDate,
  renewalDate: mockHomePolicy.renewalDate,
  endDate: mockHomePolicy.endDate,
  renewable: true,
  ncdProof: false,
  installmentPlan: 1,
  isMotor: false,
  isHome: true,
  renewalNotificationCode: 'RENEWAL_AUTO',
  riskAddress: {
    number: 2,
  },
});

// We have to initially provide an activated route to the test bed, it will get overridden by motor or home specific ones later on in the tests
const mockActivatedRoute = {};

describe('PolicyDetailsComponent', () => {
  let component: PolicyDetailsComponent;
  let fixture: ComponentFixture<PolicyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PolicyDetailsComponent,
        MotorPolicyDetailsComponent,
        HomePolicyDetailsComponent,
      ],
      providers: [
        BrandUrlPipe,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [
        SharedModule,
      ],
    });

    expectedPolicy = new HomePolicyDetails(mockHomePolicy);
    const mockHomeActivatedRoute = {
      parent: {
        data: of({ policy: expectedPolicy, documents: mockDocuments, policies: [policySummary] }),
        children: [{
          params: of({ tab: 'details' }),
        }],
        snapshot: {},
      },
    };
    TestBed.overrideProvider(ActivatedRoute, { useValue: mockHomeActivatedRoute });

    fixture = TestBed.createComponent(PolicyDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
