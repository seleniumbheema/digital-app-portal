import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastnameComponent } from './lastname.component';
import { SharedModule } from '../../../shared/shared.module';

describe('LastnameComponent', () => {

  let fixture: ComponentFixture<LastnameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(LastnameComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
