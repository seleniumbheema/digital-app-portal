import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import * as moment from 'moment';

import { MtaService } from '../../../../../../components/services/mta.service';
import { SharedModule } from '../../../../../../components/shared/shared.module';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { PolicyChangeRegistrationComponent } from './policy-change-registration.component';
import { HttpErrorModel } from '../../../../../../components/services/http.service';

class MockMtaService {
  public postRegistrationChanges(policy: MotorPolicyDetails, changeForm: any): Observable<void | HttpErrorModel> {
    if (policy && changeForm.registration === 'ABC666') {
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

describe('PolicyChangeRegistrationComponent', () => {
  let component: PolicyChangeRegistrationComponent;
  let fixture: ComponentFixture<PolicyChangeRegistrationComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [
        PolicyChangeRegistrationComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MtaService, useClass: MockMtaService },
      ],
    });

    fixture = TestBed.createComponent(PolicyChangeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Policy Change Registration component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should show help text if click information icon for reg field', () => {
    let helpText = fixture.nativeElement.querySelector('.message.is-help');
    expect(helpText).toBeNull();
    const element = fixture.debugElement.query(By.css('.help-icon'));
    element.nativeElement.click();
    fixture.detectChanges();
    helpText = fixture.debugElement.query(By.css('.message-body'));
    expect(helpText).not.toBeNull();
  });

  it('should set changeFormSubmitted to true if submit invalid form', () => {
    component.registrationControl.setValue('ABC666666666');
    fixture.detectChanges();
    expect(component.changeForm.valid).toBeFalse();
    component.submitChanges();
    expect(component.changeFormSubmitted).toBeTrue();
  });

  it('should set changeFormSent to true if submit valid form', () => {
    component.registrationControl.setValue('ABC666');
    fixture.detectChanges();
    expect(component.changeForm.valid).toBeTrue();
    expect(component.changeForm.value.registration).toEqual('ABC666');
    const spy = spyOn<any>(component, 'backToTop').and.stub();
    component.submitChanges();
    expect(component.changeFormSent).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('should add global error if submit valid form catches an error', () => {
    component.registrationControl.setValue('ABC667');
    fixture.detectChanges();
    expect(component.changeForm.valid).toBeTrue();
    component.submitChanges();
    expect(component.disableSubmit).toBeFalse();
    expect(component.messages).toBeArrayOfSize(1);
  });

});
