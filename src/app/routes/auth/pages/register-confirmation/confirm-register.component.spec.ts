import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../../../components/shared/shared.module';
import { ConfirmRegisterComponent } from './confirm-register.component';
import { TestModule } from '../../../../../test-helpers';
import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { HttpService } from '../../../../components/services/http.service';

@Component({
  selector: 'es-register-confirmation',
  template: '',
})
class MockConfirmRegisterComponent { }

describe('ConfirmRegisterComponent', () => {
  let component: ConfirmRegisterComponent;
  let fixture: ComponentFixture<ConfirmRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmRegisterComponent,
        MockConfirmRegisterComponent,
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        TestModule,
      ],
      providers: [
        CustomerDataService,
        HttpService,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
