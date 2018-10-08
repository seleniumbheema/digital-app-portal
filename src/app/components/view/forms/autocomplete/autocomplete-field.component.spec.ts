import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2CompleterModule } from 'ng2-completer';

import { AutocompleteFieldComponent } from './autocomplete-field.component';
import { SharedModule } from '../../../shared/shared.module';

describe('AutocompleteComponent', () => {

  let fixture: ComponentFixture<AutocompleteFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutocompleteFieldComponent,
      ],
      providers: [],
      imports: [
        SharedModule,
        Ng2CompleterModule,
      ],
    });
    fixture = TestBed.createComponent(AutocompleteFieldComponent);
  });

  it('should throw an error if not all required attributes are passed in', () => {
    expect(() => fixture.detectChanges()).toThrowError();
  });

});
