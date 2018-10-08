import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AuthTroublePasswordComponent } from './auth-trouble-password.component';
import { TestModule } from '../../../../../../test-helpers';

@Component({
  selector: 'es-auth-reset-password',
  template: '',
})
class MockResetComponent {
}

describe('AuthTroublePasswordComponent', () => {
  let component: AuthTroublePasswordComponent;
  let fixture: ComponentFixture<AuthTroublePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthTroublePasswordComponent,
        MockResetComponent,
      ],
      imports: [
        TestModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTroublePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
