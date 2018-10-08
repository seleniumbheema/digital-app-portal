import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as _ from 'lodash';

import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PolicySummary } from '../../../models/policy/policy-summary';
import { PolicyCardComponent } from './policy-card.component';
import { BrandUrlPipe } from '../../pipes/brand-url.pipe';

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
  lapsed: true,
  cancellationCode: 1,
  number: 1234,
  type: 'home',
  startDate: moment().subtract(100, 'days').format('YYYY-MM-DD'),
  renewalDate: moment().add(265, 'days').format('YYYY-MM-DD'),
  endDate: moment().add(265, 'days').format('YYYY-MM-DD'),
  renewalNotificationCode: 'RENEWAL_AUTO',
};

const mockMotorPolicy = {
  addons: [
    { code: 'CHC', price: 12.88, purchased: true },
    { code: 'LGL', price: 18.52, purchased: true },
    { code: 'KYC', price: 18.17, purchased: true },
    { code: 'BKC', price: 3.99, purchased: false },
    { code: 'PIB', price: 11.07, purchased: false },
    { code: 'MFS', price: 15.02, purchased: false },
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
  ncdProof: true,
  ncdProtected: true,
  ncdYears: 9,
  lapsed: false,
  cancellationCode: 0,
  number: 12345,
  type: 'motor',
  startDate: moment().subtract(165, 'days').format('YYYY-MM-DD'),
  renewalDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  endDate: moment().add(200, 'days').format('YYYY-MM-DD'),
  useClass: 'Commuting',
  vehicleReg: 'PM17GJM',
  vehicleType: { make: 'BMW', model: 'X3' },
};

describe('PolicyCardComponent', () => {
  let component: PolicyCardComponent;
  let fixture: ComponentFixture<PolicyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PolicyCardComponent,
      ],
      providers: [BrandUrlPipe],
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    });
  }));

  describe('showing a home policy', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(PolicyCardComponent);
      component = fixture.componentInstance;

      component.policy = new PolicySummary(mockHomePolicy);

      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should use the correct icon', () => {
      expect(component.icon.path).toContain('buildings');
    });

    it('should be a lapsed policy with cancellation date', () => {
      expect(mockHomePolicy.lapsed).toBeTrue();
      expect(mockHomePolicy.cancellationCode).toEqual(1);
    });

    it('should display policy identifier in the template', () => {
      const address = mockHomePolicy.riskAddress;

      const element = fixture.debugElement.query(By.css('.policy-identifier'));
      expect(element.nativeElement.textContent.trim()).toBe(`${address.number} ${address.street}, ${address.city}`);
    });

    it('should display policy number in the template', () => {
      const element = fixture.debugElement.query(By.css('.policy-number'));
      expect(element.nativeElement.textContent).toBe(`Policy number: ${mockHomePolicy.number}`);
    });

    it('should display policy start date in the template', () => {
      const formatedDate = moment(mockHomePolicy.startDate).format('ddd D, MMM YYYY');

      const element = fixture.debugElement.query(By.css('.start-date'));
      expect(element.nativeElement.textContent.trim()).toBe(`${formatedDate}`);
    });

    it('should display policy end date in the template', () => {
      const formatedDate = moment(mockHomePolicy.endDate).format('ddd D, MMM YYYY');

      const element = fixture.debugElement.query(By.css('.end-date'));
      expect(element.nativeElement.textContent.trim()).toBe(`${formatedDate}`);
    });
  });

  describe('showing a motor policy', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(PolicyCardComponent);
      component = fixture.componentInstance;

      component.policy = new PolicySummary(mockMotorPolicy);

      fixture.detectChanges(); // trigger initial data binding
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should use the correct icon', () => {
      expect(component.icon.path).toContain('car');
    });

    it('should not be a lapsed policy with cancellation date', () => {
      expect(mockMotorPolicy.lapsed).toBeFalse();
      expect(mockMotorPolicy.cancellationCode).toEqual(0);
    });

    it('should display policy identifier in the template', () => {
      const vehicleType = mockMotorPolicy.vehicleType;

      const element = fixture.debugElement.query(By.css('.policy-identifier'));
      expect(element.nativeElement.textContent.trim()).toBe(`${vehicleType.make} ${vehicleType.model}`);
    });

    it('should display policy number in the template', () => {
      const element = fixture.debugElement.query(By.css('.policy-number'));
      expect(element.nativeElement.textContent).toBe(`Policy number: ${mockMotorPolicy.number}`);
    });

    it('should display policy start date in the template', () => {
      const formatedDate = moment(mockMotorPolicy.startDate).format('ddd D, MMM YYYY');

      const element = fixture.debugElement.query(By.css('.start-date'));
      expect(element.nativeElement.textContent.trim()).toBe(`${formatedDate}`);
    });

    it('should display policy end date in the template', () => {
      const formatedDate = moment(mockMotorPolicy.endDate).format('ddd D, MMM YYYY');

      const element = fixture.debugElement.query(By.css('.end-date'));
      expect(element.nativeElement.textContent.trim()).toBe(`${formatedDate}`);
    });
  });

  describe('setMessages', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(PolicyCardComponent);
      component = fixture.componentInstance;
    });

    it('should not add any messages for home policy with null renewal notification code', () => {
      const homePol = _.clone(mockHomePolicy);
      homePol.lapsed = false;
      homePol.renewalNotificationCode = null;
      component.policy = new PolicySummary(homePol);
      fixture.detectChanges();
      expect(component.messages).toBeEmptyArray();
    });

    it('should add a NCD message for motor policy with NCD proof needed for brand ES or SW', () => {
      const unLapsedPolicy = _.clone(mockMotorPolicy);
      unLapsedPolicy.lapsed = false;
      spyOn<any>(component, 'isAddNcdMessage').and.returnValue(true);
      component.policy = new PolicySummary(unLapsedPolicy);
      fixture.detectChanges();
      expect(component.messages).toBeArrayOfSize(1);
    });

    it('should not add a NCD message for motor policy with NCD proof needed for brand FA', () => {
      const unLapsedPolicy = _.clone(mockMotorPolicy);
      unLapsedPolicy.lapsed = false;
      spyOn<any>(component, 'isAddNcdMessage').and.returnValue(false);
      component.policy = new PolicySummary(unLapsedPolicy);
      fixture.detectChanges();
      expect(component.messages).toBeEmptyArray();
    });

    it('should add a renewal message for motor policy with renewal notification needed', () => {
      mockMotorPolicy.ncdProof = false;
      mockMotorPolicy.lapsed = false;
      mockMotorPolicy['renewalNotificationCode'] = 'RENEWAL_AUTO';
      component.policy = new PolicySummary(mockMotorPolicy);
      fixture.detectChanges();
      expect(component.renewalOrMtaMessages).toBeArrayOfSize(1);
    });

    it('should add a MTA message for policy with MTA notification', () => {
      mockMotorPolicy.ncdProof = false;
      mockMotorPolicy['renewalNotificationCode'] = undefined;
      mockMotorPolicy['mtaNotificationCode'] = 'FUTURE_MTA';
      component.policy = new PolicySummary(mockMotorPolicy);
      fixture.detectChanges();
      expect(component.renewalOrMtaMessages).toBeArrayOfSize(1);
    });
  });
});
