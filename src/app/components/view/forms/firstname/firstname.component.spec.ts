import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstnameComponent } from './firstname.component';
import { SharedModule } from '../../../shared/shared.module';

describe('FirstnameComponent', () => {

  let fixture: ComponentFixture<FirstnameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(FirstnameComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
