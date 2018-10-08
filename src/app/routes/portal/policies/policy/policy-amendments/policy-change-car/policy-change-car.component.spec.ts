import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';

import { PolicyChangeCarComponent } from './policy-change-car.component';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { VehicleDataService } from '../../../../../../components/services/vehicle-data.service';
import { MtaService } from '../../../../../../components/services/mta.service';
import { SharedModule } from '../../../../../../components/shared/shared.module';
import { HttpErrorModel } from '../../../../../../components/services/http.service';

class MockMtaService {
  postCarChange() { }

  refreshToken() { }
}
class MockVehicleDataService {
  getVehicleWithReg() { }
}

const coverStartDate: moment.Moment = moment().subtract(165, 'days');

const mockLookupVehicle = {
  make: 'FORD',
  model: 'FIESTA 35 1.8TDDI',
  fuel: 'D',
  transmission: 'M',
  registrationDate: '2001-03-30T00:00:00Z',
};

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

describe('PolicyChangeCarComponent', () => {
  let component: PolicyChangeCarComponent;
  let fixture: ComponentFixture<PolicyChangeCarComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        // RouterTestingModule,
      ],
      declarations: [
        PolicyChangeCarComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: VehicleDataService, useClass: MockVehicleDataService },
        { provide: MtaService, useClass: MockMtaService },
      ],
    });

    fixture = TestBed.createComponent(PolicyChangeCarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('prescreening form', () => {
    it('should create the Policy Car Change component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should not show the error message if modified is No', () => {
      component.screeningForm.patchValue({ modified: 'N' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element).toBe(null);
    });

    it('should not show the error message if owner is Yes', () => {
      component.screeningForm.patchValue({ modified: 'N', owner: 'Y' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element).toBe(null);
    });

    it('should not show the error message if registrationKnown is Yes', () => {
      component.screeningForm.patchValue({ modified: 'N', owner: 'Y', registrationKnown: 'Y' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element).toBe(null);
    });

    it('should show the form submit button when all the questions are correct', () => {
      component.screeningForm.patchValue({ modified: 'N', owner: 'Y', registrationKnown: 'Y' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('.button.continue'));
      expect(element.nativeElement.textContent.trim()).toBe('Continue');
    });

    it('should show the error message if modified is Yes', () => {
      component.screeningForm.patchValue({ modified: 'Y' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element.nativeElement).toBeTruthy();
    });

    it('should show the error message if owner is No', () => {
      component.screeningForm.patchValue({ modified: 'N', owner: 'N' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element.nativeElement).toBeTruthy();
    });

    it('should show the error message if registrationKnown is No', () => {
      component.screeningForm.patchValue({ modified: 'N', owner: 'Y', registrationKnown: 'N' });
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('#call-msg'));
      expect(element.nativeElement).toBeTruthy();
    });

    it('should set screeningFormSubmitted to true if submit invalid form', () => {
      expect(component.screeningForm.valid).toBeFalse();
      spyOn<any>(component, 'backToTop').and.stub();
      component.submitScreening();
      expect(component.screeningFormSubmitted).toBeTrue();
    });
  });

  describe('change form', () => {
    beforeEach(() => {
      spyOn<any>(component, 'backToTop').and.stub();
      component.screeningForm.patchValue({ modified: 'N', owner: 'Y', registrationKnown: 'Y' });
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.button.continue'));
      element.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show the change car form when prescreening is successful', () => {
      const element = fixture.debugElement.query(By.css('#change-car-form'));
      expect(element).toBeTruthy();
    });

    it('should allow the user to return to prescreening questions', () => {
      const backBtnElement = fixture.debugElement.query(By.css('#back-to-screening-button'));
      backBtnElement.nativeElement.click();
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.button.continue'));
      expect(element.nativeElement.textContent.trim()).toBe('Continue');
    });

    describe('lookup vehicle with invalid registration', () => {
      beforeEach(() => {
        spyOn(component.vehicleService, 'getVehicleWithReg').and.returnValue(throwError('404 Not Found'));
        component.changeForm.patchValue({ registration: 'AB12DEF' });

        fixture.detectChanges();

        const findCarBtn = fixture.debugElement.query(By.css('#find-car-button'));
        findCarBtn.nativeElement.click();
        fixture.detectChanges();
      });

      it('should call the vehicle service', () => {
        expect(component.vehicleService.getVehicleWithReg).toHaveBeenCalled();
      });

      it('should set found car to null', () => {
        expect(component.foundCar).toBeNull();
      });

      it('should not show the car details to the user', () => {
        const element = fixture.debugElement.query(By.css('#found-car'));
        expect(element).toBeFalsy();
      });

      it('should set changeFormCarFound to false', () => {
        expect(component.changeFormCarFound).toBeFalse();
      });
    });

    describe('lookup vehicle with registration empty', () => {
      beforeEach(() => {
        spyOn(component.vehicleService, 'getVehicleWithReg').and.stub();
        component.changeForm.patchValue({ registration: '' });
        fixture.detectChanges();
        component.findCar();
      });

      it('should not call the vehicle service', () => {
        expect(component.vehicleService.getVehicleWithReg).not.toHaveBeenCalled();
      });

      it('should set found car to null', () => {
        expect(component.foundCar).toBeNull();
      });

      it('should not show the car details to the user', () => {
        const element = fixture.debugElement.query(By.css('#found-car'));
        expect(element).toBeFalsy();
      });

      it('should set changeFormCarFound to null', () => {
        expect(component.changeFormCarFound).toBeNull();
      });
    });

    describe('lookup vehicle with valid registration', () => {
      beforeEach(() => {
        const vehicle = mockLookupVehicle;

        spyOn(component.vehicleService, 'getVehicleWithReg').and.returnValue(of({ vehicle }));
        component.changeForm.patchValue({ registration: 'AB12DEF' });
        fixture.detectChanges();

        const findCarBtn = fixture.debugElement.query(By.css('#find-car-button'));
        findCarBtn.nativeElement.click();
        fixture.detectChanges();
      });

      it('should call the vehicle service', () => {
        expect(component.vehicleService.getVehicleWithReg).toHaveBeenCalled();
      });

      it('should set found car', () => {
        expect(component.foundCar.make).toBe(mockLookupVehicle.make);
        expect(component.foundCar.model).toBe(mockLookupVehicle.model);
        expect(component.foundCar.transmission).toBe('Manual');
        expect(component.foundCar.registrationDate).toBe(mockLookupVehicle.registrationDate);
      });

      it('should show the car details', () => {
        const element = fixture.debugElement.query(By.css('#found-car'));
        expect(element).toBeTruthy();
      });

      it('should set changeFormCarFound to true', () => {
        expect(component.changeFormCarFound).toBeTrue();
      });

      it('should show the \'not my car\' button', () => {
        const incorrectCarBtn = fixture.debugElement.query(By.css('#incorrect-car-button'));
        expect(incorrectCarBtn).toBeTruthy();
      });

      describe('not my car button', () => {
        beforeEach(() => {
          const incorrectCarBtn = fixture.debugElement.query(By.css('#incorrect-car-button'));
          incorrectCarBtn.nativeElement.click();
          fixture.detectChanges();
        });

        it('should remove the car details', () => {
          const element = fixture.debugElement.query(By.css('#found-car'));
          expect(element).toBeFalsy();
        });

        it('should set changeFormCarFound to true', () => {
          expect(component.changeFormCarFound).toBeFalse();
        });
      });
    });

    describe('lookup vehicle (automatic)', () => {
      beforeEach(() => {
        const vehicle = _.clone(mockLookupVehicle);
        vehicle.transmission = 'A';

        spyOn(component.vehicleService, 'getVehicleWithReg').and.returnValue(of({ vehicle }));
        component.changeForm.patchValue({ registration: 'AB12DEF' });

        fixture.detectChanges();

        const findCarBtn = fixture.debugElement.query(By.css('#find-car-button'));
        findCarBtn.nativeElement.click();
        fixture.detectChanges();
      });

      it('should call the vehicle service', () => {
        expect(component.vehicleService.getVehicleWithReg).toHaveBeenCalled();
      });

      it('should set found car', () => {
        expect(component.foundCar.make).toBe(mockLookupVehicle.make);
        expect(component.foundCar.model).toBe(mockLookupVehicle.model);
        expect(component.foundCar.transmission).toBe('Automatic');
        expect(component.foundCar.registrationDate).toBe(mockLookupVehicle.registrationDate);
      });
    });

    describe('submitting the form', () => {

      it('should add global error if submit valid form catches an error', () => {

        const err: HttpErrorModel = {
          errMsg: 'Error',
          body: 'Body',
          statusCode: 400,
          statusText: 'text',
        };
        spyOn(component.mtaService, 'postCarChange').and.returnValue(throwError(err));
        component.changeForm.patchValue({
          registration: 'AB12DEF', valuation: '1', purchased: 'Y', purchaseDate: {
            Day: '01', Month: '01', Year: '2018',
          },
        });

        component.foundCar = {
          make: '',
          model: '',
          transmission: '',
          registration: '',
          registrationDate: '',
        };

        fixture.detectChanges();
        expect(component.changeForm.valid).toBeTrue();
        component.submitChanges();
        expect(component.disableSubmit).toBeFalse();
        expect(component.messages).toBeArrayOfSize(1);
      });

      describe('with a valid form and a found car', () => {

        beforeEach(() => {
          const vehicle = mockLookupVehicle;

          spyOn(component.vehicleService, 'getVehicleWithReg').and.returnValue(of({ vehicle }));
          spyOn(component.mtaService, 'postCarChange').and.returnValue(of(true));

          component.changeForm.patchValue({
            registration: 'AB12DEF', valuation: '1', purchaseDate: {
              Day: '01', Month: '01', Year: '2018',
            },
          });

          fixture.detectChanges();

          const findCarBtn = fixture.debugElement.query(By.css('#find-car-button'));
          findCarBtn.nativeElement.click();
          fixture.detectChanges();

          expect(component.foundCar).not.toBeNull();

          // Click no, then yes for purchased to get full test coverage of the change function
          const purchasedBtnNo = fixture.debugElement.query(By.css('#mta-purchased-negative'));
          purchasedBtnNo.nativeElement.click();
          fixture.detectChanges();
          const purchasedBtnYes = fixture.debugElement.query(By.css('#mta-purchased-affirmative'));
          purchasedBtnYes.nativeElement.click();
          fixture.detectChanges();

          const element = fixture.debugElement.query(By.css('#submit-button'));
          element.nativeElement.click();
          fixture.detectChanges();
        });

        it('should call the mta service', () => {
          expect(component.mtaService.postCarChange).toHaveBeenCalled();
        });

        it('should set changeFormSent to true', () => {
          expect(component.changeFormSent).toBeTrue();
        });

        it('should show the confirmation page', () => {
          const element = fixture.debugElement.query(By.css('h2'));

          expect(element.nativeElement.textContent).toBe('Thank you');
        });
      });

      describe('with a valid form and no found car', () => {

        beforeEach(() => {
          component.foundCar = null;

          spyOn(component.mtaService, 'postCarChange').and.stub();

          component.changeForm.patchValue({
            registration: 'AB12DEF', valuation: '1', purchased: 'Y', purchaseDate: {
              Day: '01', Month: '01', Year: '2018',
            },
          });

          fixture.detectChanges();
          component.submitChanges();
        });

        it('should not call the mta service', () => {
          expect(component.mtaService.postCarChange).not.toHaveBeenCalled();
        });

        it('should set changeFormSubmitted to true', () => {
          expect(component.changeFormSubmitted).toBeTrue();
        });

      });

    });
  });
});
