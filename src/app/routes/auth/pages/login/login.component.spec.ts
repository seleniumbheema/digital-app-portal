import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { LoginComponent } from './login.component';
import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { TestModule } from '../../../../../test-helpers';

@Component({
  selector: 'es-portal-sidebar',
  template: '',
})
class MockSidebarComponent { }

@Component({
  selector: 'es-auth-login',
  template: '',
})
class MockAuthLoginComponent {
  @Input() hideRegister: boolean;
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        MockSidebarComponent,
        MockAuthLoginComponent,
      ],
      imports: [
        TestModule,
      ],
      providers: [
        CustomerDataService,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
