import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModule } from '../../../../test-helpers';
import { Customer } from '../../../models/customer';
import { CustomerDataService } from '../../../components/services/customer-data.service';
import { SpecialOffersComponent } from './special-offers.component';

const customerObject = {
  firstName: 'Elizabeth',
  lastName: 'Windsor',
};

describe('SpecialOffersComponent', () => {
  let component: SpecialOffersComponent;
  let fixture: ComponentFixture<SpecialOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpecialOffersComponent,
      ],
      providers: [
        CustomerDataService,
      ],
      imports: [
        TestModule,
      ],
    });

    TestBed.get(CustomerDataService).customer = new Customer(customerObject);
    fixture = TestBed.createComponent(SpecialOffersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
