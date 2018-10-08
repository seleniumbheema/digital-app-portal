import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TestModule } from '../../../test-helpers';
import { CustomerDataService } from '../../components/services/customer-data.service';
import { AuthComponent } from './auth.component';
import { CookieBarComponent } from '../../components/view/cookie-bar/cookie-bar.component';
import { BrowserWarningComponent } from '../../components/view/browser-warning/browser-warning.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  class MockJwtHelperService {
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent,
        CookieBarComponent,
        BrowserWarningComponent,
      ],
      providers: [
        CustomerDataService,
        { provide: JwtHelperService, useClass: MockJwtHelperService },
      ],
      imports: [
        TestModule,
      ],
    });

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
