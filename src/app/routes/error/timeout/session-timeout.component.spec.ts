import { TestBed } from '@angular/core/testing';

import { SessionTimeoutComponent } from './session-timeout.component';
import { CustomerDataService } from '../../../components/services/customer-data.service';
import { TestModule } from '../../../../test-helpers';

describe('SessionTimeout Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        SessionTimeoutComponent,
      ],
      providers: [
        CustomerDataService,
      ],
    });
  });

  it('should create SessionTimeout component instance', () => {
    const fixture = TestBed.createComponent(SessionTimeoutComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
