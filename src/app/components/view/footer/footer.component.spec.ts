import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../shared/shared.module';
import { CustomerDataService } from '../../services/customer-data.service';

import { PortalFooterComponent } from './footer.component';

const mockBrandData = {
  companyCode: 'E',
  brandName: 'esure',
  brandCode: 'ES',
  motorProductType: 'MOTOR',
  homeProductType: 'HOME',
  motorProductCode: 'EM',
  homeProductCode: 'EH',
  motorCustomerService: '0345 607 0394',
};

class MockCustomerDataService {
  public brandConfig = mockBrandData;
}

describe('PortalFooterComponent', () => {
  let component: PortalFooterComponent;
  let fixture: ComponentFixture<PortalFooterComponent>;
  let currentYear;

  beforeAll(() => {
    currentYear = new Date().getFullYear();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: CustomerDataService, useClass: MockCustomerDataService },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalFooterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set year to current year', () => {
    expect(component.year).toBe(currentYear);
  });

  // xit('should set the copyright message in the template', () => {
  //   const element = fixture.debugElement.query(By.css('.copyright'));
  //
  //   expect(element.nativeElement.textContent).toContain(mockBrandData.brandName);
  //   expect(element.nativeElement.textContent).toContain(currentYear);
  // });
});
