import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRegFieldComponent } from './vehicle-reg.component';
import { SharedModule } from '../../../shared/shared.module';

describe('VehicleRegFieldComponent', () => {

  let fixture: ComponentFixture<VehicleRegFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(VehicleRegFieldComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
