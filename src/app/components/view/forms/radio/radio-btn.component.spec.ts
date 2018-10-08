import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioBtnComponent } from './radio-btn.component';
import { SharedModule } from '../../../shared/shared.module';

describe('RadioBtnComponent', () => {

  let fixture: ComponentFixture<RadioBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(RadioBtnComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
