import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcodeComponent } from './postcode.component';
import { SharedModule } from '../../../shared/shared.module';

describe('PostcodeComponent', () => {

  let fixture: ComponentFixture<PostcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PostcodeComponent,
      ],
      providers: [],
      imports: [
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(PostcodeComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
