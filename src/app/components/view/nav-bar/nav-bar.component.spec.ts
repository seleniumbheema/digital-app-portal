import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../shared/shared.module';
import { CustomerDataService } from '../../services/customer-data.service';
import { AuthService } from '../../auth/auth.service';
import { NavBarComponent } from './nav-bar.component';

class MockAuthService {
  public isUserLoggedIn() {
    return false;
  }

  public logout() {
    return true;
  }
}
const mockCustomerDataService = {

  sideBar: {
    opened: true,
    autoCollapseWidth: 1023,
    fixedNav: false,
    navStyle: 'over',
    toggle: () => {
    },
  },

  initSidebar: async (): Promise<boolean> => {
    return await true;
  },
};
const mockWindow = { innerWidth: 1030 } as Window;

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavBarComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CustomerDataService, useValue: mockCustomerDataService },
        { provide: 'Window', useValue: mockWindow },
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
