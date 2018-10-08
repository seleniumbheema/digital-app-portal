import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SetPasswordComponent } from './set-password.component';

@Component({
  selector: 'es-auth-set-password',
  template: '',
})
class MockSetPasswordComponent { }

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SetPasswordComponent,
        MockSetPasswordComponent,
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
