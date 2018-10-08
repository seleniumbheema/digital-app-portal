import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { TestModule } from '../../../../../test-helpers';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoutComponent,
      ],
      imports: [
        TestModule,
      ],
      providers: [
        CustomerDataService,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when closeModal is called', async(() => {
    spyOn(sessionStorage, 'setItem').and.stub();
    component.closeModal();
    fixture.whenStable().then(() => {
      expect(component.showQuestionnaire).toBeFalse();
      expect(component.showThankYou).toBeTrue();
      expect(sessionStorage.setItem).toHaveBeenCalledWith('surveySeen', 'true');
    });
  }));

  it('should not show the modal if already been seen in current session', async(() => {
    spyOn(sessionStorage, 'getItem').and.returnValue('true');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.showQuestionnaire).toBeFalse();
      expect(component.showThankYou).toBeTrue();
      expect(sessionStorage.getItem).toHaveBeenCalledWith('surveySeen');
    });
  }));

});
