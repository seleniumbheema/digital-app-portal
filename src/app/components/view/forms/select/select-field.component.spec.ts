import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFieldComponent } from './select-field.component';
import { SharedModule } from '../../../shared/shared.module';

describe('SelectFieldComponent', () => {

  let fixture: ComponentFixture<SelectFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(SelectFieldComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
