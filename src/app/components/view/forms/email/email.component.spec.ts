import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponent } from './email.component';
import { SharedModule } from '../../../shared/shared.module';

describe('EmailComponent', () => {

  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(EmailComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
