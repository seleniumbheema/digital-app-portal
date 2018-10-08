import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DateComponent } from './date.component';
import { SharedModule } from '../../../shared/shared.module';
import { ValidatorUtils } from '../../../utils/validator-utils';

describe('DateComponent', () => {

  let fixture: ComponentFixture<DateComponent>;
  let component: DateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

  describe('isShowErrorMessage', () => {
    beforeEach(() => {
      component.submitted = false;
      component.parentFormGroup = new FormGroup(
        {
          Day: new FormControl('', Validators.required),
          Month: new FormControl('', Validators.required),
          Year: new FormControl('', Validators.required),
        },
        ValidatorUtils.validDate('Day', 'Month', 'Year'));
      component.controlName = 'Day-Month-Year';
      fixture.detectChanges();
    });

    it('should show error if form group invalid and all 3 form fields dirty and touched', () => {
      component.parentFormGroup.get(component.dayControlName).markAsTouched();
      component.parentFormGroup.get(component.dayControlName).markAsDirty();
      component.parentFormGroup.get(component.monthControlName).markAsTouched();
      component.parentFormGroup.get(component.monthControlName).markAsDirty();
      component.parentFormGroup.get(component.yearControlName).markAsTouched();
      component.parentFormGroup.get(component.yearControlName).markAsDirty();
      fixture.detectChanges();
      expect(component.parentFormGroup.valid).toBeFalse();
      expect(component.isShowErrorMessage()).toBeTrue();
    });

    it('should show error if day field is dirty, touched and invalid', () => {
      component.parentFormGroup.get(component.dayControlName).markAsTouched();
      component.parentFormGroup.get(component.dayControlName).markAsDirty();
      fixture.detectChanges();
      expect(component.parentFormGroup.valid).toBeFalse();
      expect(component.isShowErrorMessage()).toBeTrue();
    });

    it('should show error if month field is dirty, touched and invalid', () => {
      component.parentFormGroup.get(component.monthControlName).markAsTouched();
      component.parentFormGroup.get(component.monthControlName).markAsDirty();
      fixture.detectChanges();
      expect(component.parentFormGroup.valid).toBeFalse();
      expect(component.isShowErrorMessage()).toBeTrue();
    });

    it('should show error if year field is dirty, touched and invalid', () => {
      component.parentFormGroup.get(component.yearControlName).markAsTouched();
      component.parentFormGroup.get(component.yearControlName).markAsDirty();
      fixture.detectChanges();
      expect(component.parentFormGroup.valid).toBeFalse();
      expect(component.isShowErrorMessage()).toBeTrue();
    });
  });

});
