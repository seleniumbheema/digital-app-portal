import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';

import { SharedModule } from '../../shared/shared.module';
import { HomePolicyDetailsComponent } from './home-policy-details.component';
import { HomePolicyDetails } from '../../../models/policy/home-details';

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
  number: 'E18EFFBB2',
  type: 'home',
  startDate: coverStartDate.format('YYYY-MM-DD'),
  renewalDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  endDate: moment().add(200, 'days').format('YYYY-MM-DD'),
};

describe('HomePolicyDetailsComponent', () => {
  let component: HomePolicyDetailsComponent;
  let fixture: ComponentFixture<HomePolicyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePolicyDetailsComponent,
      ],
      providers: [
      ],
      imports: [
        SharedModule,
      ],
    });

    fixture = TestBed.createComponent(HomePolicyDetailsComponent);
    component = fixture.componentInstance;
    component.policy = new HomePolicyDetails(mockHomePolicy);
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display policy cover type in the template', () => {
    const element = fixture.debugElement.query(By.css('.policy-cover-type'));
    expect(element.nativeElement.textContent).toBe(mockHomePolicy.coverType);
  });

  it('should display policy start date in the template', () => {
    const formatedDate = moment(mockHomePolicy.startDate).format('ddd D, MMM YYYY');
    const element = fixture.debugElement.query(By.css('.start-date'));
    expect(element.nativeElement.textContent).toBe(formatedDate);
  });

  it('should display policy end date in the template', () => {
    const formatedDate = moment(mockHomePolicy.endDate).format('ddd D, MMM YYYY');
    const element = fixture.debugElement.query(By.css('.end-date'));
    expect(element.nativeElement.textContent).toBe(formatedDate);
  });
});
