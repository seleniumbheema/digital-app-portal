import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../../../components/shared/shared.module';
import { AuthTroublePasswordResetComponent } from './auth-trouble-password-reset.component';

@Component({
  selector: 'es-auth-reset-password-confirmation',
  template: '',
})
class MockResetPasswordConfirmationComponent {
}

describe('AuthTroublePasswordResetComponent', () => {
  let component: AuthTroublePasswordResetComponent;
  let fixture: ComponentFixture<AuthTroublePasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthTroublePasswordResetComponent,
        MockResetPasswordConfirmationComponent,
      ],
      imports: [
        SharedModule,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTroublePasswordResetComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
