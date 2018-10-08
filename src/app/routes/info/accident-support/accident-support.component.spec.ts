import { TestBed } from '@angular/core/testing';

import { AccidentSupportComponent } from './accident-support.component';
import { DataLayerComponent } from '../../../components/shared/data-layer.component';

describe('Error 404 Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DataLayerComponent,
        AccidentSupportComponent,
      ],
      providers: [
      ],
    });
  });

  it('should create Accident Support component instance', () => {
    const fixture = TestBed.createComponent(AccidentSupportComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
