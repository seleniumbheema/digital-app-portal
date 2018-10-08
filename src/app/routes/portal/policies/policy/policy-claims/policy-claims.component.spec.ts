import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as moment from 'moment';

import { PolicyClaimsComponent } from './policy-claims.component';
import { HomePolicyDetails } from '../../../../../models/policy/home-details';
import { TestModule } from '../../../../../../test-helpers';

const mockHomePolicy = {
  accidentalDamage: false,
  address: { number: 1, street: 'Pall Mall', city: 'London', postcode: 'SW1A 1AA' },
  addOns: [
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

const expectedPolicy = new HomePolicyDetails(mockHomePolicy);

const mockActivatedRoute = {
  parent: {
    data: of({ policy: expectedPolicy }),
    snapshot: {},
  },
};

describe('PolicyClaimsComponent', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        PolicyClaimsComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
  });

  it('should create the Policy Claims component instance', () => {
    const fixture = TestBed.createComponent(PolicyClaimsComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
