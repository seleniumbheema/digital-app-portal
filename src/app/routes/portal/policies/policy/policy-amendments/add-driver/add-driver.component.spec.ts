import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Ng2CompleterModule } from 'ng2-completer';
import * as moment from 'moment';

import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { MtaService } from '../../../../../../components/services/mta.service';
import { SharedModule } from '../../../../../../components/shared/shared.module';
import { AddDriverComponent } from './add-driver.component';
import { AutocompleteFieldComponent } from '../../../../../../components/view/forms/autocomplete/autocomplete-field.component';
import { HttpErrorModel } from '../../../../../../components/services/http.service';

class MockMtaService {
  postAddDriverChange(policy: MotorPolicyDetails, driverChangesForm: any, screeningForm: any): Observable<void | HttpErrorModel> {
    if (policy && screeningForm && driverChangesForm.firstName === 'First') {
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

  refreshToken() { }
}

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

const expectedPolicy = new MotorPolicyDetails(mockMotorPolicy);

const mockActivatedRoute = {
  parent: {
    parent: {
      data: of({ policy: expectedPolicy }),
      snapshot: {},
    },
  },
};

describe('AddDriverComponent', () => {
  let component: AddDriverComponent;
  let fixture: ComponentFixture<AddDriverComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        Ng2CompleterModule,
      ],
      declarations: [
        AddDriverComponent,
        AutocompleteFieldComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MtaService, useClass: MockMtaService },
      ],
    });

    fixture = TestBed.createComponent(AddDriverComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('prescreening form', () => {
    it('should create the Add Driver component instance', () => {
      // Call detectChanges, this triggers the ngOnInit() to get called
      expect(component).toBeTruthy();
    });

    it('should set screeningFormSubmitted to true if submit invalid form', () => {
      expect(component.screeningForm.valid).toBeFalse();
      spyOn<any>(component, 'backToTop').and.stub();
      component.submitScreening();
      expect(component.screeningFormSubmitted).toBeTrue();
    });
  });

  describe('driver details form', () => {
    beforeEach(() => {
      spyOn<any>(component, 'backToTop').and.stub();
      // In order to trigger the change events, we have to click the native element, rather than just setting the value within patchValue command
      const permanentCover = fixture.debugElement.query(By.css('#cover-permanent'));
      permanentCover.nativeElement.click();

      const temporaryCover = fixture.debugElement.query(By.css('#cover-temporary'));
      temporaryCover.nativeElement.click();
      fixture.detectChanges();

      const from: moment.Moment = moment.utc().add(5, 'days');
      const until: moment.Moment = moment.utc().add(10, 'days');
      component.screeningForm.patchValue({
        confirmAgree: 'Y',
        dateFrom: { Day: from.get('date'), Month: from.get('month') + 1, Year: from.get('year') },
        dateUntil: { Day: until.get('date'), Month: until.get('month') + 1, Year: until.get('year') },
      });

      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#submitScreening'));
      element.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show the driver details form when prescreening is successful', () => {
      expect(component.screeningForm.valid).toBeTrue();
      const element = fixture.debugElement.query(By.css('#driver-details-form'));
      expect(element).toBeTruthy();
    });

    it('should allow the user to return to prescreening questions', () => {
      const backBtnElement = fixture.debugElement.query(By.css('#back-to-screening-button'));
      backBtnElement.nativeElement.click();
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#submitScreening'));
      expect(element.nativeElement.textContent.trim()).toBe('Continue');
    });

    it('should show occupation questions if certain employment status is selected', () => {
      let occupation = fixture.debugElement.query(By.css('#occupation'));
      let industry = fixture.debugElement.query(By.css('#industry'));
      let hasSecondOccTrue = fixture.debugElement.query(By.css('#secondOcc-affirmative'));
      expect(occupation).toBeNull();
      expect(industry).toBeNull();
      expect(hasSecondOccTrue).toBeNull();
      component.employmentStatusControl.setValue('Employed');
      component.updateOccupationValidators();
      fixture.detectChanges();
      occupation = fixture.debugElement.query(By.css('#occupation'));
      industry = fixture.debugElement.query(By.css('#industry'));
      hasSecondOccTrue = fixture.debugElement.query(By.css('#secondOcc-affirmative'));
      expect(occupation).toBeTruthy();
      expect(industry).toBeTruthy();
      expect(hasSecondOccTrue).toBeTruthy();

      let secondOcc = fixture.debugElement.query(By.css('#secondaryOccupation'));
      expect(secondOcc).toBeNull();
      hasSecondOccTrue.nativeElement.click();
      fixture.detectChanges();
      secondOcc = fixture.debugElement.query(By.css('#secondaryOccupation'));
      expect(secondOcc).toBeTruthy();

      const hasSecondOccFalse = fixture.debugElement.query(By.css('#secondOcc-negative'));
      hasSecondOccFalse.nativeElement.click();
      fixture.detectChanges();
      secondOcc = fixture.debugElement.query(By.css('#secondaryOccupation'));
      expect(secondOcc).toBeNull();

      component.employmentStatusControl.setValue('Retired');
      component.updateOccupationValidators();
      fixture.detectChanges();
      occupation = fixture.debugElement.query(By.css('#occupation'));
      expect(occupation).toBeNull();
    });

    it('should show licence months if ceetain years is selected', () => {
      component.yearsLicenceHeldControl.setValue('2 Years');
      component.updateMonthsLicenceHeldValidators();
      fixture.detectChanges();

      let months = fixture.debugElement.query(By.css('#monthsLicenceHeld'));
      expect(months).toBeTruthy();

      component.yearsLicenceHeldControl.setValue('15 Years');
      component.updateMonthsLicenceHeldValidators();
      fixture.detectChanges();

      months = fixture.debugElement.query(By.css('#monthsLicenceHeld'));
      expect(months).toBeNull();
    });

    it('should set driverDetailsFormSubmitted to true if submit invalid form', () => {
      expect(component.driverDetailsForm.valid).toBeFalse();
      component.submitChanges();
      expect(component.driverDetailsFormSubmitted).toBeTrue();
    });

    it('should set changeFormSent to true if submit valid form', () => {
      const birthDate = moment.utc().subtract(25, 'years');
      component.driverDetailsForm.patchValue({
        title: 'MR',
        firstName: 'First',
        lastName: 'Last',
        maritalStatus: 'Single',
        gender: 'M',
        dateOfBirth: {
          Day: birthDate.date(),
          Month: birthDate.month() + 1,
          Year: birthDate.year(),
        },
        employmentStatus: 'Retired',
        relationship: 'A',
        licenceType: 'Full',
        yearsLicenceHeld: '15 Years',
      });

      component.disableSubmit = false;
      component.updateOccupationValidators();
      component.updateMonthsLicenceHeldValidators();
      fixture.detectChanges();
      expect(component.driverDetailsForm.valid).toBeTrue();
      component.submitChanges();
      expect(component.changeFormSent).toBeTrue();
    });

    it('should add global error if submit valid form catches an error', () => {
      const birthDate = moment.utc().subtract(25, 'years');
      component.driverDetailsForm.patchValue({
        title: 'MR',
        firstName: 'Firstaaa',
        lastName: 'Last',
        maritalStatus: 'Single',
        gender: 'M',
        dateOfBirth: {
          Day: birthDate.date(),
          Month: birthDate.month() + 1,
          Year: birthDate.year(),
        },
        employmentStatus: 'Retired',
        relationship: 'A',
        licenceType: 'Full',
        yearsLicenceHeld: '15 Years',
      });

      component.disableSubmit = false;
      component.updateOccupationValidators();
      component.updateMonthsLicenceHeldValidators();
      fixture.detectChanges();
      expect(component.driverDetailsForm.valid).toBeTrue();
      component.submitChanges();
      expect(component.disableSubmit).toBeFalse();
      expect(component.messages).toBeArrayOfSize(1);
    });

  });

  describe('isShowCallUsMessage', () => {
    it('should be true if permanent driver and already has 2 drivers', () => {
      component.typeOfCoverControl.setValue('P');
      component.twoDriversAlreadyControl.setValue('Y');
      expect(component.isShowCallUsMessage()).toBeTrue();
    });
  });

  describe('isShowConfirmField', () => {
    it('should be true if does not already have 2 drivers and is permanent cover', () => {
      component.typeOfCoverControl.setValue('P');
      component.twoDriversAlreadyControl.setValue('N');
      expect(component.isShowConfirmField()).toBeTrue();
    });
  });

  describe('Field validation', () => {
    describe('Occupation field', () => {
      it('should be invalid if not a valid occupation', () => {
        component.occupationControl.setValue('Chicken Chaserrrrrr');
        expect(component.occupationControl.valid).toBeFalse();
      });

      it('should be valid if a valid occupation', () => {
        component.occupationControl.setValue('Chicken Chaser');
        expect(component.occupationControl.valid).toBeTrue();
      });
    });

    describe('Temp driver Until date field', () => {
      it('should be invalid if date is before today', () => {
        const yesterday = moment.utc().subtract(1, 'day');
        component.dateUntilGroup.setValue({
          Day: yesterday.get('date'),
          Month: yesterday.get('month') + 1,
          Year: yesterday.get('year'),
        });
        expect(component.dateUntilGroup.valid).toBeFalse();
        expect(component.dateUntilGroup.hasError('dateBefore')).toBeTrue();
      });

      it('should be valid if date is valid and against date is not valid', () => {
        const tomorrow = moment.utc().add(1, 'day');
        component.dateUntilGroup.setValue({
          Day: tomorrow.get('date'),
          Month: tomorrow.get('month') + 1,
          Year: tomorrow.get('year'),
        });
        expect(component.dateUntilGroup.valid).toBeTrue();
        expect(component.dateFromGroup.valid).toBeFalse();
      });

      it('should be valid if date is valid, against date is valid and they are valid with each other', () => {
        const tomorrow = moment.utc().add(1, 'day');
        const threeDaysTime = moment.utc().add(3, 'day');
        component.dateFromGroup.setValue({
          Day: tomorrow.get('date'),
          Month: tomorrow.get('month') + 1,
          Year: tomorrow.get('year'),
        });
        component.dateUntilGroup.setValue({
          Day: threeDaysTime.get('date'),
          Month: threeDaysTime.get('month') + 1,
          Year: threeDaysTime.get('year'),
        });
        expect(component.dateUntilGroup.valid).toBeTrue();
        expect(component.dateFromGroup.valid).toBeTrue();
      });

      it('should be invalid if date is valid, against date is valid and they are invalid with each other', () => {
        const tomorrow = moment.utc().add(1, 'day');
        const invalidFuture = moment.utc().add(8, 'weeks');
        component.dateFromGroup.setValue({
          Day: tomorrow.get('date'),
          Month: tomorrow.get('month') + 1,
          Year: tomorrow.get('year'),
        });
        component.dateUntilGroup.setValue({
          Day: invalidFuture.get('date'),
          Month: invalidFuture.get('month') + 1,
          Year: invalidFuture.get('year'),
        });
        expect(component.dateUntilGroup.valid).toBeFalse();
        expect(component.dateUntilGroup.hasError('dateInvalidAgainstOther')).toBeTrue();
        expect(component.dateFromGroup.valid).toBeTrue();

        // Make changes to the from date to trigger the valueChanges subscription to run
        const newFromDate = tomorrow.add(1, 'day');
        component.dateFromGroup.setValue({
          Day: newFromDate.get('date'),
          Month: newFromDate.get('month') + 1,
          Year: newFromDate.get('year'),
        });

        expect(component.dateUntilGroup.valid).toBeFalse();
        expect(component.dateUntilGroup.hasError('dateInvalidAgainstOther')).toBeTrue();
        expect(component.dateFromGroup.valid).toBeTrue();
      });
    });
  });
});
