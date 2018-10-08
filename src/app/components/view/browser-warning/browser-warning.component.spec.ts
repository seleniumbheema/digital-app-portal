import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserWarningComponent } from './browser-warning.component';
import { CustomerDataService } from '../../services/customer-data.service';

class MockCustomerDataService {
}

describe('BrowserWarningComponent', () => {
  let component: BrowserWarningComponent;
  let fixture: ComponentFixture<BrowserWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrowserWarningComponent,
      ],
      providers: [{ provide: CustomerDataService, useClass: MockCustomerDataService }],
      imports: [],
    });
    fixture = TestBed.createComponent(BrowserWarningComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning banner if detected version is lower than specified version', () => {
    component.browserDetect.mobile = true;
    component.browserDetect.name = 'Chrome';
    component.browserDetect.version = 46;
    fixture.detectChanges();
    expect(component.showWarningBanner).toBeTrue();
  });

  it('should not show warning banner if detected version is equal or higher than specified version', () => {
    component.browserDetect.mobile = false;
    component.browserDetect.name = 'Safari';
    component.browserDetect.version = 8;
    fixture.detectChanges();
    expect(component.showWarningBanner).toBeFalse();
  });

  it('should show warning banner if detected browser name is not one we have defined', () => {
    component.browserDetect.mobile = false;
    component.browserDetect.name = 'NewBrowser';
    component.browserDetect.version = 40;
    fixture.detectChanges();
    expect(component.showWarningBanner).toBeTrue();
  });
});
