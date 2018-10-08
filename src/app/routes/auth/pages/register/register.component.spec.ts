import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../../../components/shared/shared.module';
import { RegisterComponent } from './register.component';

@Component({
  selector: 'es-register-online',
  template: '',
})
class MockRegisterComponent { }

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        MockRegisterComponent,
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the data layer', () => {
    spyOn(component.dataLayerComponent, 'addToDataLayer').and.callThrough();
    component.updateDataLayer('event');
    component.updateDataLayer('event');
    expect(component.dataLayerComponent.addToDataLayer).toHaveBeenCalledTimes(1);
  });
});
