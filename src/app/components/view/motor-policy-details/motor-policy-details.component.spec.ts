import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';

import { SharedModule } from '../../shared/shared.module';
import { MotorPolicyDetails } from '../../../models/policy/motor-details';
import { MotorPolicyDetailsComponent } from './motor-policy-details.component';
import { BrandUrlPipe } from '../../pipes/brand-url.pipe';

const coverStartDate: moment.Moment = moment().subtract(165, 'days');

const mockVehicle = {
  vehicleRegNo: 'PM17GJM',
  vehicleMake: 'BMW',
  vehicleModel: 'X3',
  mileageDescription: '1000 - 2000',
  dateOfRegistration: coverStartDate.subtract(12, 'years').format('YYYY-MM-DD'),
};

const mockMainDriver = {
  firstName: 'Bruce',
  lastName: 'Wayne',
  driverType: 'M',
  coverTypeDescription: 'Third Party',
};

const mockMotorPolicy = {
  addOns: [
    { code: 'CHC', price: 12.88, purchased: true },
    { code: 'LGL', price: 18.52, purchased: true },
    { code: 'KYC', price: 18.17, purchased: true },
    { code: 'BKC', price: 3.99, purchased: false },
    { code: 'PIB', price: 11.07, purchased: false },
    { code: 'MFS', price: 15.02, purchased: false },
  ],
  driveOtherVehicle: true,
  drivers: [mockMainDriver],
  mainDriver: mockMainDriver,
  europeanCover: true,
  excessCompulsory: 0,
  excessVoluntary: 1000,
  installmentPlan: 1,
  mileage: 40000,
  ncdProof: true,
  ncdProtected: true,
  ncdYears: 9,
  number: 'A7E262118',
  type: 'motor',
  startDate: coverStartDate.format('YYYY-MM-DD'),
  renewalDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  endDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  useClass: 'Commuting',
  vehicleReg: 'PM17GJM',
  vehicleType: { make: 'BMW', model: 'X3' },
  coveredVehicle: mockVehicle,
};

describe('MotorPolicyDetailsComponent', () => {
  let component: MotorPolicyDetailsComponent;
  let fixture: ComponentFixture<MotorPolicyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MotorPolicyDetailsComponent,
      ],
      providers: [
        BrandUrlPipe,
      ],
      imports: [
        SharedModule,
      ],
    });

    fixture = TestBed.createComponent(MotorPolicyDetailsComponent);
    component = fixture.componentInstance;
    component.policy = new MotorPolicyDetails(mockMotorPolicy);

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display policy cover type in the template', () => {
    component.policy.ncdProof = false; // In here to get the coverage up
    component.ngOnInit();
    const element = fixture.debugElement.query(By.css('.policy-cover-type'));
    expect(element.nativeElement.textContent).toBe(mockMainDriver.coverTypeDescription);
  });

  it('should display policy start date in the template', () => {
    const formatedDate = moment(mockMotorPolicy.startDate).format('ddd D, MMM YYYY');
    const element = fixture.debugElement.query(By.css('.start-date'));
    expect(element.nativeElement.textContent).toBe(formatedDate);
  });

  it('should display policy end date in the template', () => {
    const formatedDate = moment(mockMotorPolicy.endDate).format('ddd D, MMM YYYY');
    const element = fixture.debugElement.query(By.css('.end-date'));
    expect(element.nativeElement.textContent).toBe(formatedDate);
  });

  it('should be eligible for breakdown if breakdown cover is purchased', () => {
    const eligible = component.isCarEligibleForBreakdownCover(true);
    expect(eligible).toBeTrue();
  });

  it('should be eligible for breakdown if breakdown cover is not purchased but car less than 15 years from cover start date', () => {
    const eligible = component.isCarEligibleForBreakdownCover(false);
    expect(eligible).toBeTrue();
  });

  it('should not be eligible for breakdown if breakdown cover is not purchased and car is more than 15 years from cover start date', () => {
    component.policy.vehicle.dateOfRegistration = coverStartDate.subtract(16, 'years').format('YYYY-MM-DD');
    const eligible = component.isCarEligibleForBreakdownCover(false);
    expect(eligible).toBeFalse();
  });

  it('should get the breakdown name for passed in code', () => {
    expect(component.getBreakdownDescription('BK1')).toEqual('Roadside Assistance');
  });

  it('should get the breakdown help text for passed in code', () => {
    expect(component.getBreakdownHelpText('BK1')).toBeNonEmptyString();
  });
});
