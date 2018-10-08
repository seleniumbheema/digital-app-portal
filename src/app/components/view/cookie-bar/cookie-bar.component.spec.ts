
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDataService } from '../../services/customer-data.service';
import { CookieBarComponent } from './cookie-bar.component';

// const mockBrandData = {
//   companyCode: 'E',
//   brandName: 'esure',
//   brandCode: 'ES',
//   motorProductType: 'MOTOR',
//   homeProductType: 'HOME',
//   motorProductCode: 'EM',
//   homeProductCode: 'EH',
//   motorCustomerService: '0345 607 0394',
// };

class MockCustomerDataService {
  // public brandConfig = mockBrandData;
}

describe('CookieBarComponent', () => {
  let component: CookieBarComponent;
  let fixture: ComponentFixture<CookieBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CookieBarComponent,
      ],
      imports: [
      ],
      providers: [
        { provide: CustomerDataService, useClass: MockCustomerDataService },
      ],
    });

    fixture = TestBed.createComponent(CookieBarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
