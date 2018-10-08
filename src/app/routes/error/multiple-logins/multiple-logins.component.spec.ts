import { TestBed } from '@angular/core/testing';

import { MultipleLoginsComponent } from './multiple-logins.component';
import { DataLayerComponent } from '../../../components/shared/data-layer.component';

describe('Multiple Logins Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DataLayerComponent,
        MultipleLoginsComponent,
      ],
      providers: [
      ],
    });
  });

  it('should create Multiple Logins component instance', () => {
    const fixture = TestBed.createComponent(MultipleLoginsComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
