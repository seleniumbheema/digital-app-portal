import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarModule } from 'ng-sidebar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../../components/shared/shared.module';
import { PortalComponent } from './portal.component';
import { PortalHeaderComponent } from '../../components/view/header/header.component';
import { CustomerDataService } from '../../components/services/customer-data.service';
import { CookieService } from 'ngx-cookie';
import { HttpService } from '../../components/services/http.service';
import { AuthService } from '../../components/auth/auth.service';
import { BrandUrlPipe } from '../../components/pipes/brand-url.pipe';

@Component({
  selector: 'es-portal-header',
  template: '<div>Placeholder: es-portal-header</div>',
})
class MockPortalHeaderComponent { }

@Component({
  selector: 'es-nav-bar',
  template: '<div>Placeholder: es-nav-bar</div>',
})
class MockPortalNavBarComponent { }

class MockHttpService { }

class MockAuthService { }

class MockCookieService {
  get(key: string) {
    return key;
  }
}

describe('PortalComponent', () => {
  let component: PortalComponent;
  let fixture: ComponentFixture<PortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PortalComponent,
        MockPortalHeaderComponent,
        MockPortalNavBarComponent,
      ],
      providers: [
        CustomerDataService,
        { provide: 'Window', useValue: window },
        { provide: CookieService, useClass: MockCookieService },
        { provide: HttpService, useClass: MockHttpService },
        { provide: AuthService, useClass: MockAuthService },
        BrandUrlPipe,
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        SidebarModule,
        NoopAnimationsModule,
      ],
    });

    TestBed.overrideModule(SharedModule, {
      remove: {
        declarations: [PortalHeaderComponent],
        exports: [PortalHeaderComponent],
      },
    });

    fixture = TestBed.createComponent(PortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the activated route if outlet is activated', () => {
    const outlet = {
      isActivated: true,
      activatedRoute: 'route',
    };
    expect(component.getRouterOutletState(outlet)).toEqual(outlet.activatedRoute);
  });
});
