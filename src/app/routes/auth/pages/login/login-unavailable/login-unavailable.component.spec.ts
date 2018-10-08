import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUnavailableComponent } from './login-unavailable.component';
import { TestModule } from '../../../../../../test-helpers';

describe('LoginUnavailableComponent', () => {
  let component: LoginUnavailableComponent;
  let fixture: ComponentFixture<LoginUnavailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginUnavailableComponent,
      ],
      imports: [
        TestModule,
      ],
      providers: [
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUnavailableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
