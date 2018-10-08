import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { Observable, of, throwError } from 'rxjs';

import { TestModule } from '../../../../../test-helpers';
import { RegisterOnlineComponent } from './register-online.component';
import { AuthService } from '../../../../components/auth/auth.service';
import { PolicyNumberFieldComponent } from '../../../../components/view/forms/policy-number/policy-number.component';
import { PostcodeComponent } from '../../../../components/view/forms/postcode/postcode.component';
import { MasterCustomerCredentials } from '../../../../components/auth/auth.interface';
import { HttpErrorModel } from '../../../../components/services/http.service';

let findMasterCustCalled: boolean;

class MockAuthService {

  findMasterCust(credentials: MasterCustomerCredentials): Observable<object> {
    findMasterCustCalled = true;

    if (credentials.forename === 'Somename') {
      return of({ firstname: 'Somename' });
    }

    if (credentials.surname === 'Somesurname') {
      return of({ surname: 'Somesurname' });
    }

    if (credentials.dateOfBirth === '2018-01-01') {
      return of({ dob: '2018-01-01' });
    }

    if (credentials.policyId === 12345) {
      return of({ policyId: 12345 });
    }

    if (credentials.postcode === 'SM53EE') {
      return of({ postcode: 'SM53EE' });
    }

    if (credentials.vehicleRegistrationNumber === 'M9WYS') {
      return of({ vehicleRegistrationNumber: 'M9WYS' });
    }

    const error: HttpErrorModel = {
      errMsg: '',
      body: '',
      statusCode: 400,
      statusText: '',
    };

    return throwError(error);
  }

  public getKeyFromToken(key: string): string {
    return key;
  }
}
describe('Register Online Component', () => {
  let component: RegisterOnlineComponent;
  let fixture: ComponentFixture<RegisterOnlineComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        RecaptchaModule.forRoot(),
      ],
      declarations: [
        RegisterOnlineComponent,
        PolicyNumberFieldComponent,
        PostcodeComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    fixture = TestBed.createComponent(RegisterOnlineComponent);
    component = fixture.componentInstance;
  });

  it('should create Register Online component instance', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Find Master Customer', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    afterEach(() => {
      findMasterCustCalled = false;
    });

    describe('valid form using Policy Number', () => {

      it('should be valid if form inputs are valid', () => {
        component.form.controls.forename.setValue('Chris');
        component.form.controls.surname.setValue('Murton');
        component.form.controls.dob.setValue({ dayCtrl: '01', monthCtrl: '01', yearCtrl: '2000' });
        component.form.controls.postcode.setValue('RH14DH');
        component.form.controls.policyId.setValue('12345');
        component.onSubmit(null);
        expect(component.form.valid).toBeTrue();
      });

      it('should call the authService findMasterCust method', () => {
        component.form.controls.forename.setValue('Chris');
        component.form.controls.surname.setValue('Murton');
        component.form.controls.dob.setValue({ dayCtrl: '01', monthCtrl: '01', yearCtrl: '2000' });
        component.form.controls.postcode.setValue('RH14DH');
        component.form.controls.policyId.setValue('12345');
        component.onSubmit(null);
        expect(findMasterCustCalled).toBeTrue();
      });
    });

    describe('valid form using Registration Number', () => {

      beforeEach(() => {
        component.form.controls.policyOrReg.setValue('RN');
        component.handlePolicyOrRegChange();
        fixture.detectChanges();
      });

      it('should be valid if form inputs are valid', () => {
        component.form.controls.forename.setValue('Chris');
        component.form.controls.surname.setValue('Murton');
        component.form.controls.dob.setValue({ dayCtrl: '01', monthCtrl: '01', yearCtrl: '2000' });
        component.form.controls.postcode.setValue('RH14DH');
        component.form.controls.vehicleReg.setValue('M9WYS');
        component.onSubmit(null);
        expect(component.form.valid).toBeTrue();
      });

      it('should call the authService findMasterCust method', () => {
        component.form.controls.forename.setValue('Chris');
        component.form.controls.surname.setValue('Murton');
        component.form.controls.dob.setValue({ dayCtrl: '01', monthCtrl: '01', yearCtrl: '2000' });
        component.form.controls.postcode.setValue('RH14DH');
        component.form.controls.vehicleReg.setValue('M9WYS');
        component.onSubmit(null);
        expect(findMasterCustCalled).toBeTrue();
      });
    });

    describe('invalid form', () => {

      it('should be invalid if form inputs are invalid', () => {

        component.form.controls.forename.setValue(123);
        component.form.controls.surname.setValue(123);
        component.form.controls.dob.setValue({ dayCtrl: '0123', monthCtrl: '01', yearCtrl: '2018' });
        component.form.controls.postcode.setValue('RH14DHdsjbjbcjvh');
        component.form.controls.policyId.setValue('NotAPolicyNo');
        component.onSubmit(null);
        expect(component.form.valid).toBeFalse();
      });
    });

    describe('Validation switched when handlePolicyOrRegChange method called', () => {

      it('should update reg and policy validators when switching options', () => {
        component.policyOrReg.setValue('PN');
        component.handlePolicyOrRegChange();
        expect(component.vehicleReg.valid).toBeTrue();
        expect(component.policyNumber.valid).toBeFalse();

        component.policyOrReg.setValue('RN');
        component.handlePolicyOrRegChange();
        expect(component.vehicleReg.valid).toBeFalse();
        expect(component.policyNumber.valid).toBeTrue();
      });
    });

  });

});
