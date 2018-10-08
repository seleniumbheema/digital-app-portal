import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNumberFieldComponent } from './policy-number.component';
import { SharedModule } from '../../../shared/shared.module';

describe('PolicyNumberFieldComponent', () => {

  let fixture: ComponentFixture<PolicyNumberFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PolicyNumberFieldComponent,
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(PolicyNumberFieldComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
