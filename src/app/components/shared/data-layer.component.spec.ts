import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DataLayerComponent } from './data-layer.component';

declare let esureDataLayer: object;

describe('Data Layer Component', () => {

  let component: DataLayerComponent;
  let fixture: ComponentFixture<DataLayerComponent>;
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    // Make sure esureDataLayer is set back to an empty object
    esureDataLayer = {};
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        DataLayerComponent,
      ],
      providers: [
      ],
    });

    fixture = TestBed.createComponent(DataLayerComponent);
    component = fixture.componentInstance;
  });

  it('should update the esureDataLayer global var if vars is set', () => {
    component.vars = { pageName: 'PAGE NAME', secondKey: 'SECOND KEY' };
    fixture.detectChanges();
    expect(Object.keys(esureDataLayer).length).toEqual(2);
    expect(esureDataLayer).toHaveMember('pageName');
    expect(esureDataLayer['pageName']).toEqual('PAGE NAME');
    expect(esureDataLayer).toHaveMember('secondKey');
    expect(esureDataLayer['secondKey']).toEqual('SECOND KEY');
  });

  it('should not update the esureDataLayer global var if vars is undefined', () => {
    component.vars = undefined;
    fixture.detectChanges();
    expect(esureDataLayer).toBeEmptyObject();
  });

});
