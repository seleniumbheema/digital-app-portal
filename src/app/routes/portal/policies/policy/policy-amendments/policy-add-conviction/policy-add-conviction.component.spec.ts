import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import * as moment from 'moment';
// import { By } from '@angular/platform-browser';

import { MtaService } from '../../../../../../components/services/mta.service';
import { SharedModule } from '../../../../../../components/shared/shared.module';
import { MotorPolicyDetails } from '../../../../../../models/policy/motor-details';
import { PolicyAddConvictionComponent } from './policy-add-conviction.component';
import { HttpErrorModel } from '../../../../../../components/services/http.service';

class MockMtaService {
  postConvictionChange(policy: MotorPolicyDetails, convictionDetails: any): Observable<void | HttpErrorModel> {
    if (policy && convictionDetails.convictionCode === 'SP30') {
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

describe('PolicyAddConvictionComponent', () => {
  let component: PolicyAddConvictionComponent;
  let fixture: ComponentFixture<PolicyAddConvictionComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [
        PolicyAddConvictionComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MtaService, useClass: MockMtaService },
      ],
    });

    fixture = TestBed.createComponent(PolicyAddConvictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Conviction Form component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should set convictionFormSubmitted to true if submit invalid form', () => {
    expect(component.convictionForm.valid).toBeFalse();
    component.submitChanges();
    expect(component.convictionFormSubmitted).toBeTrue();
  });

  it('should set convictionFormSent to true if submit valid form', () => {
    const conDate = moment.utc().subtract(1, 'month');
    component.convictionForm.patchValue({
      relatesTo: 'ME',
      licenceSuspended: 'N',
      moreThanOneConviction: 'N',
      convictionCode: 'SP30',
      dateOfConviction: {
        Day: conDate.date(),
        Month: conDate.month() + 1,
        Year: conDate.year(),
      },
      penaltyPoints: 3,
    });

    component.handlePolicyHolderOrNamedChange();
    fixture.detectChanges();
    expect(component.convictionForm.valid).toBeTrue();
    const spy = spyOn<any>(component, 'backToTop').and.stub();
    component.submitChanges();
    expect(component.convictionFormSent).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('should add global error if submit valid form catches an error', () => {
    const conDate = moment.utc().subtract(1, 'month');
    component.convictionForm.patchValue({
      relatesTo: 'OTHER',
      namedDriverFirstName: 'First',
      namedDriverLastName: 'Last',
      licenceSuspended: 'N',
      moreThanOneConviction: 'N',
      convictionCode: 'DU10',
      dateOfConviction: {
        Day: conDate.date(),
        Month: conDate.month() + 1,
        Year: conDate.year(),
      },
      penaltyPoints: 3,
    });
    fixture.detectChanges();
    expect(component.convictionForm.valid).toBeTrue();
    component.submitChanges();
    expect(component.disableSubmit).toBeFalse();
    expect(component.messages).toBeArrayOfSize(1);
  });
});
