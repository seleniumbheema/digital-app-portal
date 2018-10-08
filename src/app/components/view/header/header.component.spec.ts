import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../../shared/shared.module';
import { CustomerDataService, SidebarModel } from '../../services/customer-data.service';
import { HttpService } from '../../services/http.service';
import { PortalHeaderComponent } from './header.component';

class MockCustomerDataService {

  public sideBar: SidebarModel = {
    opened: true,
    autoCollapseWidth: 1023,
    fixedNav: false,
    navStyle: 'over',
    toggle: () => { },
  };
}

const cookieSeen = false;

class MockCookieService {
  public get() {
    return cookieSeen;
  }

  public put() {
    return;
  }
}

class MockHttpService { }

describe('PortalHeaderComponent', () => {
  let component: PortalHeaderComponent;
  let fixture: ComponentFixture<PortalHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: CustomerDataService, useClass: MockCustomerDataService },
        { provide: CookieService, useClass: MockCookieService },
        { provide: HttpService, useClass: MockHttpService },
      ],
    });

    fixture = TestBed.createComponent(PortalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the brand name in the template', () => {
    const element = fixture.debugElement.query(By.css('.logo'));
    expect(element.nativeElement.textContent).toBe(ESURE_GLOBALS.BRAND_CONFIG.brandName);
  });

  it('should display the greeting as morning if hours less than 12', () => {
    spyOn(Date.prototype, 'getHours').and.returnValue(11);
    fixture = TestBed.createComponent(PortalHeaderComponent);
    component = fixture.componentInstance;
    expect(component.greeting).toEqual('morning');
  });

  it('should display the greeting as afternoon if hours more than 12, less than 18', () => {
    spyOn(Date.prototype, 'getHours').and.returnValue(16);
    fixture = TestBed.createComponent(PortalHeaderComponent);
    component = fixture.componentInstance;
    expect(component.greeting).toEqual('afternoon');
  });

  it('should display the greeting as evening if hours more than 18', () => {
    spyOn(Date.prototype, 'getHours').and.returnValue(20);
    fixture = TestBed.createComponent(PortalHeaderComponent);
    component = fixture.componentInstance;
    expect(component.greeting).toEqual('evening');
  });

  it('should set nav bar to closed if in mobile view', () => {
    fixture = TestBed.createComponent(PortalHeaderComponent);
    component.customerDataService.sideBar.opened = true;
    component = fixture.componentInstance;
    component.closeNavBarIfMobileView(900);
    expect(component.customerDataService.sideBar.opened).toBeFalse();
  });

  it('should do nothing if in desktop view', () => {
    fixture = TestBed.createComponent(PortalHeaderComponent);
    component.customerDataService.sideBar.opened = true;
    component = fixture.componentInstance;
    component.closeNavBarIfMobileView(1040);
    expect(component.customerDataService.sideBar.opened).toBeTrue();
  });

});
