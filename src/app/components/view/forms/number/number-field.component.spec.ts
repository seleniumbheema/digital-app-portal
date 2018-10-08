import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFieldComponent } from './number-field.component';
import { SharedModule } from '../../../shared/shared.module';

describe('NumberFieldComponent', () => {

  let fixture: ComponentFixture<NumberFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(NumberFieldComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
