import { TestBed } from '@angular/core/testing';

import { Error404Component } from './error404.component';
import { DataLayerComponent } from '../../../components/shared/data-layer.component';

describe('Error 404 Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DataLayerComponent,
        Error404Component,
      ],
      providers: [
      ],
    });
  });

  it('should create Error 404 component instance', () => {
    const fixture = TestBed.createComponent(Error404Component);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
